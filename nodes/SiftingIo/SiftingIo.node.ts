import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { convertFields, convertOperations } from './descriptions/ConvertDescription';
import { dexWalletFields, dexWalletOperations } from './descriptions/DexWalletDescription';
import { discoveryFields, discoveryOperations } from './descriptions/DiscoveryDescription';
import {
	economicCalendarFields,
	economicCalendarOperations,
} from './descriptions/EconomicCalendarDescription';
import { filingFields, filingOperations } from './descriptions/FilingDescription';
import { filingTextFields, filingTextOperations } from './descriptions/FilingTextDescription';
import { financialsFields, financialsOperations } from './descriptions/FinancialsDescription';
import { historicalFields, historicalOperations } from './descriptions/HistoricalDescription';
import { holdingsFields, holdingsOperations } from './descriptions/HoldingsDescription';
import { liveFields, liveOperations } from './descriptions/LiveDescription';
import { marketFields, marketOperations } from './descriptions/MarketDescription';

export class SiftingIo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SiftingIO',
		name: 'siftingIo',
		icon: 'file:siftingio.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the SiftingIO financial-data API',
		defaults: { name: 'SiftingIO' },
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'siftingIoApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Accept-Encoding': 'gzip',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Convert', value: 'convert' },
					{ name: 'DEX Wallet', value: 'dexWallet' },
					{ name: 'Discovery', value: 'discovery' },
					{ name: 'Economic Calendar', value: 'economicCalendar' },
					{ name: 'Filing Text', value: 'filingText' },
					{ name: 'Financial', value: 'financials' },
					{ name: 'Historical', value: 'historical' },
					{ name: 'Holding', value: 'holdings' },
					{ name: 'Live', value: 'live' },
					{ name: 'Market', value: 'market' },
					{ name: 'SEC Filing', value: 'filing' },
				],
				default: 'discovery',
			},

			...discoveryOperations,
			...discoveryFields,
			...filingOperations,
			...filingFields,
			...filingTextOperations,
			...filingTextFields,
			...financialsOperations,
			...financialsFields,
			...holdingsOperations,
			...holdingsFields,
			...economicCalendarOperations,
			...economicCalendarFields,
			...marketOperations,
			...marketFields,
			...historicalOperations,
			...historicalFields,
			...liveOperations,
			...liveFields,
			...convertOperations,
			...convertFields,
			...dexWalletOperations,
			...dexWalletFields,
		],
	};
}
