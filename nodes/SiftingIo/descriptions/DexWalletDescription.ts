import type { INodeProperties } from 'n8n-workflow';

export const dexWalletOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dexWallet'] } },
		options: [
			{
				name: 'Get Portfolio',
				value: 'getPortfolio',
				action: 'Get a wallet portfolio',
				description: 'On-chain token balances for a wallet address on one chain',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fnd/dex/wallet/{{$parameter.chain}}/{{$parameter.address}}',
					},
				},
			},
		],
		default: 'getPortfolio',
	},
];

export const dexWalletFields: INodeProperties[] = [
	{
		displayName: 'Chain',
		name: 'chain',
		type: 'options',
		default: 'eth',
		description: 'Blockchain network',
		displayOptions: { show: { resource: ['dexWallet'], operation: ['getPortfolio'] } },
		options: [
			{ name: 'Arbitrum', value: 'arbitrum' },
			{ name: 'Base', value: 'base' },
			{ name: 'BSC', value: 'bsc' },
			{ name: 'Ethereum', value: 'eth' },
			{ name: 'Polygon', value: 'polygon' },
		],
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		default: '',
		placeholder: '0x…',
		description: 'Wallet address (0x followed by 40 hex characters)',
		displayOptions: { show: { resource: ['dexWallet'], operation: ['getPortfolio'] } },
	},
];
