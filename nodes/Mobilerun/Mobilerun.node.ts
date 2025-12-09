import { MobilerunResources } from './Mobilerun.properties';
import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import { version } from '../../package.json';

export class Mobilerun implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mobilerun Tasks',
		name: 'mobilerun',
		group: ['transform', 'trigger'],
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
		webhooks: [{
			name: 'default',
			httpMethod: 'GET',
			path: '/'
		}],

		properties: [
			...MobilerunResources()
		]
	};
};

