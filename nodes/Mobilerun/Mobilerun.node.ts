import { MobilerunResources } from './Mobilerun.properties';
import { INodeType, INodeTypeDescription, NodeConnectionTypes, ILoadOptionsFunctions, JsonObject, NodeApiError } from 'n8n-workflow';
import { version } from '../../package.json';

export class Mobilerun implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mobilerun',
		name: 'mobilerun',
		group: ['transform'],
		version: 1,
		icon: 'file:mobilerun-logo.svg',
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Access the MobileRun Cloud API',
		defaults: {
			name: 'Mobilerun',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'mobilerunApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.mobilerun.ai/v1/',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': `mobilerun-n8n/${version}`,
			},
			json: true,
		},

		properties: [
			...MobilerunResources()
		],
	};

	methods = {
		loadOptions: {
			async loadLlmModels(this: ILoadOptionsFunctions) {
				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mobilerunApi',
						{
							method: 'GET',
							url: 'https://api.mobilerun.ai/v1/models',
							returnFullResponse: true,
						},
					) as { body?: { models?: Array<{ id: string }> } };

					const models = response?.body?.models || [];
					return models.map((model) => ({
						name: model.id,
						value: model.id,
					}));
				} catch (error) {
					// Fallback to hardcoded
					return [
						{ name: 'Anthropic Claude Sonnet 4.6', value: 'anthropic/claude-sonnet-4.6' },
						{ name: 'Google Gemini 3.5 Flash', value: 'google/gemini-3.5-flash' },
						{ name: 'Google Gemini 3.1 Pro Preview', value: 'google/gemini-3.1-pro-preview' },
						{ name: 'MobileRun Mobile Agent Fast', value: 'mobilerun/mobile-agent-fast' },
						{ name: 'MobileRun Mobile Agent Thinking', value: 'mobilerun/mobile-agent-thinking' },
						{ name: 'OpenAI GPT-5.4', value: 'openai/gpt-5.4' },
						{ name: 'OpenAI GPT-5.4 Mini', value: 'openai/gpt-5.4-mini' },
						{ name: 'xAI Grok 4.3', value: 'x-ai/grok-4.3' }
					];
				}
			},

			async loadDevices(this: ILoadOptionsFunctions) {
				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mobilerunApi',
						{
							method: 'GET',
							url: 'https://api.mobilerun.ai/v1/devices',
							returnFullResponse: true,
						},
					) as { body?: { items?: Array<{ id: string; name?: string; type?: string; state?: string }> } };

					const devices = response?.body?.items || [];
					const options = devices.map((device) => {
						const typeStr = device.type ? ` (${device.type})` : '';
						const name = device.name ? `${device.name}${typeStr}` : `${device.type || 'Device'} (${device.id.slice(0, 8)})`;
						return {
							name,
							value: device.id,
						};
					});
					return options;
				} catch (error) {
					// Return empty option if API fails
					return [{ name: 'Auto-Select Device', value: '' }];
				}
			},

			async loadApps(this: ILoadOptionsFunctions) {
				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'mobilerunApi',
						{
							method: 'GET',
							url: 'https://api.mobilerun.ai/v1/apps',
							returnFullResponse: true,
						},
					) as { body?: { items?: Array<{ bundleId: string; displayName?: string; platform?: string }> } };

					const apps = response?.body?.items || [];
					return apps.map((app) => ({
						name: `${app.displayName || app.bundleId} (${app.platform || 'unknown'})`,
						value: app.bundleId,
					}));
				} catch (error) {
					// Return empty if API fails - user can enter manually
					throw new NodeApiError(this.getNode(), error as JsonObject)
				}
			},
		}
	};
}

