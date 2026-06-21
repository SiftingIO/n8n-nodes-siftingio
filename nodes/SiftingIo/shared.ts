import type { IN8nRequestOperations, INodeProperties, INodeRequestOutput } from 'n8n-workflow';

/**
 * Generic cursor pagination for SiftingIO list endpoints.
 *
 * SiftingIO returns `meta.next_cursor` (opaque token) on each page and omits it
 * (or sets it null) on the final page. We continue while it is present and feed
 * it back as the `cursor` query parameter. Gated per-operation by the
 * `returnAll` parameter via `routing.send.paginate`.
 */
export const cursorPagination: IN8nRequestOperations = {
	pagination: {
		type: 'generic',
		properties: {
			continue: '={{ ($response.body.meta || {}).next_cursor ? true : false }}',
			request: {
				qs: {
					cursor: '={{ $response.body.meta.next_cursor }}',
				},
			},
		},
	},
};

/** Extract an array from the response envelope so each element becomes its own item. */
export function splitArray(property: string): INodeRequestOutput {
	return {
		postReceive: [
			{
				type: 'rootProperty',
				properties: { property },
			},
		],
	};
}

const toArray = (operation: string | string[]): string[] =>
	Array.isArray(operation) ? operation : [operation];

/** Standard "Return All" toggle for a cursor-paginated operation. */
export function returnAllField(resource: string, operation: string | string[]): INodeProperties {
	return {
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: { resource: [resource], operation: toArray(operation) } },
	};
}

/** "Limit" field shown when Return All is off (cursor-paginated operations). */
export function limitField(
	resource: string,
	operation: string | string[],
	maxValue: number,
	defaultValue = 50,
): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue },
		// SiftingIO page-size caps differ per endpoint (e.g. insiders maxes at 25), so the
		// default is parameterised rather than the fixed 50 the lint rule expects.
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: defaultValue,
		description: 'Max number of results to return',
		displayOptions: {
			show: { resource: [resource], operation: toArray(operation), returnAll: [false] },
		},
		routing: { send: { type: 'query', property: 'limit' } },
	};
}

/** "Limit" field for endpoints that cap page size but do not expose a cursor. */
export function simpleLimitField(
	resource: string,
	operation: string | string[],
	maxValue: number,
	defaultValue = 50,
): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue },
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: defaultValue,
		description: 'Max number of results to return',
		displayOptions: { show: { resource: [resource], operation: toArray(operation) } },
		routing: { send: { type: 'query', property: 'limit' } },
	};
}
