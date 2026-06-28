import { INodeProperties } from 'n8n-workflow';
import { runTaskAndWaitPostReceive } from '../behaviors/RunTaskAndWait.behavior';

const taskProperties: INodeProperties[] = [{
	displayName: 'Task',
	name: 'task',
	type: 'string',
	typeOptions: {
		rows: 4,
	},
	default: '',
	required: true,
	description: 'Task to run',
	placeholder: 'Enter Task',
},
{
	displayName: 'LLM Model Name or ID',
	name: 'llmModel',
	type: 'options',
	default: '',
	typeOptions: {
		loadOptionsMethod: 'loadLlmModels'
	},
	description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
},
{
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	default: {},
	options: [
		{
			displayName: 'App Names or IDs',
			name: 'apps',
			type: 'multiOptions',
			allowArbitraryValues: true,

			typeOptions: {
				loadOptionsMethod: 'loadApps',
			},
			default: [],
			placeholder: 'Choose App',
			description: 'Apps configuration. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			hint: 'For manuall app selection use n8n expressions'
		},
		{
			displayName: 'Credentials',
			name: 'credentials',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			placeholder: 'Add Credential',
			options: [
				{
					name: 'credentialValues',
					displayName: 'Credential',
					values: [
						{
							displayName: 'Package Name',
							name: 'packageName',
							type: 'string',
							default: '',
							required: true,
							description: 'Name of the package',
						},
						{
							displayName: 'Credential Names',
							name: 'credentialNames',
							type: 'string',
							typeOptions: {
								multipleValues: true,
							},
							default: [],
							required: true,
							description: 'List of credential names for this package',
						},
					],
				},
			],
			description: 'Package credentials configuration',
		},
		{
			displayName: 'Display ID',
			name: 'displayId',
			type: 'number',
			default: 0,
			description: 'The display ID of the device to run the task on',
		},
		{
			displayName: 'Execution Timeout',
			name: 'executionTimeout',
			type: 'number',
			default: 1000,
			description: 'Timeout for task execution in seconds',
		},
		{
			displayName: 'Files',
			name: 'files',
			type: 'string',
			typeOptions: {
				multipleValues: true,
			},
			default: [],
			description: 'List of files to be used in the task',
		},
		{
			displayName: 'Max Steps',
			name: 'maxSteps',
			type: 'number',
			default: 100,
			description: 'Maximum number of steps for task execution',
		},
		{
			displayName: 'Output Schema',
			name: 'outputSchema',
			type: 'json',
			typeOptions: {
				rows: 10,
			},
			default: '{\n  "type": "object",\n  "properties": {\n    "response": {\n      "type": "string",\n      "description": "The response text"\n    }\n  },\n  "required": ["response"],\n  "additionalProperties": false\n}',
			description: 'JSON Schema that defines the structure of the AI response',

		},
		{
			displayName: 'Reasoning',
			name: 'reasoning',
			type: 'boolean',
			default: true,
			description: 'Whether to enable reasoning mode',
		},
		{
			displayName: 'Temperature',
			name: 'temperature',
			type: 'number',
			typeOptions: {
				minValue: 0,
				maxValue: 2,
				numberPrecision: 1,
			},
			default: 0.5,
			description: 'Controls randomness in the output. Lower values make output more focused and deterministic.',
		},
		{
			displayName: 'Vision',
			name: 'vision',
			type: 'boolean',
			default: false,
			description: 'Whether to enable vision capabilities',
		},
		{
			displayName: 'VPN Country',
			name: 'vpnCountry',
			type: 'options',
			options: [
				{ name: 'Brazil', value: 'BR' },
				{ name: 'France', value: 'FR' },
				{ name: 'Germany', value: 'DE' },
				{ name: 'India', value: 'IN' },
				{ name: 'Japan', value: 'JP' },
				{ name: 'South Africa', value: 'ZA' },
				{ name: 'South Korea', value: 'KR' },
				{ name: 'United States', value: 'US' },
			],
			default: 'DE',
			description: 'VPN country to use for the task',
		},
	],
},
]

export const getTaskResourceForOperation = (operation?: string): INodeProperties[] => {
	return taskProperties.map(task => ({
		...task,
		displayOptions: {
			...task.displayOptions,
			show: {
				...task.displayOptions?.show,
				operation: [operation]
			}
		}
	}))
}

export const TaskResources = (): INodeProperties[] => {
	return [

		/*
				INSPECT TASK OPERATIONS
		*/
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: ['inspectTask'] } },
			options: [
				{
					name: 'Get Task',
					value: 'getTask',
					description: 'Get a task',
					action: 'Get task',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "tasks/" + $parameter.taskId }}',
						},
					},
				},
				{
					name: 'Get Task Screenshot',
					value: 'getTaskScreenshot',
					description: 'Get a screenshot of a task',
					action: 'Get task screenshot',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "tasks/" + $parameter.taskId + "/screenshots/" +  $parameter.index }}',
						},
					},
				},
				{
					name: 'Get Task Screenshots',
					value: 'getTaskScreenshots',
					description: 'Get a list of screenshots of a task',
					action: 'Get task screenshots',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "tasks/" + $parameter.taskId + "/screenshots" }}',
						},
					},
				},
				{
					name: 'Get Task Status',
					value: 'getTaskStatus',
					description: 'Get a status of a task',
					action: 'Get task status',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "tasks/" + $parameter.taskId + "/status" }}',
						},
					},
				},
				{
					name: 'Get Task Trajectory',
					value: 'getTaskTrajectory',
					description: 'Get the trajectory of a task',
					action: 'Get task trajectory',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "tasks/" + $parameter.taskId + "/trajectory" }}',
						},
					},
				},
				{
					name: 'Get Task UI State',
					value: 'getTaskUIState',
					description: 'Get a specific UI state of a task',
					action: 'Get task UI state',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "tasks/" + $parameter.taskId + "/ui_states/" + $parameter.index }}',
						},
					},
				},
				{
					name: 'Get Task UI States',
					value: 'getTaskUIStates',
					description: 'Get UI states of a task',
					action: 'Get task UI states',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "tasks/" + $parameter.taskId + "/ui_states" }}',
						},
					},
				},
				{
					name: 'List Tasks',
					value: 'listTasks',
					description: 'List all tasks you’ve created so far',
					action: 'List tasks',
					routing: {
						request: {
							method: 'GET',
							url: 'tasks',
						},
					},
				},
			],
			default: 'listTasks',
		},

		/*
				MANAGE TASK OPERATIONS
		*/
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: ['manageTask'] } },
			options: [
				{
					name: 'Stop Task',
					value: 'stopTask',
					description: 'Stops a task',
					action: 'Stop task',
					routing: {
						request: {
							method: 'POST',
							url: '={{ "tasks/" + $parameter.taskId + "/cancel" }}',
						},
					},
				},
				{
					name: 'Run Task',
					value: 'runTask',
					description: 'Run a task',
					action: 'Run task',
					routing: {
						request: {
							method: 'POST',
							url: 'tasks',
							body: {
								task: '={{ $parameter.task }}',
								llmModel: '={{ $parameter.llmModel }}',
								apps: '={{ $parameter.options?.apps?.length ? $parameter.options.apps : undefined }}',
								credentials: '={{ $parameter.options?.credentials?.credentialValues?.length ? $parameter.options.credentials.credentialValues : undefined }}',
								deviceId: '={{ $parameter.deviceId }}',
								displayId: '={{ $parameter.options?.displayId !== undefined && $parameter.options.displayId !== null ? $parameter.options.displayId : undefined }}',
								executionTimeout: '={{ $parameter.options?.executionTimeout !== undefined && $parameter.options.executionTimeout !== null ? $parameter.options.executionTimeout : undefined }}',
								files: '={{ $parameter.options?.files?.length ? $parameter.options.files : undefined }}',
								maxSteps: '={{ $parameter.options?.maxSteps !== undefined && $parameter.options.maxSteps !== null ? $parameter.options.maxSteps : undefined }}',
								outputSchema: '={{ $parameter.options?.outputSchema ? JSON.parse($parameter.options.outputSchema) : undefined }}',
								reasoning: '={{ $parameter.options?.reasoning !== undefined && $parameter.options.reasoning !== null ? $parameter.options.reasoning : undefined }}',
								temperature: '={{ $parameter.options?.temperature !== undefined && $parameter.options.temperature !== null ? $parameter.options.temperature : undefined }}',
								vision: '={{ $parameter.options?.vision !== undefined && $parameter.options.vision !== null ? $parameter.options.vision : undefined }}',
								vpnCountry: '={{ $parameter.options?.vpnCountry || undefined }}',
							},
						},
					},
				},
				{
					name: 'Run Task and Wait',
					value: 'runTaskAndWait',
					description: 'Run a task and wait until it is completed, failed, or cancelled',
					action: 'Run task and wait',
					routing: {
						request: {
							method: 'POST',
							url: 'tasks',
							returnFullResponse: true,
							body: {
								task: '={{ $parameter.task }}',
								llmModel: '={{ $parameter.llmModel }}',
								apps: '={{ $parameter.options?.apps?.length ? $parameter.options.apps : undefined }}',
								credentials: '={{ $parameter.options?.credentials?.credentialValues?.length ? $parameter.options.credentials.credentialValues : undefined }}',
								deviceId: '={{ $parameter.deviceId }}',
								displayId: '={{ $parameter.options?.displayId !== undefined && $parameter.options.displayId !== null ? $parameter.options.displayId : undefined }}',
								executionTimeout: '={{ $parameter.options?.executionTimeout !== undefined && $parameter.options.executionTimeout !== null ? $parameter.options.executionTimeout : undefined }}',
								files: '={{ $parameter.options?.files?.length ? $parameter.options.files : undefined }}',
								maxSteps: '={{ $parameter.options?.maxSteps !== undefined && $parameter.options.maxSteps !== null ? $parameter.options.maxSteps : undefined }}',
								outputSchema: '={{ $parameter.options?.outputSchema ? JSON.parse($parameter.options.outputSchema) : undefined }}',
								reasoning: '={{ $parameter.options?.reasoning !== undefined && $parameter.options.reasoning !== null ? $parameter.options.reasoning : undefined }}',
								temperature: '={{ $parameter.options?.temperature !== undefined && $parameter.options.temperature !== null ? $parameter.options.temperature : undefined }}',
								vision: '={{ $parameter.options?.vision !== undefined && $parameter.options.vision !== null ? $parameter.options.vision : undefined }}',
								vpnCountry: '={{ $parameter.options?.vpnCountry || undefined }}',
							},
						},
						output: {
							postReceive: [runTaskAndWaitPostReceive],
						},
					},
				},
			],
			default: 'runTask',
		},

		// Parameters for List Tasks
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			options: [
				{ name: 'Any', value: '' },
				{ name: 'Cancelled', value: 'cancelled' },
				{ name: 'Cancelling', value: 'cancelling' },
				{ name: 'Completed', value: 'completed' },
				{ name: 'Created', value: 'created' },
				{ name: 'Failed', value: 'failed' },
				{ name: 'Paused', value: 'paused' },
				{ name: 'Queued', value: 'queued' },
				{ name: 'Running', value: 'running' },
			],
			default: '',
			displayOptions: {
				show: {
					resource: ['inspectTask'],
					operation: ['listTasks'],
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
			displayName: 'Search Query',
			name: 'query',
			type: 'string',
			default: '',
			description: 'Search in task description',
			displayOptions: {
				show: {
					resource: ['inspectTask'],
					operation: ['listTasks'],
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
			displayName: 'Order By',
			name: 'orderBy',
			type: 'options',
			options: [
				{ name: 'ID', value: 'id' },
				{ name: 'Created At', value: 'createdAt' },
				{ name: 'Finished At', value: 'finishedAt' },
				{ name: 'Status', value: 'status' },
			],
			default: 'createdAt',
			displayOptions: {
				show: {
					resource: ['inspectTask'],
					operation: ['listTasks'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'orderBy',
					value: '={{ $value || undefined }}',
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
					resource: ['inspectTask'],
					operation: ['listTasks'],
				},
			},
			routing: {
				send: {
					type: 'query',
					property: 'orderByDirection',
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
					resource: ['inspectTask'],
					operation: ['listTasks'],
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
					resource: ['inspectTask'],
					operation: ['listTasks'],
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

		/*
				INSPECT TASK PROPERTIES
		*/
		{
			displayName: 'Task ID',
			name: 'taskId',
			type: 'string',
			default: '',
			required: true,
			description: 'ID of the Task to query',
			placeholder: 'Enter Task ID',
			displayOptions: {
				show: {
					operation: ['getTask', 'getTaskStatus', 'getTaskScreenshot', 'getTaskScreenshots', 'getTaskTrajectory', 'getTaskUIState', 'getTaskUIStates', 'stopTask'],
				},
			},
		},

		{
			displayName: 'Index',
			name: 'index',
			type: 'string',
			default: '',
			required: true,
			description: 'Index to query',
			placeholder: 'Enter Index',
			displayOptions: {
				show: {
					operation: ['getTaskScreenshot', 'getTaskUIState'],
				},
			},
		},

		{
			displayName: 'Device Name or ID',
			name: 'deviceId',
			placeholder: 'Choose Device',
			type: 'options',
			allowArbitraryValues: true,
			typeOptions: {
				loadOptionsMethod: 'loadDevices'
			},
			default: '',
			required: true,
			description: 'Device ID is required. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			hint: 'for manual device selection use n8n expressions',
			displayOptions: {
				show: {
						operation: ['runTask', 'runTaskAndWait'],
				},
			},
		},

		{
			displayName: 'Maximum Wait Time (Seconds)',
			name: 'maxWaitSeconds',
			type: 'number',
			typeOptions: {
				minValue: 5,
			},
			default: 900,
			description: 'Maximum time to wait for stream events before timing out',
			displayOptions: {
				show: {
					operation: ['runTaskAndWait'],
				},
			},
		},

		...getTaskResourceForOperation('runTask'),
		...getTaskResourceForOperation('runTaskAndWait'),
	]
}
