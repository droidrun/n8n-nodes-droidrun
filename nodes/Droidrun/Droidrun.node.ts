import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import { DroidrunResources } from './Droidrun.properties';

export class Droidrun implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Droidrun Tasks',
        name: 'droidrun',
        group: ['transform'],
        version: 1,
        icon: 'file:droidrun-logo.svg',
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Access the Droidrun Cloud Api',
        defaults: {
            name: 'Droidrun',
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'droidrunApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.droidrun.ai/v1',
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
        },

        properties: [
            ...DroidrunResources()
            // Optional/additional fields will go here

        ]
    };
};

