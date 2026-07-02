import {
	ApplicationError,
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'cancelled']);

type StreamReaderResult = { done: boolean; value?: Uint8Array };
type StreamReader = {
	read: () => Promise<StreamReaderResult>;
	cancel: () => Promise<void>;
};
type StreamBody = {
	getReader: () => StreamReader;
};
type StreamFetchResponse = {
	ok: boolean;
	status: number;
	statusText: string;
	body?: StreamBody;
};
type RuntimeFetch = (
	url: string,
	init: {
		method: string;
		headers: Record<string, string>;
		signal?: unknown;
	},
) => Promise<StreamFetchResponse>;
type RuntimeAbortController = {
	signal: { aborted: boolean };
	abort: () => void;
};
type RuntimeAbortControllerConstructor = new () => RuntimeAbortController;
type RuntimeTextDecoder = {
	decode: (input?: Uint8Array, options?: { stream?: boolean }) => string;
};
type RuntimeTextDecoderConstructor = new () => RuntimeTextDecoder;

function parseSseEventBlocks(buffer: string): { blocks: string[]; remainder: string } {
	const normalized = buffer.replace(/\r\n/g, '\n');
	const blocks: string[] = [];
	let start = 0;

	for (let i = 0; i < normalized.length - 1; i++) {
		if (normalized[i] === '\n' && normalized[i + 1] === '\n') {
			const block = normalized.slice(start, i).trim();
			if (block.length > 0) {
				blocks.push(block);
			}
			start = i + 2;
			i += 1;
		}
	}

	return {
		blocks,
		remainder: normalized.slice(start),
	};
}

function decodeSseBlock(block: string): { event?: string; data?: string } {
	const lines = block.split('\n');
	let eventName: string | undefined;
	const dataLines: string[] = [];

	for (const line of lines) {
		if (line.startsWith(':')) {
			continue;
		}

		if (line.startsWith('event:')) {
			eventName = line.slice('event:'.length).trim();
			continue;
		}

		if (line.startsWith('data:')) {
			dataLines.push(line.slice('data:'.length).trimStart());
		}
	}

	if (dataLines.length === 0 && !eventName) {
		return {};
	}

	return {
		event: eventName,
		data: dataLines.length ? dataLines.join('\n') : undefined,
	};
}

function tryParseJson(data?: string): IDataObject | undefined {
	if (!data) {
		return undefined;
	}

	try {
		return JSON.parse(data) as IDataObject;
	} catch {
		return undefined;
	}
}

function extractStatus(parsed: IDataObject | undefined): string | undefined {
	if (!parsed) {
		return undefined;
	}

	const directStatus = parsed.status;
	if (typeof directStatus === 'string' && directStatus.length > 0) {
		return directStatus;
	}

	const nested = parsed.data as IDataObject | undefined;
	const nestedStatus = nested?.status;
	if (typeof nestedStatus === 'string' && nestedStatus.length > 0) {
		return nestedStatus;
	}

	return undefined;
}

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
	const runtime = globalThis as unknown as {
		fetch?: RuntimeFetch;
		AbortController?: RuntimeAbortControllerConstructor;
		TextDecoder?: RuntimeTextDecoderConstructor;
		setTimeout?: (cb: () => void, ms: number) => unknown;
		clearTimeout?: (handle: unknown) => void;
	};

	if (!runtime.fetch || !runtime.TextDecoder || !runtime.setTimeout || !runtime.clearTimeout || !runtime.AbortController) {
		throw new ApplicationError('Runtime is missing required stream APIs (fetch/AbortController/TextDecoder/timers)');
	}

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
	let streamEventCount = 0;
	let finalStatus = 'created';
	let lastEventName: string | undefined;
	let lastEventPayload: IDataObject | undefined;

	const abortController = new runtime.AbortController();
	const timeoutHandle = runtime.setTimeout(() => {
		abortController.abort();
	}, maxWaitSeconds * 1000);

	try {
		const streamResponse = await runtime.fetch(streamUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'text/event-stream',
			},
			signal: abortController.signal,
		});

		if (!streamResponse.ok) {
			throw new NodeOperationError(this.getNode(), 'Failed to open task stream', {
				description: `status=${streamResponse.status}, statusText=${streamResponse.statusText}, streamUrl=${streamUrl}`,
			});
		}

		if (!streamResponse.body) {
			throw new ApplicationError('Mobilerun stream response did not include a readable body');
		}

		const reader = streamResponse.body.getReader();
		const decoder = new runtime.TextDecoder();
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				if (buffer.trim().length > 0) {
					const block = buffer.trim();
					const decoded = decodeSseBlock(block);
					if (decoded.data || decoded.event) {
						streamEventCount += 1;
						lastEventName = decoded.event;
						if (decoded.data !== '[DONE]') {
							const parsed = tryParseJson(decoded.data);
							if (parsed) {
								lastEventPayload = parsed;
							}
							const statusFromEvent = extractStatus(parsed);
							if (statusFromEvent) {
								finalStatus = statusFromEvent;
							}
						}
					}
				}
				break;
			}

			buffer += decoder.decode(value, { stream: true });
			const { blocks, remainder } = parseSseEventBlocks(buffer);
			buffer = remainder;

			for (const block of blocks) {
				const decoded = decodeSseBlock(block);
				if (!decoded.data && !decoded.event) {
					continue;
				}

				streamEventCount += 1;
				lastEventName = decoded.event;

				if (decoded.data === '[DONE]') {
					continue;
				}

				const parsed = tryParseJson(decoded.data);
				if (parsed) {
					lastEventPayload = parsed;
				}

				const statusFromEvent = extractStatus(parsed);
				if (statusFromEvent) {
					finalStatus = statusFromEvent;
				}

				if (TERMINAL_STATUSES.has(finalStatus)) {
					await reader.cancel();
					break;
				}
			}

			if (TERMINAL_STATUSES.has(finalStatus)) {
				break;
			}
		}
	} catch (error) {
		const aborted = abortController.signal.aborted === true;
		if (aborted) {
			throw new NodeOperationError(this.getNode(), 'Timed out waiting for task stream to reach terminal status', {
				description: `taskId=${taskId}, lastStatus=${finalStatus}, maxWaitSeconds=${maxWaitSeconds}`,
			});
		}

		throw error;
	} finally {
		runtime.clearTimeout(timeoutHandle);
	}

	if (!TERMINAL_STATUSES.has(finalStatus)) {
		const statusResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'mobilerunApi', {
			method: 'GET',
			url: `https://api.mobilerun.ai/v1/tasks/${taskId}/status`,
			json: true,
		}) as IDataObject;

		const fallbackStatus = statusResponse.status;
		if (typeof fallbackStatus === 'string' && fallbackStatus.length > 0) {
			finalStatus = fallbackStatus;
		}

		if (!TERMINAL_STATUSES.has(finalStatus)) {
			throw new NodeOperationError(this.getNode(), 'Task stream ended before terminal status was reached', {
				description: `taskId=${taskId}, lastStatus=${finalStatus}, streamEvents=${streamEventCount}`,
			});
		}
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
				streamEventCount,
				streamUrl,
				lastEventName,
				lastEventPayload,
				task: taskDetailsResponse.task ?? taskDetailsResponse,
				rawTaskResponse: taskDetailsResponse,
			},
			pairedItem: items[0]?.pairedItem,
		},
	];
}
