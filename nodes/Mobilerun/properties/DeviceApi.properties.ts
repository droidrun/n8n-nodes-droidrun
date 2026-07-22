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
					name: 'Connect Proxy',
					value: 'connectProxy',
					description: 'Connect a proxy to the device',
					action: 'Connect proxy',
					routing: {
						request: {
							method: 'POST',
							url: '={{ "devices/" + $parameter.deviceId + "/proxy" }}',
							body: {
								smartIp: '={{ $parameter.smartIp }}',
								name: '={{ $parameter.proxyMode === "preconfigured" ? $parameter.proxyName : undefined }}',
								socks5:
									'={{ $parameter.proxyMode === "socks5" ? { host: $parameter.proxyHost, port: $parameter.proxyPort, user: $parameter.proxyUser || undefined, password: $parameter.proxyPassword || undefined } : undefined }}',
							},
						},
					},
				},
				{
					name: 'Delete Device',
					value: 'deleteDevice',
					description: 'Delete a specific device',
					action: 'Delete device',
					routing: {
						request: {
							method: 'DELETE',
							url: '={{ "devices/" + $parameter.deviceId }}',
						},
					},
				},
				{
					name: 'Disconnect Proxy',
					value: 'disconnectProxy',
					description: 'Disconnect the proxy from the device',
					action: 'Disconnect proxy',
					routing: {
						request: {
							method: 'DELETE',
							url: '={{ "devices/" + $parameter.deviceId + "/proxy" }}',
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
							url: '={{ "devices/" + $parameter.deviceId }}',
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
							url: '={{ "devices/" + $parameter.deviceId + "/tasks" }}',
						},
					},
				},
				{
					name: 'List Devices',
					value: 'listDevices',
					description:
						'Retrieves a paginated list of devices with filtering and search capabilities',
					action: 'List devices',
					routing: {
						request: {
							method: 'GET',
							url: 'devices',
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
							url: '={{ "devices/" + $parameter.deviceId + "/wait" }}',
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
			type: 'multiOptions',
			options: [
				{ name: 'Assigned', value: 'assigned' },
				{ name: 'Creating', value: 'creating' },
				{ name: 'Maintenance', value: 'maintenance' },
				{ name: 'Migrating', value: 'migrating' },
				{ name: 'Ready', value: 'ready' },
				{ name: 'Rebooting', value: 'rebooting' },
				{ name: 'Resetting', value: 'resetting' },
				{ name: 'Terminated', value: 'terminated' },
				{ name: 'Unknown', value: 'unknown' },
			],
			default: ['ready'],
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
					value: '={{ $value.length ? $value.join(",") : undefined }}',
				},
			},
		},
		{
			displayName: 'Device Type',
			name: 'type',
			type: 'options',
			options: [
				{ name: 'Any', value: '' },
				{ name: 'Dedicated Physical Device', value: 'dedicated_physical_device' },
				{ name: 'Dedicated Premium Device', value: 'dedicated_premium_device' },
				{ name: 'Dedicated iOS Device', value: 'dedicated_ios_device' },
			],
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
					property: 'type',
					value: '={{ $value || undefined }}',
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
					value: '={{ $value || undefined }}',
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
					operation: ['listDevices'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'name',
					value: '={{ $value || undefined }}',
				},
			},
		},
		{
			displayName: 'Provider ID',
			name: 'providerId',
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
					property: 'providerId',
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

		// Parameters for Connect Proxy
		{
			displayName: 'Proxy Mode',
			name: 'proxyMode',
			type: 'options',
			options: [
				{ name: 'SOCKS5 Proxy', value: 'socks5' },
				{ name: 'Preconfigured Proxy (Name)', value: 'preconfigured' },
			],
			default: 'socks5',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['connectProxy'],
				},
			},
			description: 'The type of proxy configuration to connect',
		},
		{
			displayName: 'Proxy Host',
			name: 'proxyHost',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['connectProxy'],
					proxyMode: ['socks5'],
				},
			},
			description: 'The host name or IP address of the SOCKS5 proxy',
		},
		{
			displayName: 'Proxy Port',
			name: 'proxyPort',
			type: 'number',
			default: 1080,
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['connectProxy'],
					proxyMode: ['socks5'],
				},
			},
			description: 'The port of the SOCKS5 proxy',
		},
		{
			displayName: 'Proxy Username',
			name: 'proxyUser',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['connectProxy'],
					proxyMode: ['socks5'],
				},
			},
			description: 'The username for the SOCKS5 proxy (if required)',
		},
		{
			displayName: 'Proxy Password',
			name: 'proxyPassword',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['connectProxy'],
					proxyMode: ['socks5'],
				},
			},
			description: 'The password for the SOCKS5 proxy (if required)',
		},
		{
			displayName: 'Proxy Name',
			name: 'proxyName',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['connectProxy'],
					proxyMode: ['preconfigured'],
				},
			},
			description: 'The name of the preconfigured proxy to connect',
		},
		{
			displayName: 'Smart IP',
			name: 'smartIp',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['connectProxy'],
				},
			},
			description: 'Whether to enable Smart IP rotation/management for the proxy',
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
					operation: [
						'getDevice',
						'deleteDevice',
						'getDeviceTasks',
						'waitForDevice',
						'connectProxy',
						'disconnectProxy',
					],
				},
			},
		},
	];
};
