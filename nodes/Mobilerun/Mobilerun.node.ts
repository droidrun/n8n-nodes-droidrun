import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import { MobilerunResources } from './Mobilerun.properties';

export class Mobilerun implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Mobilerun Tasks',
        name: 'mobilerun',
        group: ['transform'],
        version: 1,
        icon: 'file:droidrun-logo.svg',
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Access the Mobilerun Cloud Api',
        defaults: {
            name: 'Mobilerun',
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'mobilerunApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.mobilerun.ai/v1',
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
        },

        properties: [
            ...MobilerunResources()
            // Optional/additional fields will go here

        ]
    };
};

