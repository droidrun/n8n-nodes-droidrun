import { INodeProperties } from 'n8n-workflow';
import { AppResources } from './properties/AppApi.properties';
import { TaskResources } from './properties/TaskApi.properties';
import { CredentialResources } from './properties/CredentialApi.properties';
export const MobilerunResources = (): INodeProperties[] => {
	return [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			options: [
				{ name: 'Inspect Task', value: 'inspectTask' },
				{ name: 'Manage Task', value: 'manageTask' },
				{ name: 'Device Credential', value: 'credential' },
				{ name: 'Appstore', value: 'apps' },
			],
			default: 'inspectTask',
			noDataExpression: true,
		},

		...TaskResources(),
		...AppResources(),
		...CredentialResources()
	]
}
