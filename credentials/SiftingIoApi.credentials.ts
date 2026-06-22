import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SiftingIoApi implements ICredentialType {
	name = 'siftingIoApi';

	displayName = 'SiftingIO API';

	documentationUrl = 'https://sifting.io/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your SiftingIO API key (starts with "sft_"). Create one in your SiftingIO dashboard.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.sifting.io',
			description:
				'The SiftingIO API base URL. Change this only for staging or self-hosted deployments.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/v1/fnd/markets/status',
		},
	};
}
