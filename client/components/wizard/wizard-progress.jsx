/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

const WizardProgress = ( { currentStep, steps } ) => {
	return (
		<ul className="wizard__progress">
			{ steps.map( ( step, index ) => (
				<li className="wizard__progress-item" key={ index }>
					<span className={ classNames( 'wizard__progress-text', { 'is-selected': currentStep === index } ) }>
						{ step.name }
					</span>
				</li>
			) ) }
		</ul>
	);
};

WizardProgress.propTypes = {
	currentStep: PropTypes.number,
	steps: PropTypes.arrayOf( PropTypes.shape( {
		component: PropTypes.element.isRequired,
		name: PropTypes.string.isRequired,
	} ) ).isRequired,
};

WizardProgress.defaultProps = {
	currentStep: 0,
};

export default WizardProgress;
