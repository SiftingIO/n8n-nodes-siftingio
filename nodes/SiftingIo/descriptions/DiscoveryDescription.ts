import type { INodeProperties } from 'n8n-workflow';
import { simpleLimitField, splitArray } from '../shared';

export const discoveryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['discovery'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search tickers and companies',
				description: 'Substring lookup over the SEC ticker registry (~13k US issuers)',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/stocks/search' },
					output: splitArray('data'),
				},
			},
			{
				name: 'Get Company Profile',
				value: 'getProfile',
				action: 'Get a company profile',
				description:
					'Name, exchanges, SIC industry, fiscal year end and entity type for one issuer',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/stocks/{{$parameter.ticker}}/profile' },
				},
			},
		],
		default: 'search',
	},
];

export const discoveryFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'apple',
		description: 'Search term. Substring against company name, prefix against ticker.',
		displayOptions: { show: { resource: ['discovery'], operation: ['search'] } },
		routing: { send: { type: 'query', property: 'q' } },
	},
	simpleLimitField('discovery', 'search', 100, 25),
	{
		displayName: 'Ticker',
		name: 'ticker',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'AAPL',
		description: 'Ticker symbol (case-insensitive)',
		displayOptions: { show: { resource: ['discovery'], operation: ['getProfile'] } },
	},
];
