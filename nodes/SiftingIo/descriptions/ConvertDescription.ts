import type { INodeProperties } from 'n8n-workflow';

export const convertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['convert'] } },
		options: [
			{
				name: 'Get Rate',
				value: 'getRate',
				action: 'Convert between currencies',
				description: 'Convert an amount between forex and/or crypto at live market rates',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/convert/{{$parameter.from}}/{{$parameter.to}}',
					},
				},
			},
		],
		default: 'getRate',
	},
];

export const convertFields: INodeProperties[] = [
	{
		displayName: 'From',
		name: 'from',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'USD',
		description: 'Source currency or asset (case-insensitive), e.g. USD, EUR, BTC',
		displayOptions: { show: { resource: ['convert'], operation: ['getRate'] } },
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'EUR',
		description: 'Target currency or asset (case-insensitive), e.g. EUR, JPY, ETH',
		displayOptions: { show: { resource: ['convert'], operation: ['getRate'] } },
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		default: 1,
		description: 'Amount of the source asset to convert. Defaults to 1.',
		displayOptions: { show: { resource: ['convert'], operation: ['getRate'] } },
		routing: { send: { type: 'query', property: 'amount' } },
	},
];
