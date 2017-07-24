/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { includes } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import PackagesListItem from './packages-list-item';
import Spinner from 'components/spinner';

const PackagesList = ( {
		siteId,
		packages,
		dimensionUnit,
		editable,
		selected,
		serviceId,
		editPackage,
		togglePackage,
		translate
	} ) => {
	const renderPackageListItem = ( pckg, idx ) => {
		const isSelected = selected && includes( selected, pckg.id );
		const onToggle = () => togglePackage( siteId, serviceId, pckg.id );

		return (
			<PackagesListItem
				key={ idx }
				index={ idx }
				data={ pckg }
				selected={ isSelected }
				{ ...{
					siteId,
					onToggle,
					editable,
					dimensionUnit,
					editPackage,
				} }
			/>
		);
	};

	const renderList = () => {
		if ( ! packages ) {
			return (
				<div className="loading-spinner">
					<Spinner size={ 24 } />
				</div>
			);
		}
		return packages.map( ( pckg, idx ) => renderPackageListItem( pckg, idx ) );
	};

	const renderHeader = () => {
		if ( ! packages || ! packages.length ) {
			return null;
		}

		const className = classNames( 'packages__packages-row packages__packages-header', {
			selectable: ! editable
		} );

		return (
			<div className={ className }>
				{ ! editable && <div className="packages__packages-row-actions" /> }
				<div className="packages__packages-row-icon"></div>
				<div className="packages__packages-row-details">{ translate( 'Name' ) }</div>
				<div className="packages__packages-row-dimensions">{ translate( 'Dimensions' ) }</div>
				{ editable && <div className="packages__packages-row-actions" /> }
			</div>
		);
	};

	return (
		<div>
			{ renderHeader() }
			{ renderList() }
		</div>
	);
};

PackagesList.propTypes = {
	siteId: PropTypes.number,
	packages: PropTypes.array,
	dimensionUnit: PropTypes.string,
	editable: PropTypes.bool.isRequired,
	selected: PropTypes.array,
	serviceId: PropTypes.string,
	groupId: PropTypes.string,
	toggleAll: PropTypes.func,
	togglePackage: PropTypes.func,
	editPackage: PropTypes.func,
};

export default localize( PackagesList );
