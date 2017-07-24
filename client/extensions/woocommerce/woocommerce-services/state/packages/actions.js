/**
 * Internal dependencies
 */
import * as api from '../../api';

export const ADD_PACKAGE = 'ADD_PACKAGE';
export const REMOVE_PACKAGE = 'REMOVE_PACKAGE';
export const EDIT_PACKAGE = 'EDIT_PACKAGE';
export const DISMISS_MODAL = 'DISMISS_MODAL';
export const SET_IS_SAVING = 'SET_IS_SAVING';
export const SET_MODAL_ERRORS = 'SET_MODAL_ERROR';
export const SET_SELECTED_PRESET = 'SET_SELECTED_PRESET';
export const SAVE_PACKAGE = 'SAVE_PACKAGE';
export const UPDATE_PACKAGES_FIELD = 'UPDATE_PACKAGES_FIELD';
export const TOGGLE_OUTER_DIMENSIONS = 'TOGGLE_OUTER_DIMENSIONS';
export const TOGGLE_ALL = 'TOGGLE_ALL';
export const TOGGLE_PACKAGE = 'TOGGLE_PACKAGE';
export const SET_IS_FETCHING = 'SET_IS_FETCHING';
export const INIT_PACKAGES_FORM = 'INIT_PACKAGES_FORM';

import { getPackagesForm } from './selectors';

export const addPackage = ( siteId ) => ( {
	type: ADD_PACKAGE,
	siteId,
} );

export const removePackage = ( siteId, index ) => ( {
	type: REMOVE_PACKAGE,
	index,
	siteId,
} );

export const editPackage = ( siteId, packageToEdit ) => ( {
	type: EDIT_PACKAGE,
	'package': packageToEdit,
	siteId,
} );

export const dismissModal = ( siteId ) => ( {
	type: DISMISS_MODAL,
	siteId,
} );

export const setSelectedPreset = ( siteId, value ) => ( {
	type: SET_SELECTED_PRESET,
	value,
	siteId,
} );

export const savePackage = ( siteId, packageData ) => ( {
	type: SAVE_PACKAGE,
	packageData,
	siteId,
} );

export const updatePackagesField = ( siteId, newValues ) => ( {
	type: UPDATE_PACKAGES_FIELD,
	values: newValues,
	siteId,
} );

export const toggleOuterDimensions = ( siteId ) => ( {
	type: TOGGLE_OUTER_DIMENSIONS,
	siteId,
} );

export const toggleAll = ( siteId, serviceId, groupId, checked ) => ( {
	type: TOGGLE_ALL,
	serviceId,
	groupId,
	checked,
	siteId,
} );

export const togglePackage = ( siteId, serviceId, packageId ) => ( {
	type: TOGGLE_PACKAGE,
	serviceId,
	packageId,
	siteId,
} );

export const setModalErrors = ( siteId, value ) => ( {
	type: SET_MODAL_ERRORS,
	value,
	siteId,
} );

export const setIsSaving = ( siteId, isSaving ) => ( {
	type: SET_IS_SAVING,
	isSaving,
	siteId,
} );

export const fetchSettings = ( siteId ) => ( dispatch, getState ) => {
	const form = getPackagesForm( getState(), siteId );

	if ( form && ( form.packages || form.isFetching ) ) {
		return;
	}
	dispatch( { type: SET_IS_FETCHING, isFetching: true, siteId } );

	api.get( siteId, api.url.packages() )
		.then( ( { formData, formSchema, storeOptions } ) => {
			dispatch( {
				type: INIT_PACKAGES_FORM,
				packages: formData,
				dimensionUnit: storeOptions.dimension_unit,
				weightUnit: storeOptions.weight_unit,
				packageSchema: formSchema.custom.items,
				predefinedSchema: formSchema.predefined,
				siteId,
			} );
		} )
		.catch( ( error ) => {
			console.error( error ); // eslint-disable-line no-console
		} )
		.then( () => dispatch( { type: SET_IS_FETCHING, isFetching: false, siteId } ) );
};

export const submit = ( siteId, onSaveSuccess, onSaveFailure ) => ( dispatch, getState ) => {
	const form = getPackagesForm( getState(), siteId );
	dispatch( setIsSaving( siteId, true ) );
	api.post( siteId, api.url.packages(), form.packages )
		.then( onSaveSuccess )
		.catch( onSaveFailure )
		.then( () => dispatch( setIsSaving( siteId, false ) ) );
};
