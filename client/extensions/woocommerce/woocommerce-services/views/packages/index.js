/**
 * External dependencies
 */
import React, { PropTypes, Component } from 'react';
import { translate as __ } from 'i18n-calypso';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

/**
 * Internal dependencies
 */
import BulkSelect from '../../../components/bulk-select';
import CompactCard from 'components/card/compact';
import FormSectionHeading from 'components/forms/form-section-heading';
import FormFieldset from 'components/forms/form-fieldset';
import FormButton from 'components/forms/form-button';
import FoldableCard from 'components/foldable-card';
import Spinner from 'components/spinner';
import PackagesList from './packages-list';
import AddPackageDialog from './add-package';
import * as PackagesActions from '../../state/packages/actions';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getPackagesForm } from '../../state/packages/selectors';

class Packages extends Component {
	componentWillMount() {
		if ( this.props.siteId ) {
			this.props.fetchSettings( this.props.siteId );
		}
	}

	componentWillReceiveProps( props ) {
		if ( props.siteId !== this.props.siteId ) {
			this.props.fetchSettings( props.siteId );
		}
	}

	predefSummary = ( serviceSelected, groupDefinitions ) => {
		const groupPackageIds = groupDefinitions.map( ( def ) => def.id );
		const diffLen = _.difference( groupPackageIds, serviceSelected ).length;

		if ( 0 >= diffLen ) {
			return __( 'All packages selected' );
		}

		const selectedCount = groupPackageIds.length - diffLen;
		return __( '%(selectedCount)d package selected', '%(selectedCount)d packages selected', {
			count: selectedCount,
			args: { selectedCount },
		} );
	};

	renderPredefHeader = ( title, selected, packages, serviceId, groupId ) => {
		if ( ! selected ) {
			return null;
		}

		const onToggle = ( state, event ) => {
			event.stopPropagation();
			this.props.toggleAll( this.props.siteId, serviceId, groupId, event.target.checked );
		};

		return (
			<div className="packages__group-header" >
				<BulkSelect
					totalElements={ packages.length }
					selectedElements={ selected.length }
					onToggle={ onToggle } />
				{ title }
			</div>
		);
	};

	renderPredefinedPackages = () => {
		const elements = [];

		if ( this.props.isFetching ) {
			return (
				<div>
					<Spinner size={ 24 } />
				</div>
			);
		}

		_.forEach( this.props.form.predefinedSchema, ( servicePackages, serviceId ) => {
			const serviceSelected = this.props.form.packages.predefined[ serviceId ] || [];

			_.forEach( servicePackages, ( predefGroup, groupId ) => {
				const groupPackages = predefGroup.definitions;
				const nonFlatRates = _.reject( groupPackages, 'is_flat_rate' );
				if ( ! nonFlatRates.length ) {
					return;
				}

				const groupSelected = _.filter( serviceSelected, selectedId => _.some( groupPackages, pckg => pckg.id === selectedId ) );
				const summary = this.predefSummary( groupSelected, nonFlatRates );

				elements.push( <FoldableCard
					key={ `${ serviceId }_${ groupId }` }
					header={ this.renderPredefHeader( predefGroup.title, groupSelected, nonFlatRates, serviceId, groupId ) }
					summary={ summary }
					expandedSummary={ summary }
					clickableHeader={ true }
					compact
					expanded={ false }
					screenReaderText={ __( 'Expand Services' ) }
					icon="chevron-down"
				>
					<PackagesList
						siteId={ this.props.siteId }
						packages={ groupPackages }
						selected={ groupSelected }
						serviceId={ serviceId }
						groupId={ groupId }
						toggleAll={ this.props.toggleAll }
						togglePackage={ this.props.togglePackage }
						dimensionUnit={ this.props.form.dimensionUnit }
						editable={ false } />
				</FoldableCard> );
			} );
		} );

		return elements;
	};

	render() {
		const { isFetching, siteId, form } = this.props;

		if ( ! form.packages && ! isFetching ) {
			return (
				<CompactCard className="settings-group-card">
					<p className="error-message">
						{ __( 'Unable to get your settings. Please refresh the page to try again.' ) }
					</p>
				</CompactCard>
			);
		}

		const addPackage = () => ( this.props.addPackage( siteId ) );

		return (
			<div>
				<CompactCard className="settings-group-card">
					<FormSectionHeading className="settings-group-header">{ __( 'Custom packages' ) }</FormSectionHeading>
					<div className="settings-group-content">
						<PackagesList
							siteId={ this.props.siteId }
							packages={ ( form.packages || {} ).custom }
							dimensionUnit={ form.dimensionUnit }
							editable={ true }
							removePackage={ this.props.removePackage }
							editPackage={ this.props.editPackage } />
						{ ( ! isFetching ) && <AddPackageDialog { ...this.props } /> }
						<FormFieldset className="add-package-button-field">
							<FormButton
								type="button"
								isPrimary={ false }
								compact
								disabled={ isFetching }
								onClick={ addPackage } >
								{ __( 'Add a package' ) }
							</FormButton>
						</FormFieldset>
					</div>
				</CompactCard>
				<CompactCard className="settings-group-card">
					<FormSectionHeading className="settings-group-header">{ __( 'Predefined packages' ) }</FormSectionHeading>
					<div className="settings-group-content">
						{ this.renderPredefinedPackages() }
					</div>
				</CompactCard>
			</div>
		);
	};
}

Packages.propTypes = {
	addPackage: PropTypes.func.isRequired,
	removePackage: PropTypes.func.isRequired,
	editPackage: PropTypes.func.isRequired,
	dismissModal: PropTypes.func.isRequired,
	setSelectedPreset: PropTypes.func.isRequired,
	savePackage: PropTypes.func.isRequired,
	updatePackagesField: PropTypes.func.isRequired,
	toggleOuterDimensions: PropTypes.func.isRequired,
	setModalErrors: PropTypes.func.isRequired,
	showModal: PropTypes.bool,
	form: PropTypes.object,
};

export default connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );
		const form = getPackagesForm( state, siteId );
		return {
			siteId,
			isFetching: ! form || form.isFetching,
			form,
		};
	},
	( dispatch ) => (
		{
			...bindActionCreators( PackagesActions, dispatch ),
		} )
)( Packages );
