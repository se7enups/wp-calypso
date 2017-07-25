/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import SectionHeader from 'components/section-header';

class PostCard extends Component {

	handleRemove = () => {
		this.props.remove( this.props.cardIdx );
	}

	handleMouseDown = ( event ) => {
		event.stopPropagation();
		event.preventDefault();
	}

	render() {
		const {
			translate,
			post: {
				title,
				slug,
			}
		} = this.props;

		return (
			<SectionHeader key={ slug } label={ title } className="zone__list-item">
				<Button compact>{ translate( 'View' ) }</Button>
				<Button compact>{ translate( 'Edit' ) }</Button>
				<Button
					compact
					scary
					onMouseDown={ this.handleMouseDown }
					onClick={ this.handleRemove }>
					{ translate( 'Remove' ) }
				</Button>
			</SectionHeader>
		);
	}
}

export default localize( PostCard );
