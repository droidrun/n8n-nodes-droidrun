import { MobilerunResources } from './Mobilerun.properties';
import { INodeType, INodeTypeDescription, NodeConnectionTypes, ILoadOptionsFunctions } from 'n8n-workflow';
import { version } from '../../package.json';

export class Mobilerun implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mobilerun',
		name: 'mobilerun',
		group: ['transform'],
		version: 1,
		icon: 'file:droidrun-logo.svg',
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Access the Mobilerun Cloud Api',
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
			baseURL: 'https://api.mobilerun.ai/v1',
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
							url: 'https://litellm.droidrun.ai/v1/models',
							returnFullResponse: true,
						},
					) as { body?: { data?: Array<{ id: string; object: string }> } };

					const models = response?.body?.data || [];
					return models.map((model) => ({
						name: model.id,
						value: model.id,
					}));
				} catch (error) {
					// Fallback to hardcoded
					return [
						{ name: 'OpenAI GPT-5', value: 'openai/gpt-5' },
						{ name: 'Google Gemini 2.5 Flash', value: 'google/gemini-2.5-flash' },
						{ name: 'Google Gemini 2.5 Pro', value: 'google/gemini-2.5-pro' },
						{ name: 'Google Gemini 3 Pro Preview', value: 'google/gemini-3-pro-preview' },
						{ name: 'Anthropic Claude Sonnet 4.5', value: 'anthropic/claude-sonnet-4.5' },
						{ name: 'MiniMax M2', value: 'minimax/minimax-m2' },
						{ name: 'MoonshotAI Kimi K2', value: 'moonshotai/kimi-k2' },
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
					) as { body?: { items?: Array<{ id: string; name?: string }> } };

					const devices = response?.body?.items || [];
					const options = devices.map((device) => ({
						name: device.name || device.id,
						value: device.id,
					}));
					// Add empty option for no device selection
					options.unshift({ name: 'Auto-Select Device', value: '' });
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
					) as { body?: { apps?: Array<{ packageName: string; displayName?: string; source?: string }> } };

					const apps = response?.body?.apps || [];
					return apps.map((app) => ({
						name: `${app.displayName || app.packageName} (${app.source || 'unknown'})`,
						value: app.packageName,
					}));
				} catch (error) {
					// Return empty if API fails - user can enter manually
					return [];
				}
			},

			async loadVpnCountries(this: ILoadOptionsFunctions) {
				return [
					{ name: 'None', value: 'none' },
					{ name: 'United States', value: 'US' },
					{ name: 'Brazil', value: 'BR' },
					{ name: 'France', value: 'FR' },
					{ name: 'Germany', value: 'DE' },
					{ name: 'India', value: 'IN' },
					{ name: 'Japan', value: 'JP' },
					{ name: 'South Korea', value: 'KR' },
					{ name: 'South Africa', value: 'ZA' },
				];
			},
		},
	};
}

