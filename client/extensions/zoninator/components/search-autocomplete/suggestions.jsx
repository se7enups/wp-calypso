/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { find, findIndex } from 'lodash';

/**
 * Internal dependencies
 */
import QueryPosts from 'components/data/query-posts';
import { getSitePostsForQuery } from 'state/posts/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import SuggestionItem from './suggestion-item';

class Suggestions extends Component {

	static propTypes = {
		suggest: PropTypes.func.isRequired,
		searchTerm: PropTypes.string,
		suggestions: PropTypes.array,
	}

	static defaultProps = {
		suggestions: [],
		searchTerm: '',
	}

	state = {
		suggestionPosition: 0,
		currentSuggestion: null,
	}

	setInitialState( props ) {
		const suggestions = this.filterSuggestions( props.suggestions, props.ignored );

		this.setState( {
			suggestionPosition: 0,
			currentSuggestion: suggestions[ 0 ],
			suggestions,
		} );
	}

	componentWillMount() {
		this.setInitialState( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.searchTerm !== this.props.searchTerm ) {
			this.setInitialState( nextProps );
		}
	}

	filterSuggestions( suggestions, ignored ) {
		if ( ! suggestions || suggestions.length === 0 ) {
			return [];
		}

		const results = suggestions.filter( ( { slug } ) => ! find( ignored, { slug } ) );

		return results;
	}

	getSuggestionForPosition( position ) {
		return this.state.suggestions[ position ];
	}

	incPosition() {
		const position = ( this.state.suggestionPosition + 1 ) % this.state.suggestions.length;
		this.setState( {
			suggestionPosition: position,
			currentSuggestion: this.getSuggestionForPosition( position ),
		} );
	}

	decPosition() {
		const position = this.state.suggestionPosition - 1;
		this.setState( {
			suggestionPosition: position < 0 ? this.state.suggestions.length - 1 : position,
			currentSuggestion: this.getSuggestionForPosition( position ),
		} );
	}

	handleKeyEvent = ( event ) => {
		if ( this.state.suggestions.length === 0 ) {
			return false;
		}

		switch ( event.key ) {
			case 'ArrowDown':
				this.incPosition();
				event.preventDefault();
				break;

			case 'ArrowUp':
				this.decPosition();
				event.preventDefault();
				break;

			case 'Enter':
				if ( !! this.state.currentSuggestion ) {
					this.props.suggest( this.state.currentSuggestion );
					return true;
				}
				break;
		}

		return false;
	}

	handleMouseDown = ( slug ) => {
		const position = findIndex( this.state.suggestions, { slug: slug } );
		this.props.suggest( this.getSuggestionForPosition( position ) );
	}

	handleMouseOver = ( slug ) => {
		const position = findIndex( this.state.suggestions, { slug: slug } );
		this.setState( {
			suggestionPosition: position,
			currentSuggestion: this.getSuggestionForPosition( position ),
		} );
	}

	renderSuggestion = ( post, idx ) => (
		<SuggestionItem
			key={ idx }
			searchTerm={ this.props.searchTerm }
			hasHighlight={ idx === this.state.suggestionPosition }
			onMouseDown={ this.handleMouseDown }
			onMouseOver={ this.handleMouseOver }
			post={ post } />
	)

	render() {
		const {
			searchTerm,
			siteId,
		} = this.props;

		if ( ! searchTerm ) {
			return null;
		}

		return (
			<div>
				<QueryPosts siteId={ siteId } query={ { search: searchTerm } } />

				{
					this.state.currentSuggestion &&
					<div className="search-autocomplete__suggestions">
						{ this.state.suggestions.map( this.renderSuggestion ) }
					</div>
				}
			</div>
		);
	}
}

const mapStateToProps = ( state, { searchTerm } ) => {
	const siteId = getSelectedSiteId( state );

	return {
		siteId: siteId,
		suggestions: getSitePostsForQuery( state, siteId, { search: searchTerm } ),
	};
};

const connectComponent = connect( mapStateToProps, null, null, { withRef: true } );

export default connectComponent( Suggestions );
