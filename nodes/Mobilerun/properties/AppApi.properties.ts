import { INodeProperties } from 'n8n-workflow';
export const AppResources = (): INodeProperties[] => {
	return [
		/*
			APP STORE PROPERTIES
		*/

		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: ['apps'] } },
			options: [
				{
					name: 'List Apps',
					value: 'listApps',
					description: 'Retrieves a paginated list of apps with filtering and search capabilities',
					action: 'List apps',
					routing: {
						request: {
							method: 'GET',
							url: '/apps',

						},
					},
				},
			],
			default: 'listApps',
		},

		{
			displayName: 'Page',
			name: 'page',
			type: 'number',
			default: 1,
			displayOptions: {
				show: {
					resource: ['apps'],
					operation: ['listApps'],
				},
			},
			routing: {
				send: {
					paginate: true,
					type: 'query',
					property: 'page',
					value: '={{ $value }}'
				},
			}
		},
	]
}
