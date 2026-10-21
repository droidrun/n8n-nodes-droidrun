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
					name: 'Create Device',
					value: 'createDevice',
					description: 'Provision a new device',
					action: 'Create device',
					routing: {
						request: {
							method: 'POST',
							url: 'devices',
							body: {
								androidVersion:
									'={{ $parameter.additionalFields?.androidVersion !== undefined && $parameter.additionalFields.androidVersion !== null ? $parameter.additionalFields.androidVersion : undefined }}',
								apps: '={{ ((list) => list.length ? list : undefined)(String($parameter.additionalFields?.apps ?? "").split(",").map((s) => s.trim()).filter((s) => s)) }}',
								carrier:
									'={{ $parameter.additionalFields?.carrier?.carrierValues ? { GsmOperatorAlpha: $parameter.additionalFields.carrier.carrierValues.gsmOperatorAlpha, GsmOperatorNumeric: $parameter.additionalFields.carrier.carrierValues.gsmOperatorNumeric, GsmSimOperatorAlpha: $parameter.additionalFields.carrier.carrierValues.gsmSimOperatorAlpha, GsmSimOperatorNumeric: $parameter.additionalFields.carrier.carrierValues.gsmSimOperatorNumeric, GsmSimOperatorIsoCountry: $parameter.additionalFields.carrier.carrierValues.gsmSimOperatorIsoCountry, PersistSysTimezone: $parameter.additionalFields.carrier.carrierValues.persistSysTimezone } : undefined }}',
								files: '={{ ((list) => list.length ? list : undefined)(String($parameter.additionalFields?.files ?? "").split(",").map((s) => s.trim()).filter((s) => s)) }}',
								identifiers:
									'={{ ((v) => v && typeof v === "object" && Object.keys(v).length ? v : undefined)(((o) => o && typeof o === "object" ? Object.fromEntries(Object.entries(o).filter((e) => e[1] !== "" && e[1] !== null && e[1] !== undefined)) : o)(typeof $parameter.additionalFields?.identifiers === "string" ? ($parameter.additionalFields.identifiers.trim() ? JSON.parse($parameter.additionalFields.identifiers) : undefined) : $parameter.additionalFields?.identifiers)) }}',
								locale: '={{ $parameter.additionalFields?.locale || undefined }}',
								location:
									'={{ $parameter.additionalFields?.location?.locationValues ? { latitude: $parameter.additionalFields.location.locationValues.latitude, longitude: $parameter.additionalFields.location.locationValues.longitude } : undefined }}',
								name: '={{ $parameter.additionalFields?.name || undefined }}',
								proxy:
									'={{ $parameter.additionalFields?.proxy?.proxyValues ? ((p) => ({ smartIp: p.smartIp, name: p.proxyMode === "preconfigured" ? p.proxyName || undefined : undefined, socks5: p.proxyMode === "socks5" ? { host: p.proxyHost, port: p.proxyPort, user: p.proxyUser || undefined, password: p.proxyPassword || undefined } : undefined, connect: p.proxyMode === "connectCountry" ? { country: p.connectCountry } : p.proxyMode === "connectId" ? { id: p.connectId } : undefined }))($parameter.additionalFields.proxy.proxyValues) : undefined }}',
								timezone: '={{ $parameter.additionalFields?.timezone || undefined }}',
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
				{ name: 'Stopped', value: 'stopped' },
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
			// "Any" is kept first so the unfiltered choice is at the top
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: 'Any', value: '' },
				{ name: 'Android Cloud Phone', value: 'android_cloud_phone' },
				{ name: 'Android Emulator', value: 'android_emulator' },
				{ name: 'Android Physical Phone', value: 'android_physical_phone' },
				{ name: 'Device Slot', value: 'device_slot' },
				{ name: 'iOS Simulator', value: 'ios_simulator' },
				{ name: 'iOS Stealth Phone', value: 'ios_stealth_phone' },
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

		// Parameters for Create Device
		{
			displayName: 'Device Type',
			name: 'deviceType',
			type: 'options',
			options: [
				{ name: 'Android Cloud Phone', value: 'android_cloud_phone' },
				{ name: 'Android Emulator', value: 'android_emulator' },
				{ name: 'Android Physical Phone', value: 'android_physical_phone' },
				{ name: 'Device Slot', value: 'device_slot' },
				{ name: 'iOS Simulator', value: 'ios_simulator' },
				{ name: 'iOS Stealth Phone', value: 'ios_stealth_phone' },
			],
			default: 'android_cloud_phone',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['createDevice'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'deviceType',
					value: '={{ $value || undefined }}',
				},
			},
			description: 'The type of device to provision',
		},
		{
			displayName: 'Country',
			name: 'createCountry',
			type: 'string',
			default: '',
			placeholder: 'e.g. US',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['createDevice'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'country',
					value: '={{ $value || undefined }}',
				},
			},
			description:
				'ISO 3166-1 alpha-2 country code. If omitted, the API picks the country with the most availability.',
		},
		{
			displayName: 'Profile ID',
			name: 'profileId',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['createDevice'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'profileId',
					value: '={{ $value || undefined }}',
				},
			},
			description: 'ID of a profile to use as the device spec',
		},
		{
			displayName: 'Billing',
			name: 'billing',
			type: 'options',
			options: [
				{
					name: 'Auto',
					value: 'auto',
					description: 'Use a subscription slot when available, otherwise bill per minute',
				},
				{
					name: 'Minute',
					value: 'minute',
					description: 'Bill per minute',
				},
				{
					name: 'Subscription',
					value: 'subscription',
					description: 'Require an available subscription slot',
				},
			],
			default: 'auto',
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['createDevice'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'billing',
					value: '={{ $value || undefined }}',
				},
			},
			description:
				'How the device is billed. Per-minute billing only works for cloud phone and cloud emulator devices.',
		},
		{
			displayName: 'Additional Fields',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			displayOptions: {
				show: {
					resource: ['device'],
					operation: ['createDevice'],
				},
			},
			options: [
				{
					displayName: 'Android Version',
					name: 'androidVersion',
					type: 'number',
					default: 0,
					description: 'Android version of the device',
				},
				{
					displayName: 'Apps',
					name: 'apps',
					type: 'string',
					default: '',
					placeholder: 'e.g. com.example.app, com.example.other',
					description: 'Comma-separated list of apps to install on the device',
				},
				{
					displayName: 'Carrier',
					name: 'carrier',
					type: 'fixedCollection',
					default: {},
					placeholder: 'Add Carrier',
					options: [
						{
							name: 'carrierValues',
							displayName: 'Carrier',
							values: [
								{
									displayName: 'GSM Operator Alpha',
									name: 'gsmOperatorAlpha',
									type: 'string',
									default: '',
									required: true,
								},
								{
									displayName: 'GSM Operator Numeric',
									name: 'gsmOperatorNumeric',
									type: 'number',
									default: 0,
									required: true,
								},
								{
									displayName: 'GSM SIM Operator Alpha',
									name: 'gsmSimOperatorAlpha',
									type: 'string',
									default: '',
									required: true,
								},
								{
									displayName: 'GSM SIM Operator ISO Country',
									name: 'gsmSimOperatorIsoCountry',
									type: 'string',
									default: '',
									required: true,
								},
								{
									displayName: 'GSM SIM Operator Numeric',
									name: 'gsmSimOperatorNumeric',
									type: 'number',
									default: 0,
									required: true,
								},
								{
									displayName: 'Persist Sys Timezone',
									name: 'persistSysTimezone',
									type: 'string',
									default: '',
									required: true,
								},
							],
						},
					],
					description: 'Carrier configuration for the device',
				},
				{
					displayName: 'Files',
					name: 'files',
					type: 'string',
					default: '',
					description: 'Comma-separated list of files to put on the device',
				},
				{
					displayName: 'Identifiers',
					name: 'identifiers',
					type: 'json',
					typeOptions: {
						rows: 10,
					},
					default:
						'{\n  "BootloaderSerialNumber": "",\n  "IdentifierAndroidID": "",\n  "IdentifierAppSetID": "",\n  "IdentifierBluetoothMAC": "",\n  "IdentifierGAID": "",\n  "IdentifierGSFID": "",\n  "IdentifierICCID": "",\n  "IdentifierIMEI": "",\n  "IdentifierIMSI": "",\n  "IdentifierMEID": "",\n  "IdentifierMediaDRMID": "",\n  "IdentifierPhoneNumber": "",\n  "IdentifierSerial": "",\n  "IdentifierWifiMAC": "",\n  "SerialNumber": ""\n}',
					description: 'Device identifiers object. All 15 fields are required by the API.',
				},
				{
					displayName: 'Locale',
					name: 'locale',
					type: 'string',
					default: '',
					placeholder: 'e.g. en-US',
				},
				{
					displayName: 'Location',
					name: 'location',
					type: 'fixedCollection',
					default: {},
					placeholder: 'Add Location',
					options: [
						{
							name: 'locationValues',
							displayName: 'Location',
							values: [
								{
									displayName: 'Latitude',
									name: 'latitude',
									type: 'number',
									typeOptions: {
										numberPrecision: 6,
									},
									default: 0,
									required: true,
								},
								{
									displayName: 'Longitude',
									name: 'longitude',
									type: 'number',
									typeOptions: {
										numberPrecision: 6,
									},
									default: 0,
									required: true,
								},
							],
						},
					],
					description: 'GPS location of the device',
				},
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
					description: 'Name of the device',
				},
				{
					displayName: 'Proxy',
					name: 'proxy',
					type: 'fixedCollection',
					default: {},
					placeholder: 'Add Proxy',
					options: [
						{
							name: 'proxyValues',
							displayName: 'Proxy',
							values: [
								{
									displayName: 'Country',
									name: 'connectCountry',
									type: 'string',
									default: '',
									required: true,
									placeholder: 'e.g. US',
									displayOptions: {
										show: {
											proxyMode: ['connectCountry'],
										},
									},
									description: 'Two-letter country code of the proxy to connect',
								},
								{
									displayName: 'Proxy Host',
									name: 'proxyHost',
									type: 'string',
									default: '',
									required: true,
									displayOptions: {
										show: {
											proxyMode: ['socks5'],
										},
									},
									description: 'The host name or IP address of the SOCKS5 proxy',
								},
								{
									displayName: 'Proxy ID',
									name: 'connectId',
									type: 'string',
									default: '',
									required: true,
									displayOptions: {
										show: {
											proxyMode: ['connectId'],
										},
									},
									description: 'UUID of the proxy to connect',
								},
								{
									displayName: 'Proxy Mode',
									name: 'proxyMode',
									type: 'options',
									options: [
										{ name: 'Connect by Country', value: 'connectCountry' },
										{ name: 'Connect by ID', value: 'connectId' },
										{ name: 'Preconfigured Proxy (Name)', value: 'preconfigured' },
										{ name: 'SOCKS5 Proxy', value: 'socks5' },
									],
									default: 'socks5',
									description: 'The type of proxy configuration to connect',
								},
								{
									displayName: 'Proxy Name',
									name: 'proxyName',
									type: 'string',
									default: '',
									required: true,
									displayOptions: {
										show: {
											proxyMode: ['preconfigured'],
										},
									},
									description: 'The name of the preconfigured proxy to connect',
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
											proxyMode: ['socks5'],
										},
									},
									description: 'The password for the SOCKS5 proxy (if required)',
								},
								{
									displayName: 'Proxy Port',
									name: 'proxyPort',
									type: 'number',
									default: 1080,
									required: true,
									displayOptions: {
										show: {
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
											proxyMode: ['socks5'],
										},
									},
									description: 'The username for the SOCKS5 proxy (if required)',
								},
								{
									displayName: 'Smart IP',
									name: 'smartIp',
									type: 'boolean',
									default: false,
									description: 'Whether to enable Smart IP rotation/management for the proxy',
								},
							],
						},
					],
					description: 'Proxy to connect to the device',
				},
				{
					displayName: 'Timezone',
					name: 'timezone',
					type: 'string',
					default: '',
					placeholder: 'e.g. Europe/London',
				},
			],
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
