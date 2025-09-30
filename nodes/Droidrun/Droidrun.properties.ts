import { INodeProperties } from 'n8n-workflow';
export const DroidrunResources = (): INodeProperties[] => {
    return [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            options: [
                { name: 'Inspect Task', value: 'inspectTask' },
                { name: 'Manage Task', value: 'manageTask' },
            ],
            default: 'inspectTask',
            noDataExpression: true,
        },

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
                            url: '={{ "/tasks/" + $parameter.taskId + "/screenshot" }}',
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
                                reflection: '={{ $parameter.reflection }}',
                                vision: '={{ $parameter.vision }}',
                                timeout: '={{ $parameter.timeout }}',
                                libraryApps: '={{ $parameter.libraryApps }}',
                                uploadedApps: '={{ $parameter.uploadedApps }}',
                                files: '={{ $parameter.files }}',
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
            displayName: 'LLM Model',
            name: 'llmModel',
            type: 'options',
            options: [
                { name: 'claude-3-7-sonnet-latest', value: 'claude-3-7-sonnet-latest' },
                { name: 'claude-sonnet-4-20250514', value: 'claude-sonnet-4-20250514' },
                { name: 'gemini-2.5-flash', value: 'gemini-2.5-flash' },
                { name: 'gemini-2.5-pro', value: 'gemini-2.5-pro' },
                { name: 'gpt-4.1', value: 'gpt-4.1' },
                { name: 'gpt-4.1-mini', value: 'gpt-4.1-mini' },
                { name: 'gpt-4o', value: 'gpt-4o' },
                { name: 'gpt-4o-mini', value: 'gpt-4o-mini' },
                { name: 'gpt-o3', value: 'gpt-o3' },
                { name: 'gpt-o4-mini', value: 'gpt-o4-mini' },
            ],
            default: 'gpt-4o',
            description: 'The LLM model to use',
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
            displayName: 'Library Apps',
            name: 'libraryApps',
            type: 'string',
            typeOptions: { multipleValues: true },
            default: [],
            description: 'List of library apps',
            displayOptions: { show: { operation: ['runTask'] } },
        },

        {
            displayName: 'Uploaded Apps',
            name: 'uploadedApps',
            type: 'string',
            typeOptions: { multipleValues: true },
            default: [],
            description: 'List of uploaded apps',
            displayOptions: { show: { operation: ['runTask'] } },
        },

        {
            displayName: 'Files',
            name: 'files',
            type: 'string',
            typeOptions: { multipleValues: true },
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