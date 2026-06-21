import type { INodeProperties } from 'n8n-workflow';
import { splitArray } from '../shared';

export const marketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['market'] } },
		options: [
			{
				name: 'List Markets',
				value: 'listMarkets',
				action: 'List trading venues',
				description: 'Reference metadata for global trading venues',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/markets' },
					output: splitArray('data'),
				},
			},
			{
				name: 'Get Status (All Markets)',
				value: 'getStatusAll',
				action: 'Get open closed status for all markets',
				description: 'Open / closed snapshot for every market',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/markets/status' },
					output: splitArray('data'),
				},
			},
			{
				name: 'Get Status (One Market)',
				value: 'getStatus',
				action: 'Get open closed status for one market',
				description: 'Open / closed snapshot for a single market',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/markets/{{$parameter.market}}/status' },
				},
			},
			{
				name: 'Get Hours',
				value: 'getHours',
				action: 'Get weekly trading hours',
				description: 'Weekly trading-hours schedule for a market',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/markets/{{$parameter.market}}/hours' },
				},
			},
			{
				name: 'Get Calendar',
				value: 'getCalendar',
				action: 'Get holiday calendar',
				description: 'Holiday and half-day calendar for a market',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/markets/{{$parameter.market}}/calendar' },
					output: splitArray('data'),
				},
			},
		],
		default: 'getStatusAll',
	},
];

export const marketFields: INodeProperties[] = [
	{
		displayName: 'Region',
		name: 'region',
		type: 'options',
		default: '',
		description: 'Filter markets by region',
		displayOptions: { show: { resource: ['market'], operation: ['listMarkets', 'getStatusAll'] } },
		options: [
			{ name: 'All', value: '' },
			{ name: 'Asia-Pacific', value: 'asia_pacific' },
			{ name: 'Europe', value: 'europe' },
			{ name: 'Global (Forex / Crypto)', value: 'global' },
			{ name: 'LATAM', value: 'latam' },
			{ name: 'North America', value: 'north_america' },
		],
		routing: { send: { type: 'query', property: 'region' } },
	},
	{
		displayName: 'Market',
		name: 'market',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'us_equities',
		description: 'Market slug, e.g. us_equities, jp_equities, forex, crypto',
		displayOptions: {
			show: { resource: ['market'], operation: ['getStatus', 'getHours', 'getCalendar'] },
		},
	},
	{
		displayName: 'From',
		name: 'from',
		type: 'string',
		default: '',
		placeholder: '2026-01-01',
		description: 'Inclusive lower bound (YYYY-MM-DD). Defaults to today.',
		displayOptions: { show: { resource: ['market'], operation: ['getCalendar'] } },
		routing: { send: { type: 'query', property: 'from' } },
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		default: '',
		placeholder: '2026-12-31',
		description: 'Inclusive upper bound (YYYY-MM-DD). Defaults to From + 90 days (max range 730 days).',
		displayOptions: { show: { resource: ['market'], operation: ['getCalendar'] } },
		routing: { send: { type: 'query', property: 'to' } },
	},
];
