import { INodeProperties } from 'n8n-workflow';
export const CredentialResources = (): INodeProperties[] => {
	return [
		/*
			CREDENTIAL PROPERTIES
		*/

		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: ['credential'] } },
			options: [
				{
					name: 'Add New Field',
					value: 'addCredentialField',
					description: 'Add a new field to an existing credential',
					action: 'Add field to specific credential',
					routing: {
						request: {
							method: 'PATCH',
							url: '={{ "/credentials/packages/" + $parameter.packageName + "/credentials/" + $parameter.credentialName + "/fields"  }}',
							body: {
								fieldType: '={{ $parameter.credentialType }}',
								value: '={{ $parameter.credentialValue }}'
							}
						},
					},
				},
				{
					name: 'Create Credential Field',
					value: 'createCredentialField',
					description: 'Create a credential with fields for a package',
					action: 'Create credential field',
					routing: {
						request: {
							method: 'POST',
							url: '={{ "/credentials/packages/" + $parameter.packageName }}',
							body: {
								credentialName: '={{ $parameter.credentialName }}',
								fields: {
									fieldsType: '={{ $parameter.credentialType }}',
									value: '={{ $parameter.credentialValue }}'
								}
							}
						},
					},
				},
				{
					name: 'Delete Specific Credential',
					value: 'deleteSpecificCredential',
					description: 'Delete a credential and all its fields',
					action: 'Delete specific credential',
					routing: {
						request: {
							method: 'DELETE',
							url: '={{ "/credentials/packages/" + $parameter.packageName + "/credentials/" + $parameter.credentialName }}',
						},
					},
				},
				{
					name: 'Delete Specific Credential Field',
					value: 'deleteSpecificCredentialField',
					description: 'Delete a field from a credential',
					action: 'Delete specific credential field',
					routing: {
						request: {
							method: 'DELETE',
							url: '={{ "/credentials/packages/" + $parameter.packageName + "/credentials/" + $parameter.credentialName + "/fields/" + $parameter.credentialType  }}',
						},
					},
				},
				{
					name: 'Get Specific Credential',
					value: 'getSpecificCredential',
					description: 'Get a specific credential with its fields',
					action: 'Get specific credential',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "/credentials/packages/" + $parameter.packageName + "/credentials/" + $parameter.credentialName}}',

						},
					},
				},
				{
					name: 'Initialize Package',
					value: 'initializePackage',
					description: 'Initialize a new package/app',
					action: 'Initialize package',
					routing: {
						request: {
							method: 'POST',
							url: '/credentials',
							body: {
								packageName: '={{ $parameter.packageName }}'
							}
						},
					},
				},
				{
					name: 'List Credentials',
					value: 'listCredentials',
					description: 'List all credentials for the authenticated user',
					action: 'List credentials',
					routing: {
						request: {
							method: 'GET',
							url: '/credentials',

						},
					},
				},
				{
					name: 'List Package Credentials',
					value: 'listPackageCredentials',
					description: 'List credentials for a specific package',
					action: 'List package credentials',
					routing: {
						request: {
							method: 'GET',
							url: '={{ "/credentials/packages/" + $parameter.packageName }}',

						},
					},
				},
				{
					name: 'Update Specific Credential Field',
					value: 'updateSpecificCredentialField',
					description: 'Update the value of a credential field',
					action: 'Update specific credential field',
					routing: {
						request: {
							method: 'PATCH',
							url: '={{ "/credentials/packages/" + $parameter.packageName + "/credentials/" + $parameter.credentialName + "/fields/" + $parameter.credentialType  }}',
							body: {
								value: '={{ $parameter.credentialValue }}'
							}
						},
					},
				},
			],
			default: 'listCredentials',
		},

		{
			displayName: 'Package Name',
			name: 'packageName',
			type: 'string',
			default: '',
			required: true,
			description: 'Name of the Package to query',
			placeholder: 'Enter Package Name',
			displayOptions: {
				show: {
					operation: ['listPackageCredentials', 'initializePackage', 'createCredentialField', 'getSpecificCredential', 'deleteSpecificCredentialField', 'deleteSpecificCredential', 'updateSpecificCredentialField', 'addCredentialField'],
				},
			},
		},

		{
			displayName: 'Credential Name',
			name: 'credentialName',
			type: 'string',
			default: '',
			required: true,
			description: 'Name of the Credential',
			placeholder: 'Enter Credential Name',
			displayOptions: {
				show: {
					operation: ['createCredentialField', 'getSpecificCredential', 'deleteSpecificCredential', 'deleteSpecificCredentialField', 'updateSpecificCredentialField', 'addCredentialField'],
				},
			},
		},

		{
			displayName: 'Credential Type',
			name: 'credentialType',
			type: 'options',
			options: [
				{ name: 'Api_token', value: 'api_token' },
				{ name: 'Backup_codes', value: 'backup_codes' },
				{ name: 'Email', value: 'email' },
				{ name: 'Password', value: 'password' },
				{ name: 'Phone_number', value: 'phone_number' },
				{ name: 'Two_factor_secret', value: 'two_factor_secret' },
				{ name: 'Username', value: 'username' },
			],
			default: 'email',
			required: true,
			description: 'Type of the Credential',
			placeholder: 'Enter Credential Type',
			displayOptions: {
				show: {
					operation: ['createCredentialField', 'deleteSpecificCredentialField', 'updateSpecificCredentialField', 'addCredentialField'],
				},
			},
		},

		{
			displayName: 'Credential Value',
			name: 'credentialValue',
			type: 'string',
			default: '',
			required: true,
			description: 'Value of the Credential',
			placeholder: 'Enter Credential Value',
			displayOptions: {
				show: {
					operation: ['createCredentialField', 'updateSpecificCredentialField', 'addCredentialField'],
				},
			},
		},
	]

}
