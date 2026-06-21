import type { INodeProperties } from 'n8n-workflow';
import { splitArray } from '../shared';

const tradeVenues = [
	{ name: 'Commodities', value: 'commodities' },
	{ name: 'Crypto', value: 'crypto' },
	{ name: 'DEX', value: 'dex' },
	{ name: 'Forex', value: 'forex' },
	{ name: 'Stocks', value: 'stocks' },
];

const chains = [
	{ name: 'Arbitrum', value: 'arbitrum' },
	{ name: 'Base', value: 'base' },
	{ name: 'BSC', value: 'bsc' },
	{ name: 'Ethereum', value: 'eth' },
	{ name: 'Polygon', value: 'polygon' },
];

export const liveOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['live'] } },
		options: [
			{
				name: 'Get Last Trade',
				value: 'getTrade',
				action: 'Get the last trade',
				description: 'Most recent trade price and size for a symbol',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/last/trade/{{$parameter.venue}}/{{$parameter.symbol}}',
					},
				},
			},
			{
				name: 'Get Last Quote',
				value: 'getQuote',
				action: 'Get the last quote',
				description: 'Most recent top-of-book bid/ask for a symbol',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/last/quote/{{$parameter.venue}}/{{$parameter.symbol}}',
					},
				},
			},
			{
				name: 'Get Snapshot',
				value: 'getSnapshot',
				action: 'Get a full venue snapshot',
				description: 'Full-venue market snapshot, optionally narrowed to specific symbols',
				routing: {
					request: { method: 'GET', url: '=/v1/snapshot/{{$parameter.venue}}' },
					output: splitArray('data'),
				},
			},
			{
				name: 'Get DEX TVL',
				value: 'getTvl',
				action: 'Get DEX total value locked',
				description: 'Total value locked for a DEX pair on a chain',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/last/tvl/{{$parameter.chain}}/{{$parameter.pair}}',
					},
				},
			},
		],
		default: 'getQuote',
	},
];

export const liveFields: INodeProperties[] = [
	{
		displayName: 'Venue',
		name: 'venue',
		type: 'options',
		default: 'crypto',
		description: 'Asset class / venue',
		displayOptions: { show: { resource: ['live'], operation: ['getTrade', 'getQuote'] } },
		options: tradeVenues,
	},
	{
		displayName: 'Venue',
		name: 'venue',
		type: 'options',
		default: 'crypto',
		description: 'Asset class / venue',
		displayOptions: { show: { resource: ['live'], operation: ['getSnapshot'] } },
		options: [
			{ name: 'Crypto', value: 'crypto' },
			{ name: 'DEX', value: 'dex' },
			{ name: 'Forex', value: 'forex' },
			{ name: 'Stocks', value: 'stocks' },
		],
	},
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'BTCUSD',
		description: 'Instrument symbol (no separators), e.g. BTCUSD, EURUSD, AAPL',
		displayOptions: { show: { resource: ['live'], operation: ['getTrade', 'getQuote'] } },
	},
	{
		displayName: 'Symbols',
		name: 'symbols',
		type: 'string',
		default: '',
		placeholder: 'BTCUSD,ETHUSD,SOLUSD',
		description: 'Optional comma-separated list (up to 250). Omit to return the whole venue.',
		displayOptions: { show: { resource: ['live'], operation: ['getSnapshot'] } },
		routing: { send: { type: 'query', property: 'symbols' } },
	},
	{
		displayName: 'Chain',
		name: 'chain',
		type: 'options',
		default: 'eth',
		description: 'Blockchain network',
		displayOptions: { show: { resource: ['live'], operation: ['getTvl'] } },
		options: chains,
	},
	{
		displayName: 'Pair',
		name: 'pair',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'WETH-USDC',
		description: 'DEX pair as TOKEN0-TOKEN1 (single hyphen)',
		displayOptions: { show: { resource: ['live'], operation: ['getTvl'] } },
	},
];
