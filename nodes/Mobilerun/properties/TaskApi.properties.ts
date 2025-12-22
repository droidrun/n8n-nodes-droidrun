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
					name: 'Get Task Status',
					value: 'getTaskStatus',
					description: 'Get the status of a task. If device is provided, return the status of the specific device.',
					action: 'Get task status',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "/tasks/" + $parameter.taskId + "/status" }}',
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
							method: 'DELETE',
							url: '={{ "/tasks/" + $parameter.taskId }}',
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
								reflection: '={{ $parameter.reflection }}',
								vision: '={{ $parameter.vision }}',
								timeout: '={{ $parameter.timeout }}',
								apps: '={{ $parameter.apps }}',
								files: '={{ $parameter.files }}',
								deviceId: '={{ $parameter.deviceId }}',
								outputSchema: '={{ $parameter.outputSchema }}',
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
					operation: ['getTaskStatus', 'getTask', 'getTaskScreenshot', 'getTaskScreenshots', 'getTaskGif', 'stopTask'],
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
					operation: ['getTaskScreenshot'],
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
			options: [],
			default: '',
			description: 'The LLM model to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			typeOptions: {
				loadOptionsMethod: 'loadLlmModels',
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
			displayName: 'Reflection',
			name: 'reflection',
			type: 'boolean',
			default: false,
			description: 'Whether reflection mode on/off',
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
			displayName: 'Timeout',
			name: 'timeout',
			type: 'number',
			default: 1000,
			description: 'Timeout in ms',
			typeOptions: { minValue: 0 },
			displayOptions: { show: { operation: ['runTask'] } },
		},

		{
			displayName: 'Device Name or ID',
			name: 'deviceId',
			type: 'options',
			default: '',
			description: 'Optional device to run the task on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			typeOptions: {
				loadOptionsMethod: 'loadDevices',
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
			description: 'List of apps to use. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
