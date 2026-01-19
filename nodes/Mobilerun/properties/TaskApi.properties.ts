import { INodeProperties } from 'n8n-workflow';
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
								maxSteps: '={{ $parameter.maxSteps }}',
								temperature: '={{ $parameter.temperature }}',
								reasoning: '={{ $parameter.reasoning }}',
								vision: '={{ $parameter.vision }}',
								executionTimeout: '={{ $parameter.executionTimeout }}',
								apps: '={{ $parameter.apps }}',
								files: '={{ $parameter.files }}',
								deviceId: '={{ $parameter.deviceSelectionMode === "manual" ? $parameter.deviceIdManual : $parameter.deviceId }}',
								displayId: '={{ $parameter.displayId }}',
								vpnCountry: '={{ $parameter.vpnCountry === "none" ? undefined : $parameter.vpnCountry }}',
								credentials: '={{ $parameter.credentials }}',
								outputSchema: '={{ $parameter.outputSchema ? JSON.parse($parameter.outputSchema) : undefined }}',
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

		/*
				MANAGE TASK PROPERTIES
		*/
		{
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
			displayOptions: {
				show: {
					operation: ['runTask'],
				},
			},
		},

		{
			displayName: 'LLM Model Name or ID',
			name: 'llmModel',
			type: 'options',
			default: '',
			description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			typeOptions: {
				loadOptionsMethod: 'loadLlmModels',
				options: [
					{ name: 'OpenAI GPT-5', value: 'openai/gpt-5' },
					{ name: 'Google Gemini 2.5 Flash', value: 'google/gemini-2.5-flash' },
					{ name: 'Google Gemini 2.5 Pro', value: 'google/gemini-2.5-pro' },
					{ name: 'Google Gemini 3 Pro Preview', value: 'google/gemini-3-pro-preview' },
					{ name: 'Anthropic Claude Sonnet 4.5', value: 'anthropic/claude-sonnet-4.5' },
					{ name: 'MiniMax M2', value: 'minimax/minimax-m2' },
					{ name: 'MoonshotAI Kimi K2', value: 'moonshotai/kimi-k2' },
				],
			},
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Max Steps',
			name: 'maxSteps',
			type: 'number',
			default: 100,
			description: 'Maximum number of steps',
			typeOptions: { minValue: 1 },
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Temperature',
			name: 'temperature',
			type: 'number',
			default: 0.5,
			description: 'Sampling temperature',
			typeOptions: { minValue: 0, maxValue: 2, numberStepSize: 0.1 },
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Reasoning',
			name: 'reasoning',
			type: 'boolean',
			default: true,
			description: 'Whether reasoning mode on/off',
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Vision',
			name: 'vision',
			type: 'boolean',
			default: false,
			description: 'Whether vision mode on/off',
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Execution Timeout',
			name: 'executionTimeout',
			type: 'number',
			default: 1000,
			description: 'Execution timeout in ms',
			typeOptions: { minValue: 0 },
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Device Selection',
			name: 'deviceSelectionMode',
			type: 'options',
			default: 'list',
			options: [
				{ name: 'Choose From List', value: 'list' },
				{ name: 'Enter ID Manually', value: 'manual' },
			],
			displayOptions: { show: { operation: ['runTask'] } },
		},
		{
			displayName: 'Device Name or ID',
			name: 'deviceId',
			type: 'options',
			default: '',
			description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			typeOptions: {
				loadOptionsMethod: 'loadDevices',
				options: [{ name: 'Auto-Select Device', value: '' }],
			},
			displayOptions: {
				show: {
					operation: ['runTask'],
					deviceSelectionMode: ['list'],
				},
			},
		},
		{
			displayName: 'Device ID (Manual)',
			name: 'deviceIdManual',
			type: 'string',
			default: '',
			placeholder: 'e.g. 12345 or abc-def',
			description: 'Enter a device ID that is not in the list',
			displayOptions: {
				show: {
					operation: ['runTask'],
					deviceSelectionMode: ['manual'],
				},
			},
		},

		{
			displayName: 'Display ID',
			name: 'displayId',
			type: 'number',
			default: null,
			description: 'Optional display ID of the device to run the task on',
			typeOptions: { minValue: 0 },
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'VPN Country Name or ID',
			name: 'vpnCountry',
			type: 'options',
			default: '',
			description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			typeOptions: {
				loadOptionsMethod: 'loadVpnCountries',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'United States', value: 'US' },
					{ name: 'Brazil', value: 'BR' },
					{ name: 'France', value: 'FR' },
					{ name: 'Germany', value: 'DE' },
					{ name: 'India', value: 'IN' },
					{ name: 'Japan', value: 'JP' },
					{ name: 'South Korea', value: 'KR' },
					{ name: 'South Africa', value: 'ZA' },
				],
			},
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Output Schema',
			name: 'outputSchema',
			type: 'json',
			default: '',
			typeOptions: { isAdvanced: true },
			description: 'JSON schema for structured output (optional)',
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'App Names or IDs',
			name: 'apps',
			type: 'multiOptions',
			typeOptions: {
				loadOptionsMethod: 'loadApps',
			},
			default: [],
			description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Credentials',
			name: 'credentials',
			type: 'json',
			default: [],
			typeOptions: { isAdvanced: true },
			description: 'Array of package credentials to use (optional)',
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Files',
			name: 'files',
			type: 'string',
			typeOptions: { multipleValues: true, isAdvanced: true },
			default: [],
			description: 'List of files',
			displayOptions: { show: { operation: ['runTask'] } },
		},
	]
}

/*
 { name: 'Get Task', value: 'getTask' },
								{ name: 'Get Task Gif', value: 'getTaskGif' },
								{ name: 'Get Task Screenshot', value: 'getTaskScreenshot' },
								// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
								{ name: 'Get Task Screenshots', value: 'getTaskScreenshots' },
								{ name: 'Get Task Status', value: 'getTaskStatus' },
								{ name: 'List Tasks', value: 'listTasks' },
*/
