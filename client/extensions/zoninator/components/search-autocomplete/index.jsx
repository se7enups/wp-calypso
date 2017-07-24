/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Search from 'components/search';
import Suggestions from './suggestions';

class SearchAutocomplete extends Component {
	static propTypes = {
		onSelect: PropTypes.func.isRequired,
		ignored: PropTypes.array,
	}

	static defaultProps = {
		ignored: [],
	}

	state = {
		search: '',
	}

	handleSearch = ( term ) => {
		if ( this.state.search === term ) {
			return;
		}

		this.setState( () => ( {
			search: term || '',
		} ) );
	}

	registerSuggestions = ( suggestions ) => {
		this.suggestions = suggestions ? suggestions.getWrappedInstance() : null;
	}

	handleKeyDown = ( event ) => {
		this.suggestions.handleKeyEvent( event );
	}

	select = ( item ) => {
		this.cancelSearch();

		this.props.onSelect( item );
	}

	cancelSearch = () => {
		this.handleSearch( '' );
	}

	render() {
		const { ignored, translate } = this.props;

		return (
			<div className="search-autocomplete">
				<Card className="search-autocomplete__card">
					{ this.props.children }

					<Search
						pinned
						fitsContainer
						delaySearch
						onSearch={ this.handleSearch }
						onSearchClose={ this.cancelSearch }
						onKeyDown={ this.handleKeyDown }
						placeholder={ translate( 'Search for content' ) } />
					<Suggestions
						ref={ this.registerSuggestions }
						searchTerm={ this.state.search }
						ignored={ ignored }
						suggest={ this.select } />
				</Card>
			</div>
		);
	}
}

export default localize( SearchAutocomplete );
