/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import Gridicon from 'gridicons';
import classNames from 'classnames';

const FieldError = ( { text, type = 'input-validation' } ) => {
	return (
		<div className={ classNames(
			'field-error',
			`field-error__${ type }`
		) }>
			<Gridicon size={ 24 } icon="notice-outline" /> <span>{ text }</span>
		</div>
	);
};

FieldError.propTypes = {
	text: PropTypes.string,
	type: PropTypes.string,
};

export default FieldError;
