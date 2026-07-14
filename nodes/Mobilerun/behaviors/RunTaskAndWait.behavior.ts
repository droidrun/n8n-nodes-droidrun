import {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'cancelled']);

declare function setTimeout(callback: (...args: any[]) => void, ms?: number, ...args: any[]): any;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getDefaultTaskAttachUrl(taskId: string): string {
	return `https://api.mobilerun.ai/v1/tasks/${taskId}/attach`;
}

function resolveTaskEventStreamUrl(taskId: string, streamUrl?: string): string {
	const fallback = getDefaultTaskAttachUrl(taskId);

	if (!streamUrl || typeof streamUrl !== 'string' || streamUrl.trim().length === 0) {
		return fallback;
	}

	const trimmed = streamUrl.trim();

	// Some task-create responses include device websocket streams. For run-and-wait
	// we need task SSE events, so ignore non-task stream URLs.
	if (trimmed.startsWith('ws://') || trimmed.startsWith('wss://')) {
		return fallback;
	}

	if (trimmed.includes('/devices/') && trimmed.includes('/stream')) {
		return fallback;
	}

	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
		if (trimmed.includes('/tasks/')) {
			return trimmed;
		}
		return fallback;
	}

	if (trimmed.startsWith('/')) {
		if (trimmed.includes('/tasks/')) {
			return `https://api.mobilerun.ai/v1${trimmed}`;
		}
		return fallback;
	}

	if (trimmed.includes('/tasks/')) {
		return `https://api.mobilerun.ai/v1/${trimmed}`;
	}

	return fallback;
}

export async function runTaskAndWaitPostReceive(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const maxWaitSeconds = this.getNodeParameter('maxWaitSeconds') as number;

	const runTaskResponse = (response.body as IDataObject | undefined) ?? {};
	const taskId = (runTaskResponse.id ?? runTaskResponse.taskId) as string | undefined;
	const streamUrlFromResponse = runTaskResponse.streamUrl as string | undefined;

	if (!taskId) {
		throw new NodeOperationError(this.getNode(), 'Task started but no task ID returned', {
			description: JSON.stringify(runTaskResponse),
		});
	}

	const credentials = await this.getCredentials('mobilerunApi');
	const token = credentials.token as string | undefined;

	if (!token) {
		throw new NodeOperationError(this.getNode(), 'Missing MobileRun API token in credentials');
	}

	const streamUrl = resolveTaskEventStreamUrl(taskId, streamUrlFromResponse);
	const startedAt = Date.now();
	let finalStatus = 'created';

	const pollIntervalMs = 5000;
	const maxWaitMs = maxWaitSeconds * 1000;

	while (Date.now() - startedAt < maxWaitMs) {
		const statusResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'mobilerunApi', {
			method: 'GET',
			url: `https://api.mobilerun.ai/v1/tasks/${taskId}/status`,
			json: true,
		}) as IDataObject;

		const currentStatus = statusResponse.status;
		if (typeof currentStatus === 'string' && currentStatus.length > 0) {
			finalStatus = currentStatus;
		}

		if (TERMINAL_STATUSES.has(finalStatus)) {
			break;
		}

		const elapsed = Date.now() - startedAt;
		const remaining = maxWaitMs - elapsed;
		if (remaining <= 0) {
			break;
		}
		const sleepTime = Math.min(pollIntervalMs, remaining);
		await sleep(sleepTime);
	}

	if (!TERMINAL_STATUSES.has(finalStatus)) {
		throw new NodeOperationError(this.getNode(), 'Timed out waiting for task to reach terminal status', {
			description: `taskId=${taskId}, lastStatus=${finalStatus}, maxWaitSeconds=${maxWaitSeconds}`,
		});
	}

	const taskDetailsResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'mobilerunApi', {
		method: 'GET',
		url: `https://api.mobilerun.ai/v1/tasks/${taskId}`,
		json: true,
	}) as IDataObject;

	return [
		{
			json: {
				taskId,
				finalStatus,
				isTerminal: true,
				waitedMs: Date.now() - startedAt,
				streamEventCount: 0,
				streamUrl,
				lastEventName: undefined,
				lastEventPayload: undefined,
				task: taskDetailsResponse.task ?? taskDetailsResponse,
				rawTaskResponse: taskDetailsResponse,
			},
			pairedItem: items[0]?.pairedItem,
		},
	];
}
