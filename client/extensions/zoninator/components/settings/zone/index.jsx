/**
 * External dependencies
 */
import React, { Component } from 'react';
import page from 'page';
import { localize } from 'i18n-calypso';
import { flowRight } from 'lodash';
import { FieldArray, FormSection, reduxForm } from 'redux-form';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import FormButton from 'components/forms/form-button';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormTextarea from 'components/forms/form-textarea';
import HeaderCake from 'components/header-cake';
import RecentPostsDropdown from './recent-posts-dropdown';
// import ReduxFormTextarea from 'components/redux-forms/redux-form-textarea';
import ReduxFormTextInput from 'components/redux-forms/redux-form-text-input';
import SearchAutocomplete from './../../search-autocomplete';
import SectionHeader from 'components/section-header';
import SortableList from 'components/forms/sortable-list';

const form = 'editZone';

class Zone extends Component {

	addPost = ( { push } ) => {
		return ( post ) => push( post );
	}

	removePost = ( { remove } ) => {
		return ( idx ) => remove( idx );
	}

	changePostOrder = ( { move } ) => {
		return ( order ) => {
			let from = 0;

			while ( order[ from ] < order.length - 1 && order[ from ] < order[ from + 1 ] ) {
				from++;
			}

			let to = from + 1;

			while ( to < order.length && order[ to ] > order[ to - 1 ] ) {
				to++;
			}

			move( from, to );
		};
	}

	handleGoBack = () => {
		page( `/extensions/zoninator/${ this.props.siteSlug }` );
	}

	handleMouseDown = ( event ) => {
		event.stopPropagation();
		event.preventDefault();
	}

	onFormSubmit = ( event ) => {
		event.preventDefault();
	}

	renderPosts = ( { fields } ) => {
		const { translate } = this.props;
		const posts = fields.getAll() || [];
		const showPosts = posts.length > 0;

		const renderPost = ( { title, slug }, idx ) => (
			<SectionHeader key={ slug } label={ title } className="zone__list-item">
				<Button compact>{ translate( 'View' ) }</Button>
				<Button compact>{ translate( 'Edit' ) }</Button>
				<Button
					compact
					scary
					onMouseDown={ this.handleMouseDown }
					onClick={ this.removePost( fields ).bind( this, idx ) }>
					{ translate( 'Remove' ) }
				</Button>
			</SectionHeader>
		);

		return (
			<div>
				<FormFieldset>
					<FormLabel>
						{ translate( 'Add content' ) }
					</FormLabel>
					<FormSettingExplanation className="zone__setting-explanation">
						{ translate(
							'Add content to the zone by using search or by selecting it from the recent posts list below.'
						) }
					</FormSettingExplanation>
					<SearchAutocomplete onSelect={ this.addPost( fields ) } ignored={ posts }>
						<RecentPostsDropdown onSelect={ this.addPost( fields ) } ignored={ posts } />
					</SearchAutocomplete>
				</FormFieldset>

				{
					showPosts && <FormFieldset>
						<FormLabel>
							{ translate( 'Manage content' ) }
						</FormLabel>
						<FormSettingExplanation className="zone__setting-explanation">
						{ translate(
							'You can reorder the zone\'s conent by dragging it to a different location on the list.'
						) }
						</FormSettingExplanation>
						<SortableList direction="vertical" onChange={ this.changePostOrder( fields ) }>
							{ posts.map( renderPost ) }
						</SortableList>
					</FormFieldset>
				}
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<div>
				<HeaderCake onClick={ this.handleGoBack }>
					{ translate( 'Edit zone' ) }
				</HeaderCake>

				<form onSubmit={ this.onFormSubmit }>
					<FormSection name="details">
						<SectionHeader label={ translate( 'Zone details' ) }>
							<FormButton compact />
						</SectionHeader>
						<Card>
							<FormFieldset>
								<FormLabel htmlFor="zoneName">{ translate( 'Zone name' ) }</FormLabel>
								<ReduxFormTextInput name="zoneName" />
							</FormFieldset>

							<FormFieldset>
								<FormLabel htmlFor="zoneDescription">{ translate( 'Zone description' ) }</FormLabel>
								<FormTextarea name="zoneDescription" />
							</FormFieldset>
						</Card>
					</FormSection>

					<FormSection name="content">
						<SectionHeader label={ translate( 'Zone content' ) }>
							<FormButton compact />
						</SectionHeader>
						<Card>
							<FieldArray name="posts" component={ this.renderPosts } />
						</Card>
					</FormSection>
				</form>

				<SectionHeader label={ translate( 'Delete zone' ) }>
					<Button primary compact scary>{ translate( 'Delete' ) }</Button>
				</SectionHeader>
			</div>
		);
	}
}

const createReduxForm = reduxForm( {
	enableReinitialize: true,
	form: form,
	getFormState: state => state.extensions.zoninator.form,
} );

export default flowRight(
	localize,
	createReduxForm,
)( Zone );
