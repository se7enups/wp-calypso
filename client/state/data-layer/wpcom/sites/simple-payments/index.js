/**
 * External dependencies
 */
import { filter, noop } from 'lodash';

/**
 * Internal dependencies
 */
import {
	SIMPLE_PAYMENTS_PRODUCT_GET,
	SIMPLE_PAYMENTS_PRODUCTS_LIST,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_ADD,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_EDIT,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_DELETE,
} from 'state/action-types';
import {
	receiveProduct,
	receiveProductsList,
	receiveUpdateProduct,
	receiveDeleteProduct,
} from 'state/simple-payments/product-list/actions';
import { metaKeyToSchemaKeyMap, metadataSchema } from 'state/simple-payments/product-list/schema';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { SIMPLE_PAYMENTS_PRODUCT_POST_TYPE } from 'lib/simple-payments/constants';
import { isValidSimplePaymentsProduct } from 'lib/simple-payments/utils';
import formatCurrency from 'lib/format-currency';
import { getFeaturedImageId } from 'lib/posts/utils-ssr-ready';

/**
 * Convert custom post metadata array to product attributes
 * @param { Array } metadata Array of post metadata
 * @returns { Object } properties extracted from the metadata, to be merged into the product object
 */
function customPostMetadataToProductAttributes( metadata ) {
	const productAttributes = {};

	metadata.forEach( ( { key, value } ) => {
		const schemaKey = metaKeyToSchemaKeyMap[ key ];
		if ( schemaKey ) {
			productAttributes[ schemaKey ] = value;
		}
	} );

	return productAttributes;
}

/**
 * Formats /posts endpoint response into a product object
 * @param { Object } customPost raw /post endpoint response to format
 * @returns { Object } sanitized and formatted product
 */
export function customPostToProduct( customPost ) {
	const metadataAttributes = customPostMetadataToProductAttributes( customPost.metadata );

	return {
		ID: customPost.ID,
		description: customPost.content,
		title: customPost.title,
		featuredImageId: getFeaturedImageId( customPost ),
		...metadataAttributes,
	};
}

/**
 * Transforms a product definition object into proper custom post type
 * @param { Object } product action with product payload
 * @returns { Object } custom post type data
 */
export function productToCustomPost( product ) {
	// Get the `product` object entries and filter only those that will go into metadata
	const metadataEntries = Object.entries( product ).filter( ( [ key ] ) => metadataSchema[ key ] );

	// add formatted_price to display money correctly
	if ( ! product.formatted_price ) {
		metadataEntries.push( [
			'formatted_price',
			formatCurrency( product.price, product.currency ),
		] );
	}

	// Convert the `product` entries into a metadata array
	const metadata = metadataEntries.map( ( [ key, value ] ) => {
		if ( typeof value === 'boolean' ) {
			value = value ? 1 : 0;
		}

		return {
			key: metadataSchema[ key ].metaKey,
			value,
		};
	} );

	return {
		type: SIMPLE_PAYMENTS_PRODUCT_POST_TYPE,
		metadata,
		title: product.title,
		content: product.description,
		featured_image: product.featuredImageId || '',
	};
}

/**
 * Issues an API request to fetch a product by its ID for a site.
 *
 * @param  {Object}  store  Redux store
 * @param  {Object}  action Action object
 */
export function requestSimplePaymentsProduct( { dispatch }, action ) {
	const { siteId, productId } = action;

	dispatch(
		http(
			{
				method: 'GET',
				path: `/sites/${ siteId }/posts/${ productId }`,
			},
			action,
		),
	);
}

/**
 * Issues an API request to fetch products for a site.
 *
 * @param  {Object}  store  Redux store
 * @param  {Object}  action Action object
 */
export function requestSimplePaymentsProducts( { dispatch }, action ) {
	const { siteId } = action;

	dispatch(
		http(
			{
				method: 'GET',
				path: `/sites/${ siteId }/posts`,
				query: {
					type: SIMPLE_PAYMENTS_PRODUCT_POST_TYPE,
					status: 'publish',
				},
			},
			action,
		),
	);
}

/**
 * Issues an API request to add a new product
 * @param {Object} store Redux store
 * @param {Object} action Action object
 */
export function requestSimplePaymentsProductAdd( { dispatch }, action ) {
	const { siteId, product } = action;

	dispatch(
		http(
			{
				method: 'POST',
				path: `/sites/${ siteId }/posts/new`,
				body: productToCustomPost( product ),
			},
			action,
		),
	);
}

/**
 * Issues an API request to edit a product
 * @param {Object} store Redux store
 * @param {Object} action Action object
 */
export function requestSimplePaymentsProductEdit( { dispatch }, action ) {
	const { siteId, product, productId } = action;

	dispatch(
		http(
			{
				method: 'POST',
				path: `/sites/${ siteId }/posts/${ productId }`,
				body: productToCustomPost( product ),
			},
			action,
		),
	);
}

/**
 * Issues an API request to delete a product
 * @param {Object} store Redux store
 * @param {Object} action Action object
 */
export function requestSimplePaymentsProductDelete( { dispatch }, action ) {
	const { siteId, productId } = action;

	dispatch(
		http(
			{
				method: 'POST',
				path: `/sites/${ siteId }/posts/${ productId }/delete`,
			},
			action,
		),
	);
}

export const addProduct = ( { dispatch }, { siteId }, next, newProduct ) =>
	dispatch( receiveUpdateProduct( siteId, customPostToProduct( newProduct ) ) );

export const deleteProduct = ( { dispatch }, { siteId }, next, deletedProduct ) =>
	dispatch( receiveDeleteProduct( siteId, deletedProduct.ID ) );

export const listProduct = ( { dispatch }, { siteId }, next, product ) => {
	if ( ! isValidSimplePaymentsProduct( product ) ) {
		return;
	}

	dispatch( receiveProduct( siteId, customPostToProduct( product ) ) );
};

export const listProducts = ( { dispatch }, { siteId }, next, { posts: products } ) => {
	const validProducts = filter( products, isValidSimplePaymentsProduct );

	dispatch( receiveProductsList( siteId, validProducts.map( customPostToProduct ) ) );
};

export default {
	[ SIMPLE_PAYMENTS_PRODUCT_GET ]: [
		dispatchRequest( requestSimplePaymentsProduct, listProduct, noop ),
	],
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST ]: [
		dispatchRequest( requestSimplePaymentsProducts, listProducts, noop ),
	],
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST_ADD ]: [
		dispatchRequest( requestSimplePaymentsProductAdd, addProduct, noop ),
	],
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST_EDIT ]: [
		dispatchRequest( requestSimplePaymentsProductEdit, addProduct, noop ),
	],
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST_DELETE ]: [
		dispatchRequest( requestSimplePaymentsProductDelete, deleteProduct, noop ),
	],
};
