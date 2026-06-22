import type { INodeProperties } from 'n8n-workflow';
import { cursorPagination, limitField, returnAllField, splitArray } from '../shared';

export const financialsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['financials'] } },
		options: [
			{
				name: 'Get Full Bundle',
				value: 'getBundle',
				action: 'Get the full XBRL bundle',
				description:
					'Every reported XBRL concept for a company across every period (large payload)',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/stocks/{{$parameter.ticker}}/financials' },
				},
			},
			{
				name: 'Get Concept',
				value: 'getConcept',
				action: 'Get a single concept',
				description: 'One XBRL concept across every reported period for a company',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fnd/stocks/{{$parameter.ticker}}/financials/{{$parameter.concept}}',
					},
				},
			},
			{
				name: 'Screener',
				value: 'screener',
				action: 'Screen one concept across all filers',
				description: "Every filer's reported value for one concept in one period",
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fnd/stocks/screener/{{$parameter.concept}}/{{$parameter.period}}',
					},
					send: { paginate: '={{ $parameter.returnAll }}' },
					operations: cursorPagination,
					output: splitArray('rows'),
				},
			},
			{
				name: 'Get Ratios',
				value: 'getRatios',
				action: 'Get fundamental ratios',
				description: 'Standard fundamental ratios computed from XBRL data across every period',
				routing: {
					request: { method: 'GET', url: '=/v1/fnd/stocks/{{$parameter.ticker}}/ratios' },
				},
			},
		],
		default: 'getBundle',
	},
];

export const financialsFields: INodeProperties[] = [
	{
		displayName: 'Ticker',
		name: 'ticker',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'AAPL',
		description: 'Ticker symbol (case-insensitive)',
		displayOptions: {
			show: { resource: ['financials'], operation: ['getBundle', 'getConcept', 'getRatios'] },
		},
	},
	{
		displayName: 'Concept',
		name: 'concept',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Revenues',
		description: 'XBRL tag in CamelCase, e.g. Revenues, EarningsPerShareBasic, Assets',
		displayOptions: { show: { resource: ['financials'], operation: ['getConcept', 'screener'] } },
	},
	{
		displayName: 'Period',
		name: 'period',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'CY2024Q1',
		description:
			'SEC calendar period code: CY2024Q1 (duration), CY2024Q1I (instant), CY2024 (full year)',
		displayOptions: { show: { resource: ['financials'], operation: ['screener'] } },
	},
	{
		displayName: 'Taxonomy',
		name: 'taxonomy',
		type: 'options',
		default: 'us-gaap',
		description: 'XBRL taxonomy to query',
		displayOptions: { show: { resource: ['financials'], operation: ['getConcept', 'screener'] } },
		options: [
			{ name: 'US GAAP', value: 'us-gaap' },
			{ name: 'DEI', value: 'dei' },
			{ name: 'IFRS Full', value: 'ifrs-full' },
			{ name: 'SRT', value: 'srt' },
		],
		routing: { send: { type: 'query', property: 'taxonomy' } },
	},
	{
		displayName: 'Unit',
		name: 'unit',
		type: 'string',
		default: 'USD',
		placeholder: 'USD',
		description: 'Unit filter, e.g. USD, shares, USD/shares, pure',
		displayOptions: { show: { resource: ['financials'], operation: ['screener'] } },
		routing: { send: { type: 'query', property: 'unit' } },
	},
	returnAllField('financials', 'screener'),
	limitField('financials', 'screener', 200, 50),
];
