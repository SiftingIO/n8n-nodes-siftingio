import type { INodeProperties } from 'n8n-workflow';
import { cursorPagination, limitField, returnAllField, splitArray } from '../shared';

const cursorListRouting = (url: string) => ({
	request: { method: 'GET' as const, url },
	send: { paginate: '={{ $parameter.returnAll }}' },
	operations: cursorPagination,
	output: splitArray('data'),
});

export const filingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['filing'] } },
		options: [
			{
				name: 'List Filings',
				value: 'list',
				action: 'List recent SEC filings',
				description: 'Up to 1000 most recent filings across all form types for a company',
				routing: cursorListRouting('=/v1/fnd/stocks/{{$parameter.ticker}}/filings'),
			},
			{
				name: 'Get Filing',
				value: 'get',
				action: 'Get a single filing',
				description: "One filing's metadata plus its EDGAR archive file manifest",
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fnd/stocks/{{$parameter.ticker}}/filings/{{$parameter.accession}}',
					},
				},
			},
			{
				name: 'Get Material Events (8-K)',
				value: 'getEvents',
				action: 'Get 8-K material events',
				description: '8-K filings for material corporate events, optionally filtered by item code',
				routing: cursorListRouting('=/v1/fnd/stocks/{{$parameter.ticker}}/events'),
			},
			{
				name: 'Get Ownership (13D/G)',
				value: 'getOwnership',
				action: 'Get beneficial ownership filings',
				description: 'Schedule 13D/13G beneficial-ownership filings and amendments',
				routing: cursorListRouting('=/v1/fnd/stocks/{{$parameter.ticker}}/ownership'),
			},
			{
				name: 'Get Proxy Statements (DEF 14A)',
				value: 'getProxy',
				action: 'Get DEF 14A proxy statements',
				description: 'DEF 14A proxy statements including amendments and additional material',
				routing: cursorListRouting('=/v1/fnd/stocks/{{$parameter.ticker}}/compensation'),
			},
			{
				name: 'Get Earnings History',
				value: 'getEarnings',
				action: 'Get earnings release history',
				description: 'Every 8-K filed with item 2.02 (results of operations) for this company',
				routing: cursorListRouting('=/v1/fnd/stocks/{{$parameter.ticker}}/earnings'),
			},
		],
		default: 'list',
	},
];

export const filingFields: INodeProperties[] = [
	{
		displayName: 'Ticker',
		name: 'ticker',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'AAPL',
		description: 'Ticker symbol (case-insensitive)',
		displayOptions: { show: { resource: ['filing'] } },
	},
	{
		displayName: 'Accession',
		name: 'accession',
		type: 'string',
		required: true,
		default: '',
		placeholder: '0000320193-26-000013',
		description: 'Accession number, dashed or undashed',
		displayOptions: { show: { resource: ['filing'], operation: ['get'] } },
	},
	{
		displayName: 'Form Types',
		name: 'form',
		type: 'string',
		default: '',
		placeholder: '10-K,10-Q',
		description: 'Comma-separated exact form types to filter by, e.g. 10-K,10-Q,8-K',
		displayOptions: { show: { resource: ['filing'], operation: ['list'] } },
		routing: { send: { type: 'query', property: 'form' } },
	},
	{
		displayName: 'Filed From',
		name: 'from',
		type: 'string',
		default: '',
		placeholder: '2025-01-01',
		description: 'Inclusive lower bound on the filing date (YYYY-MM-DD)',
		displayOptions: { show: { resource: ['filing'], operation: ['list'] } },
		routing: { send: { type: 'query', property: 'from' } },
	},
	{
		displayName: 'Filed To',
		name: 'to',
		type: 'string',
		default: '',
		placeholder: '2025-12-31',
		description: 'Inclusive upper bound on the filing date (YYYY-MM-DD)',
		displayOptions: { show: { resource: ['filing'], operation: ['list'] } },
		routing: { send: { type: 'query', property: 'to' } },
	},
	{
		displayName: 'Item Code',
		name: 'item',
		type: 'string',
		default: '',
		placeholder: '2.02',
		description: 'Substring match against the 8-K item codes (e.g. 2.02 for earnings releases)',
		displayOptions: { show: { resource: ['filing'], operation: ['getEvents'] } },
		routing: { send: { type: 'query', property: 'item' } },
	},
	returnAllField('filing', ['list', 'getEvents', 'getOwnership', 'getProxy', 'getEarnings']),
	limitField('filing', ['list', 'getEvents', 'getOwnership', 'getProxy', 'getEarnings'], 200, 50),
];
