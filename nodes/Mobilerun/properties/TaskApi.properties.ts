import { INodeProperties } from 'n8n-workflow';

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
	default: 'openai/gpt-5.1',
	description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	options: [
		{ name: 'Anthropic Claude Sonnet 4.5', value: 'anthropic/claude-sonnet-4.5' },
		{ name: 'Google Gemini 2.5 Flash', value: 'google/gemini-2.5-flash' },
		{ name: 'Google Gemini 2.5 Pro', value: 'google/gemini-2.5-pro' },
		{ name: 'Google Gemini 3 Flash', value: 'google/gemini-3-flash' },
		{ name: 'Google Gemini 3 Pro Preview', value: 'google/gemini-3-pro-preview' },
		{ name: 'MiniMax M2', value: 'minimax/minimax-m2' },
		{ name: 'MoonshotAI Kimi K2 Thinking', value: 'moonshotai/kimi-k2-thinking' },
		{ name: 'OpenAI GPT-5.1', value: 'openai/gpt-5.1' },
		{ name: 'OpenAI GPT-5.2', value: 'openai/gpt-5.2' },
		{ name: 'Qwen Qwen3 8B', value: 'qwen/qwen3-8b' }
	],
},
{
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	default: {},
	options: [
		{
			displayName: 'Apps',
			name: 'apps',
			type: 'multiOptions',
			allowArbitraryValues: true,

			typeOptions: {
				loadOptionsMethod: 'loadApps',
			},
			default: [],
			placeholder: 'Choose App',
			description: 'Apps configuration',
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
			displayName: 'Device ID',
			name: 'deviceId',
			placeholder: 'Choose Device',
			type: 'options',
			allowArbitraryValues: true,
			typeOptions: {
				loadOptionsMethod: 'loadDevices'
			},
			default: '',
			required: false,
			description: 'Device configuration',
			hint: 'for manuall device selection use n8n expressions'
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
		{
			displayName: 'Output Schema',
			name: 'outputSchema',
			type: 'json',
			typeOptions: {
				rows: 10,
			},
			default: '{\n  "type": "object",\n  "properties": {\n    "response": {\n      "type": "string",\n      "description": "The response text"\n    }\n  },\n  "required": ["response"],\n  "additionalProperties": false\n}',
			description: 'JSON Schema that defines the structure of the AI response',

		}
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
							url: '={{ "/tasks/" + $parameter.taskId }}',
						},
					},
				},
				{
					name: 'Get Task Gif',
					value: 'getTaskGif',
					description: 'Get a screenshot of a task',
					action: 'Get task gif',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "/tasks/" + $parameter.taskId + "/gif" }}',
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
							url: '={{ "/tasks/" + $parameter.taskId + "/screenshots/" +  $parameter.index }}',
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
							url: '={{ "/tasks/" + $parameter.taskId + "/screenshots" }}',
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
							url: '={{ "/tasks/" + $parameter.taskId + "/trajectory" }}',
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
							url: '={{ "/tasks/" + $parameter.taskId + "/ui_states/" + $parameter.index }}',
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
							url: '={{ "/tasks/" + $parameter.taskId + "/ui_states" }}',
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
							url: '/tasks/',
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
							url: '={{ "/tasks/" + $parameter.taskId + "/cancel" }}',
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
							url: '/tasks/',
							body: {
								task: '={{ $parameter.task }}',
								llmModel: '={{ $parameter.llmModel }}',
								apps: '={{ $parameter.options?.apps?.length ? $parameter.options.apps : undefined }}',
								credentials: '={{ $parameter.options?.credentials?.credentialValues?.length ? $parameter.options.credentials.credentialValues : undefined }}',
								deviceId: '={{ $parameter.options?.deviceId || undefined }}',
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
			],
			default: 'runTask',
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
					operation: ['getTask', 'getTaskGif', 'getTaskScreenshot', 'getTaskScreenshots', 'getTaskTrajectory', 'getTaskUIState', 'getTaskUIStates', 'stopTask'],
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

		...getTaskResourceForOperation('runTask')
	]
}
