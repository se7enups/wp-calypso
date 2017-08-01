/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { find, flowRight } from 'lodash';

/**
 * Internal dependencies
 */
import QueryPosts from 'components/data/query-posts';
import { getSitePostsForQuery } from 'state/posts/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

const recentPostsQuery = {
	status: 'publish,future',
	number: 10,
};

const RecentPostsDropdown = ( {
	siteId,
	recentPosts,
	ignored,
	onSelect,
	translate,
} ) => {
	const handleChange = event => {
		const slug = event.target.value;

		onSelect( find( recentPosts, { slug } ) );
	};

	const posts = ( recentPosts || [] ).filter( ( { slug } ) => ! find( ignored, { slug } ) );
	const selectClass = 'is-compact';

	return (
		<div>
			<QueryPosts siteId={ siteId } query={ recentPostsQuery } />
			<select className={ selectClass } onChange={ handleChange } defaultValue="recent">
				<option value="recent">{ translate( 'Recent posts' ) }</option>
				{ posts.length > 0 && posts.map( post => (
					<option key={ post.slug } value={ post.slug }>{ post.title }</option>
				)	) }
			</select>
		</div>
	);
};

RecentPostsDropdown.PropTypes = {
	onSelect: PropTypes.function,
	recentPosts: PropTypes.array,
	ignored: PropTypes.array,
};

RecentPostsDropdown.defaultProps = {
	recentPosts: [],
	ignored: [],
};

const connectComponent = connect( state => {
	const siteId = getSelectedSiteId( state );

	return {
		siteId: siteId,
		recentPosts: getSitePostsForQuery( state, siteId, recentPostsQuery ),
	};
} );

export default flowRight(
	connectComponent,
	localize,
)( RecentPostsDropdown );
