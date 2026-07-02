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
							url: 'apps',

						},
					},
				},
			],
			default: 'listApps',
		},

		{
			displayName: 'Page Size',
			name: 'pageSize',
			type: 'number',
			default: 10,
			displayOptions: {
				show: {
					resource: ['apps'],
					operation: ['listApps'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'pageSize',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			options: [
				{ name: 'All', value: 'all' },
				{ name: 'Available', value: 'available' },
				{ name: 'Failed', value: 'failed' },
				{ name: 'Queued', value: 'queued' },
			],
			default: 'all',
			displayOptions: {
				show: {
					resource: ['apps'],
					operation: ['listApps'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'status',
					value: '={{ $value || undefined }}',
				},
			},
		},
		{
			displayName: 'Platform',
			name: 'platform',
			type: 'options',
			options: [
				{ name: 'All', value: 'all' },
				{ name: 'Android', value: 'android' },
				{ name: 'iOS', value: 'ios' },
			],
			default: 'all',
			displayOptions: {
				show: {
					resource: ['apps'],
					operation: ['listApps'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'platform',
					value: '={{ $value || undefined }}',
				},
			},
		},
		{
			displayName: 'Search Query',
			name: 'query',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['apps'],
					operation: ['listApps'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'query',
					value: '={{ $value || undefined }}',
				},
			},
		},
		{
			displayName: 'Sort By',
			name: 'sortBy',
			type: 'options',
			options: [
				{ name: 'Created At', value: 'createdAt' },
				{ name: 'Name', value: 'name' },
			],
			default: 'createdAt',
			displayOptions: {
				show: {
					resource: ['apps'],
					operation: ['listApps'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'sortBy',
					value: '={{ $value || undefined }}',
				},
			},
		},
		{
			displayName: 'Order',
			name: 'order',
			type: 'options',
			options: [
				{ name: 'Ascending', value: 'asc' },
				{ name: 'Descending', value: 'desc' },
			],
			default: 'desc',
			displayOptions: {
				show: {
					resource: ['apps'],
					operation: ['listApps'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'order',
					value: '={{ $value || undefined }}',
				},
			},
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
