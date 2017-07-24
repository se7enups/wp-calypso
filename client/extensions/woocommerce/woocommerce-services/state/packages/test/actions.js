/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	addPackage,
	removePackage,
	editPackage,
	dismissModal,
	setSelectedPreset,
	savePackage,
	updatePackagesField,
	toggleOuterDimensions,
	setModalErrors,
	setIsSaving,
	ADD_PACKAGE,
	REMOVE_PACKAGE,
	EDIT_PACKAGE,
	DISMISS_MODAL,
	SET_IS_SAVING,
	SET_SELECTED_PRESET,
	SAVE_PACKAGE,
	UPDATE_PACKAGES_FIELD,
	TOGGLE_OUTER_DIMENSIONS,
	SET_MODAL_ERRORS,
} from '../actions';

const siteId = 123;

describe( 'Packages state actions', () => {
	it( '#addPackage()', () => {
		expect( addPackage( siteId ) ).to.eql( {
			type: ADD_PACKAGE,
			siteId,
		} );
	} );

	it( '#editPackage()', () => {
		const packageToEdit = {
			name: 'Test box',
			dimensions: '10 x 13 x 6',
			is_letter: false,
		};
		expect( editPackage( siteId, packageToEdit ) ).to.eql( {
			type: EDIT_PACKAGE,
			'package': packageToEdit,
			siteId,
		} );
	} );

	it( '#dismissModal()', () => {
		expect( dismissModal( siteId ) ).to.eql( {
			type: DISMISS_MODAL,
			siteId,
		} );
	} );

	it( '#setSelectedPreset()', () => {
		expect( setSelectedPreset( siteId, 'a' ) ).to.eql( {
			type: SET_SELECTED_PRESET,
			value: 'a',
			siteId,
		} );

		expect( setSelectedPreset( siteId, 'ab' ) ).to.eql( {
			type: SET_SELECTED_PRESET,
			value: 'ab',
			siteId,
		} );
	} );

	it( '#savePackage()', () => {
		const packageData = {
			name: 'Test box',
			dimensions: '10 x 13 x 6',
			is_letter: false,
		};

		const state = savePackage( siteId, packageData );

		expect( state ).to.eql( {
			type: SAVE_PACKAGE,
			packageData,
			siteId,
		} );
	} );

	it( '#updatePackagesField()', () => {
		const fieldsToUpdate = {
			name: 'Test box',
			dimensions: '10 x 13 x 6',
			is_letter: false,
		};
		expect( updatePackagesField( siteId, fieldsToUpdate ) ).to.eql( {
			type: UPDATE_PACKAGES_FIELD,
			values: fieldsToUpdate,
			siteId,
		} );
	} );

	it( '#toggleOuterDimensions()', () => {
		expect( toggleOuterDimensions( siteId ) ).to.eql( {
			type: TOGGLE_OUTER_DIMENSIONS,
			siteId,
		} );
	} );

	it( '#setModalErrors()', () => {
		expect( setModalErrors( siteId, true ) ).to.eql( {
			type: SET_MODAL_ERRORS,
			value: true,
			siteId,
		} );

		expect( setModalErrors( siteId, false ) ).to.eql( {
			type: SET_MODAL_ERRORS,
			value: false,
			siteId,
		} );

		expect( setModalErrors( siteId, { any: true } ) ).to.eql( {
			type: SET_MODAL_ERRORS,
			value: { any: true },
			siteId,
		} );
	} );

	it( '#removePackage', () => {
		expect( removePackage( siteId, 0 ) ).to.eql( {
			type: REMOVE_PACKAGE,
			index: 0,
			siteId,
		} );
	} );

	it( '#setIsSaving', () => {
		expect( setIsSaving( siteId, true ) ).to.eql( {
			type: SET_IS_SAVING,
			isSaving: true,
			siteId,
		} );
	} );
} );
