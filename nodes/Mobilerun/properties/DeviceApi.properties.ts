import { INodeProperties } from 'n8n-workflow';

export const DeviceResources = (): INodeProperties[] => {
	return [
		/*
			DEVICE PROPERTIES
		*/

		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: ['device'] } },
			options: [
				{
					name: 'Delete Device',
					value: 'deleteDevice',
					description: 'Delete a specific device',
					action: 'Delete device',
					routing: {
						request: {
							method: 'DELETE',
							url: '/devices/{{$parameter.deviceId}}',
						},
					},
				},
				{
					name: 'Get Device',
					value: 'getDevice',
					description: 'Get details of a specific device',
					action: 'Get device details',
					routing: {
						request: {
							method: 'GET',
							url: '/devices/{{$parameter.deviceId}}',
						},
					},
				},
				{
					name: 'Get Device Tasks',
					value: 'getDeviceTasks',
					description: 'Get tasks for a specific device',
					action: 'Get device tasks',
					routing: {
						request: {
							method: 'GET',
							url: '/devices/{{$parameter.deviceId}}/tasks',
						},
					},
				},
				{
					name: 'List Devices',
					value: 'listDevices',
					description: 'Retrieves a paginated list of devices with filtering and search capabilities',
					action: 'List devices',
					routing: {
						request: {
							method: 'GET',
							url: '/devices',
						},
					},
				},
				{
					name: 'Provision Device',
					value: 'provisionDevice',
					description: 'Provision a new device',
					action: 'Provision a new device',
					routing: {
						request: {
							method: 'POST',
							url: '/devices',
						},
					},
				},
				{
					name: 'Wait for Device',
					value: 'waitForDevice',
					description: 'Wait for a device to be ready',
					action: 'Wait for device',
					routing: {
						request: {
							method: 'GET',
							url: '/devices/{{$parameter.deviceId}}/wait',
						},
					},
				},
			],
			default: 'listDevices',
		},

		// Parameters for List Devices
		{
			displayName: 'State',
			name: 'state',
			type: 'options',
			options: [
				{ name: 'Assigned', value: 'assigned' },
				{ name: 'Creating', value: 'creating' },
				{ name: 'Ready', value: 'ready' },
				{ name: 'Terminated', value: 'terminated' },
				{ name: 'Unknown', value: 'unknown' },
			],
			default: 'ready',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['listDevices'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'state',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Country',
			name: 'country',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['listDevices'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'country',
					value: '={{ $value }}',
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
					resource: ['device'],
					operation: ['listDevices'],
				},
			},
			routing: {
				send: {
					paginate: true,
					type: 'query',
					property: 'page',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Page Size',
			name: 'pageSize',
			type: 'number',
			default: 20,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['listDevices'],
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
			displayName: 'Order By',
			name: 'orderBy',
			type: 'options',
			options: [
				{ name: 'ID', value: 'id' },
				{ name: 'Created At', value: 'createdAt' },
				{ name: 'Updated At', value: 'updatedAt' },
				{ name: 'Assigned At', value: 'assignedAt' },
			],
			default: 'createdAt',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['listDevices'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'orderBy',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Order Direction',
			name: 'orderByDirection',
			type: 'options',
			options: [
				{ name: 'Ascending', value: 'asc' },
				{ name: 'Descending', value: 'desc' },
			],
			default: 'desc',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['listDevices'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'orderByDirection',
					value: '={{ $value }}',
				},
			},
		},

		// Parameters for Provision Device
		{
			displayName: 'Provider',
			name: 'provider',
			type: 'options',
			options: [
				{ name: 'Limrun', value: 'limrun' },
				{ name: 'Remote', value: 'remote' },
			],
			default: 'limrun',
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['provisionDevice'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'provider',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Device Type',
			name: 'deviceType',
			type: 'options',
			options: [
				{ name: 'Temporary Personal Phone', value: 'temporary_personal_phone' },
				{ name: 'Physical Phone', value: 'physical_phone' },
			],
			default: 'temporary_personal_phone',
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['provisionDevice'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'deviceType',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Apps',
			name: 'apps',
			type: 'string',
			typeOptions: {
				multipleValues: true,
			},
			default: [],
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['provisionDevice'],
				},
			},
			routing: {
				send: {
					type: 'body',
					property: 'apps',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Files',
			name: 'files',
			type: 'string',
			typeOptions: {
				multipleValues: true,
			},
			default: [],
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['provisionDevice'],
				},
			},
			routing: {
				send: {
					type: 'body',
					property: 'files',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Country',
			name: 'country',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['provisionDevice'],
				},
			},
			routing: {
				send: {
					type: 'body',
					property: 'country',
					value: '={{ $value }}',
				},
			},
		},
		{
			displayName: 'Name',
			name: 'name',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['provisionDevice'],
				},
			},
			routing: {
				send: {
					type: 'body',
					property: 'name',
					value: '={{ $value }}',
				},
			},
		},

		// Parameters for operations requiring deviceId
		{
			displayName: 'Device ID',
			name: 'deviceId',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['getDevice', 'deleteDevice', 'getDeviceTasks', 'waitForDevice'],
				},
			},
		},
	];
};
