/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import WizardActions from 'components/wizard/wizard-actions';
import WizardProgress from 'components/wizard/wizard-progress';

class Wizard extends Component {
	state = { currentStep: 0 }

	goToNextStep = () => {
		const { currentStep } = this.state;

		if ( currentStep >= this.props.steps.length - 1 ) {
			return;
		}

		this.setState( { currentStep: currentStep + 1 } );
	}

	skip = () => this.goToNextStep();

	render() {
		const {
			nextButtonText,
			skipButtonText,
			steps,
		} = this.props;
		const { currentStep } = this.state;
		const step = steps[ currentStep ] ? steps[ currentStep ] : {};
		const { component, showNavigation = true } = step;

		return (
			<div className="wizard">
				<WizardProgress
					currentStep={ currentStep }
					steps={ steps } />

				{ React.cloneElement( component ) }

				{ showNavigation &&
					<WizardActions
						nextButtonText={ nextButtonText }
						onNext={ this.goToNextStep }
						onSkip={ this.skip }
						skipButtonText={ skipButtonText } />
				}
			</div>
		);
	}
}

Wizard.propTypes = {
	nextButtonText: PropTypes.string,
	skipButtonText: PropTypes.string,
	steps: PropTypes.arrayOf( PropTypes.shape( {
		component: PropTypes.element.isRequired,
		name: PropTypes.string.isRequired,
		showNavigation: PropTypes.bool,
	} ) ).isRequired,
};

export default Wizard;
