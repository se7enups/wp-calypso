/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';

const WizardActions = ( {
	onNext,
	onSkip,
	translate,
	nextButtonText = translate( 'Next' ),
	skipButtonText = translate( 'Skip' ),
} ) => {
	return (
		<div>
			<Button primary
				className="wizard__action"
				onClick={ onNext }>
				{ nextButtonText }
			</Button>
			<Button
				className="wizard__action"
				onClick={ onSkip }>
				{ skipButtonText }
			</Button>
		</div>
	);
};

WizardActions.propTypes = {
	nextButtonText: PropTypes.string,
	onNext: PropTypes.func,
	onSkip: PropTypes.func,
	skipButtonText: PropTypes.string,
	translate: PropTypes.func,
};

export default localize( WizardActions );
