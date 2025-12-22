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
						{ name: 'claude-3-7-sonnet-latest', value: 'claude-3-7-sonnet-latest' },
						{ name: 'claude-sonnet-4-20250514', value: 'claude-sonnet-4-20250514' },
						{ name: 'gemini-2.5-flash', value: 'gemini-2.5-flash' },
						{ name: 'gemini-2.5-pro', value: 'gemini-2.5-pro' },
						{ name: 'gpt-4.1', value: 'gpt-4.1' },
						{ name: 'gpt-4.1-mini', value: 'gpt-4.1-mini' },
						{ name: 'gpt-4o', value: 'gpt-4o' },
						{ name: 'gpt-4o-mini', value: 'gpt-4o-mini' },
						{ name: 'gpt-o3', value: 'gpt-o3' },
						{ name: 'gpt-o4-mini', value: 'gpt-o4-mini' },
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
						name: app.displayName || app.packageName,
						value: app.packageName,
					}));
				} catch (error) {
					// Return empty if API fails - user can enter manually
					return [];
				}
			},
		},
	};
}

