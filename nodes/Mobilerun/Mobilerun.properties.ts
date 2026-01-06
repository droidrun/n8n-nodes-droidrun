import { INodeProperties } from 'n8n-workflow';
import { AppResources } from './properties/AppApi.properties';
import { TaskResources } from './properties/TaskApi.properties';
import { CredentialResources } from './properties/CredentialApi.properties';
import { DeviceResources } from './properties/DeviceApi.properties';
export const MobilerunResources = (): INodeProperties[] => {
	return [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			options: [
				{ name: 'Appstore', value: 'apps' },
				{ name: 'Device', value: 'device' },
				{ name: 'Device Credential', value: 'credential' },
				{ name: 'Inspect Task', value: 'inspectTask' },
				{ name: 'Manage Task', value: 'manageTask' },
			],
			default: 'inspectTask',
			noDataExpression: true,
		},

		...TaskResources(),
		...AppResources(),
		...CredentialResources(),
		...DeviceResources()
	]
}
