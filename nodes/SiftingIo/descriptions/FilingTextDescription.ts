import type { INodeProperties } from 'n8n-workflow';

export const filingTextOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['filingText'] } },
		options: [
			{
				name: 'Get All Sections',
				value: 'getAllSections',
				action: 'Extract every section',
				description: 'Every standard 10-K / 10-Q item extracted from the filing as clean text',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fnd/stocks/{{$parameter.ticker}}/filings/{{$parameter.accession}}/sections',
					},
				},
			},
			{
				name: 'Get One Section',
				value: 'getSection',
				action: 'Extract one section',
				description: 'A single extracted section (smaller payload for a single LLM prompt)',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fnd/stocks/{{$parameter.ticker}}/filings/{{$parameter.accession}}/sections/{{$parameter.section}}',
					},
				},
			},
			{
				name: 'Get Risk Factors Diff',
				value: 'getRiskDiff',
				action: 'Diff risk factors year over year',
				description:
					"Paragraph-level diff of the latest 10-K's Risk Factors against the prior year",
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fnd/stocks/{{$parameter.ticker}}/risk-factors-diff',
					},
				},
			},
		],
		default: 'getAllSections',
	},
];

export const filingTextFields: INodeProperties[] = [
	{
		displayName: 'Ticker',
		name: 'ticker',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'AAPL',
		description: 'Ticker symbol (case-insensitive)',
		displayOptions: { show: { resource: ['filingText'] } },
	},
	{
		displayName: 'Accession',
		name: 'accession',
		type: 'string',
		required: true,
		default: '',
		placeholder: '0000320193-25-000079',
		description: 'Accession number, dashed or undashed',
		displayOptions: {
			show: { resource: ['filingText'], operation: ['getAllSections', 'getSection'] },
		},
	},
	{
		displayName: 'Section',
		name: 'section',
		type: 'options',
		default: 'risk-factors',
		description: 'Which 10-K / 10-Q section to extract',
		displayOptions: { show: { resource: ['filingText'], operation: ['getSection'] } },
		options: [
			{ name: 'Business (Item 1)', value: 'business' },
			{ name: 'Legal Proceedings (Item 3)', value: 'legal-proceedings' },
			{ name: "Management's Discussion & Analysis", value: 'mda' },
			{ name: 'Market Risk (Item 7A)', value: 'market-risk' },
			{ name: 'Risk Factors (Item 1A)', value: 'risk-factors' },
		],
	},
];
