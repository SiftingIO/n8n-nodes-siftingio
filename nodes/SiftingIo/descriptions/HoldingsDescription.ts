import type { INodeProperties } from 'n8n-workflow';
import { cursorPagination, limitField, returnAllField, splitArray } from '../shared';

export const holdingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['holdings'] } },
		options: [
			{
				name: 'Get Insider Transactions',
				value: 'getInsiders',
				action: 'Get insider transactions',
				description: 'Form 3/4/5 insider filings parsed into a row-per-transaction view',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/stocks/{{$parameter.ticker}}/insiders' },
					send: { paginate: '={{ $parameter.returnAll }}' },
					operations: cursorPagination,
					output: splitArray('data'),
				},
			},
			{
				name: 'Get 13F Holdings',
				value: 'get13F',
				action: 'Get 13F institutional holdings',
				description: 'Latest 13F-HR positions for an institutional manager',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/filers/{{$parameter.filer}}/holdings' },
					send: { paginate: '={{ $parameter.returnAll }}' },
					operations: cursorPagination,
					output: splitArray('positions'),
				},
			},
		],
		default: 'getInsiders',
	},
];

export const holdingsFields: INodeProperties[] = [
	{
		displayName: 'Ticker',
		name: 'ticker',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'AAPL',
		description: 'Ticker symbol (case-insensitive)',
		displayOptions: { show: { resource: ['holdings'], operation: ['getInsiders'] } },
	},
	{
		displayName: 'Filer',
		name: 'filer',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'BRK-B',
		description: 'Ticker (e.g. BRK-B) or CIK (e.g. 1037389) of the institutional manager.',
		displayOptions: { show: { resource: ['holdings'], operation: ['get13F'] } },
	},
	returnAllField('holdings', ['getInsiders', 'get13F']),
	limitField('holdings', 'getInsiders', 25, 10),
	limitField('holdings', 'get13F', 200, 50),
];
