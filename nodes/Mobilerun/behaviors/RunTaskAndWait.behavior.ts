import {
	ApplicationError,
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'cancelled']);

function sleep(ms: number): Promise<void> {
	const schedule = (globalThis as unknown as { setTimeout?: (cb: () => void, delay: number) => unknown }).setTimeout;
	if (!schedule) {
		throw new ApplicationError('setTimeout is not available in this runtime');
	}
	return new Promise((resolve) => {
		schedule(resolve, ms);
	});
}

export async function runTaskAndWaitPostReceive(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const pollIntervalSeconds = this.getNodeParameter('pollIntervalSeconds') as number;
	const maxWaitSeconds = this.getNodeParameter('maxWaitSeconds') as number;

	const runTaskResponse = (response.body as IDataObject | undefined) ?? {};
	const taskId = (runTaskResponse.id ?? runTaskResponse.taskId) as string | undefined;

	if (!taskId) {
		throw new NodeOperationError(this.getNode(), 'Task started but no task ID returned', {
			description: JSON.stringify(runTaskResponse),
		});
	}

	const startedAt = Date.now();
	let pollCount = 0;
	let finalStatus = 'created';

	while (true) {
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

		if ((Date.now() - startedAt) >= maxWaitSeconds * 1000) {
			throw new NodeOperationError(this.getNode(), 'Timed out waiting for task to reach terminal status', {
				description: `taskId=${taskId}, lastStatus=${finalStatus}, maxWaitSeconds=${maxWaitSeconds}`,
			});
		}

		pollCount += 1;
		await sleep(pollIntervalSeconds * 1000);
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
				pollCount,
				task: taskDetailsResponse.task ?? taskDetailsResponse,
				rawTaskResponse: taskDetailsResponse,
			},
			pairedItem: items[0]?.pairedItem,
		},
	];
}
