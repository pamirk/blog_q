import React from 'react';
import compose from '../../../../../helpers/compose';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { withVisibilityTracking } from '../../../../../helpers/wrappers';
import { trackFormView as onMount } from '../../../../../helpers/tracking/actions';
import FormHeader from '../../../../../components/Forms/FormHeader/FormHeader';
import styles from '../../../Forms.module.scss';
import { ButtonLabel } from '../../../../../@quartz/interface';
import Link from '../../../../../components/Link/Link';

const cx = classnames.bind( styles );

const JapanConfirmationStep = ( {
	primaryCTALink,
	primaryCTAText,
	secondaryCTALink,
	secondaryCTAText,
	title,
} ) => (
	<div className={cx( 'confirmation-step-container' )}>
		<FormHeader title={title} />
		<Link to={primaryCTALink}>
			<ButtonLabel>{primaryCTAText}</ButtonLabel>
		</Link>
		<div className={cx( 'secondary-button-container' )}>
			<Link to={secondaryCTALink}>
				<ButtonLabel variant="secondary">{secondaryCTAText}</ButtonLabel>
			</Link>
		</div>
	</div>
);

JapanConfirmationStep.propTypes = {
	primaryCTALink: PropTypes.string.isRequired,
	primaryCTAText: PropTypes.string.isRequired,
	secondaryCTALink: PropTypes.string.isRequired,
	secondaryCTAText: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export default compose(
	withVisibilityTracking( { onMount } )
)( JapanConfirmationStep );
