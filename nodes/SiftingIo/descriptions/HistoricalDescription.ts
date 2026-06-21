import type { INodeProperties } from 'n8n-workflow';
import { cursorPagination, limitField, returnAllField, splitArray } from '../shared';

const barsRouting = (url: string) => ({
	request: { method: 'GET' as const, url },
	send: { paginate: '={{ $parameter.returnAll }}' },
	operations: cursorPagination,
	output: splitArray('data'),
});

const intradayIntervals = [
	{ name: '1 Minute', value: '1m' },
	{ name: '5 Minutes', value: '5m' },
	{ name: '15 Minutes', value: '15m' },
	{ name: '30 Minutes', value: '30m' },
	{ name: '1 Hour', value: '1h' },
];

export const historicalOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['historical'] } },
		options: [
			{
				name: 'Get Stock Bars',
				value: 'getStockBars',
				action: 'Get historical stock bars',
				description: 'Time-bucketed OHLCV bars for a US stock',
				routing: barsRouting('=/v1/hist/stocks/{{$parameter.ticker}}/bars'),
			},
			{
				name: 'Get Forex Bars',
				value: 'getForexBars',
				action: 'Get historical forex bars',
				description: 'Time-bucketed OHLCV bars for a forex pair (mid prices)',
				routing: barsRouting('=/v1/hist/forex/{{$parameter.pair}}/bars'),
			},
			{
				name: 'Get Crypto Bars',
				value: 'getCryptoBars',
				action: 'Get historical crypto bars',
				description: 'Time-bucketed OHLCV bars for a USD-quoted crypto symbol',
				routing: barsRouting('=/v1/hist/crypto/{{$parameter.symbol}}/bars'),
			},
			{
				name: 'Get DEX Bars',
				value: 'getDexBars',
				action: 'Get historical DEX bars',
				description: 'Time-bucketed OHLCV bars derived from on-chain DEX swaps',
				routing: barsRouting('=/v1/hist/dex/{{$parameter.symbol}}/bars'),
			},
			{
				name: 'Get Commodities Bars',
				value: 'getCommoditiesBars',
				action: 'Get historical commodities bars',
				description: 'Time-bucketed OHLCV bars for precious-metals commodities',
				routing: barsRouting('=/v1/hist/commodities/{{$parameter.symbol}}/bars'),
			},
		],
		default: 'getStockBars',
	},
];

export const historicalFields: INodeProperties[] = [
	{
		displayName: 'Ticker',
		name: 'ticker',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'AAPL',
		description: 'Ticker symbol (case-insensitive)',
		displayOptions: { show: { resource: ['historical'], operation: ['getStockBars'] } },
	},
	{
		displayName: 'Pair',
		name: 'pair',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'EURUSD',
		description: 'Six-character forex pair, e.g. EURUSD, USDJPY, GBPUSD',
		displayOptions: { show: { resource: ['historical'], operation: ['getForexBars'] } },
	},
	{
		displayName: 'Symbol',
		name: 'symbol',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'BTCUSD',
		description: 'Instrument symbol, e.g. BTCUSD (crypto), ETHUSD (DEX), XAUUSD (commodities)',
		displayOptions: {
			show: {
				resource: ['historical'],
				operation: ['getCryptoBars', 'getDexBars', 'getCommoditiesBars'],
			},
		},
	},
	{
		displayName: 'Start',
		name: 'start',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2025-01-01',
		description: 'Start of the window (YYYY-MM-DD or RFC3339)',
		displayOptions: { show: { resource: ['historical'] } },
		routing: { send: { type: 'query', property: 'start' } },
	},
	{
		displayName: 'End',
		name: 'end',
		type: 'string',
		default: '',
		placeholder: '2025-12-31',
		description: 'End of the window (YYYY-MM-DD or RFC3339). Defaults to now.',
		displayOptions: { show: { resource: ['historical'] } },
		routing: { send: { type: 'query', property: 'end' } },
	},
	{
		displayName: 'Interval',
		name: 'interval',
		type: 'options',
		default: '1h',
		description: 'Bar bucket size. All markets support 1m, 5m, 15m, 30m and 1h.',
		displayOptions: { show: { resource: ['historical'] } },
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: intradayIntervals,
		routing: { send: { type: 'query', property: 'interval' } },
	},
	returnAllField('historical', [
		'getStockBars',
		'getForexBars',
		'getCryptoBars',
		'getDexBars',
		'getCommoditiesBars',
	]),
	limitField('historical', ['getStockBars', 'getForexBars', 'getCommoditiesBars'], 2000, 100),
	limitField('historical', ['getCryptoBars', 'getDexBars'], 5000, 100),
];
