/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { find, findIndex } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import QueryPosts from 'components/data/query-posts';
import { getSitePostsForQuery } from 'state/posts/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

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

	countSuggestions() {
		return this.props.suggestions ? this.props.suggestions.length : 0;
	}

	filterSuggestions() {
		if ( ! this.countSuggestions() ) {
			return [];
		}

		return this.props.suggestions.filter( ( { slug } ) => ! find( this.props.ignored, { slug } ) );
	}

	getSuggestionForPosition( position ) {
		return this.props.suggestions[ position ];
	}

	incPosition() {
		const position = ( this.state.suggestionPosition + 1 ) % this.countSuggestions();
		this.setState( {
			suggestionPosition: position,
			currentSuggestion: this.getSuggestionForPosition( position ),
		} );
	}

	decPosition() {
		const position = this.state.suggestionPosition - 1;
		this.setState( {
			suggestionPosition: position < 0 ? this.countSuggestions() - 1 : position,
			currentSuggestion: this.getSuggestionForPosition( position ),
		} );
	}

	handleKeyEvent = ( event ) => {
		if ( this.countSuggestions() === 0 ) {
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

	handleMouseDown = ( slug, event ) => {
		event.stopPropagation();
		event.preventDefault();

		const position = findIndex( this.props.suggestions, { slug: slug } );
		this.props.suggest( this.getSuggestionForPosition( position ) );
	}

	handleMouseOver = ( slug ) => {
		const position = findIndex( this.props.suggestions, { slug: slug } );
		this.setState( {
			suggestionPosition: position,
			currentSuggestion: this.getSuggestionForPosition( position ),
		} );
	}

	createTextWithHighlight( text, highlightedText ) {
		const re = new RegExp( '(' + highlightedText + ')', 'gi' );
		const parts = text.split( re );
		const token = parts.map( ( part, i ) => {
			const key = text + i;
			const lowercasePart = part.toLowerCase();
			if ( lowercasePart === highlightedText ) {
				return <span key={ key } className="search-autocomplete__text is-emphasized" >{ part }</span>;
			}
			return <span key={ key } className="search-autocomplete__text" >{ part }</span>;
		} );

		return token;
	}

	renderSuggestion = ( post, idx ) => {
		const className = classNames(
			'search-autocomplete__suggestion',
			{ 'has-highlight': idx === this.state.suggestionPosition }
		);

		return (
			<span
				key={ idx }
				className={ className }
				onMouseDown={ this.handleMouseDown.bind( this, post.slug ) }
				onMouseOver={ this.handleMouseOver.bind( this, post.slug ) }>
				{ this.createTextWithHighlight( post.title, this.props.searchTerm ) }
			</span>
		);
	}

	render() {
		const {
			searchTerm,
			siteId,
		} = this.props;

		if ( ! searchTerm ) {
			return null;
		}

		const showSuggestions = this.countSuggestions() > 0;

		return (
			<div>
				<QueryPosts siteId={ siteId } query={ { search: searchTerm } } />

				{
					showSuggestions &&
					<div className="search-autocomplete__suggestions">
						{ this.filterSuggestions().map( this.renderSuggestion ) }
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
