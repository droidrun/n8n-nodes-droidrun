import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class DroidrunApi implements ICredentialType {
    name = 'droidrunApi';
    displayName = 'Droidrun API';
    documentationUrl = 'https://docs.droidrun.ai/api-reference/';
    properties: INodeProperties[] = [
        {
            displayName: 'Token',
            name: 'token',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
            required: true,
            description: 'Your Droidrun Api Key',
        }
    ];

    // This allows the credential to be used by other parts of n8n
    // stating how this credential is injected as part of the request
    // An example is the Http Request node that can make generic calls
    // reusing this credential
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{"Bearer " + $credentials.token}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.droidrun.ai/v1',
            url: '/tasks/',
        },
    };
}
