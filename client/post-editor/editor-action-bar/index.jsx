/**
 * External dependencies
 */
import React, { Component } from 'react';
import Gridicon from 'gridicons';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import AsyncLoad from 'components/async-load';
import EditorSticky from 'post-editor/editor-sticky';
import utils from 'lib/posts/utils';
import Tooltip from 'components/tooltip';
import Button from 'components/button';
import PostFormat from 'components/post-format';
import EditorActionBarViewLabel from './view-label';
import EditorStatusLabel from 'post-editor/editor-status-label';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getEditorPostId } from 'state/ui/editor/selectors';
import { getEditedPost } from 'state/posts/selectors';

class EditorActionBar extends Component {

	static propTypes = {
		isNew: React.PropTypes.bool,
		onPrivatePublish: React.PropTypes.func,
		post: React.PropTypes.object,
		savedPost: React.PropTypes.object,
		site: React.PropTypes.object,
		type: React.PropTypes.string,
		isPostPrivate: React.PropTypes.bool,
		postAuthor: React.PropTypes.object,
	};

	state = {
		viewLinkTooltip: false
	};

	render() {
		// We store privacy changes via Flux while we store password changes via Redux.
		// This results in checking Flux for some items and Redux for others to correctly
		// update based on post changes. Flux changes are passed down from parent components.
		const multiUserSite = this.props.site && ! this.props.site.single_user_site;
		const isPasswordProtected = utils.getVisibility( this.props.post ) === 'password';
		const { isPostPrivate, post, postAuthor } = this.props;
		const postFormat = post && post.format;

		return (
			<div className="editor-action-bar">
				<div className="editor-action-bar__cell is-left">
					<EditorStatusLabel
						post={ this.props.savedPost }
						advancedStatus
						type={ this.props.type }
					/>
				</div>
				<div className="editor-action-bar__cell is-center">
					{ multiUserSite &&
						<AsyncLoad
							require="post-editor/editor-author"
							post={ this.props.post }
							isNew={ this.props.isNew }
							postAuthor={ postAuthor }
						/>
					}
				</div>
				<div className="editor-action-bar__cell is-right">
					{ this.props.post && this.props.type === 'post' &&
						! isPasswordProtected && ! isPostPrivate &&
						<EditorSticky />
					}
					<PostFormat format={ postFormat } size={ 26 } />
					{ utils.isPublished( this.props.savedPost ) && (
						<Button
							href={ this.props.savedPost.URL }
							target="_blank"
							rel="noopener noreferrer"
							onMouseEnter={ () => this.setState( { viewLinkTooltip: true } ) }
							onMouseLeave={ () => this.setState( { viewLinkTooltip: false } ) }
							ref="viewLink"
							borderless
						>
							<Gridicon icon="external" />
							<Tooltip
								className="editor-action-bar__view-post-tooltip"
								context={ this.refs && this.refs.viewLink }
								isVisible={ this.state.viewLinkTooltip }
								position="bottom left"
							>
								<EditorActionBarViewLabel />
							</Tooltip>
						</Button>
					) }
				</div>
			</div>
		);
	}
}

export default connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );
		const postId = getEditorPostId( state );
		const post = getEditedPost( state, siteId, postId );

		return {
			siteId,
			postId,
			post
		};
	},
)( EditorActionBar );
