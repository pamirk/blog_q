import React from 'react';
import PropTypes from 'prop-types';
import compose from '../../helpers/compose';
import useCaptchaSetup from '../../helpers/hooks/useCaptchaSetup';
import { trackFormSubmit as onSubmit, trackFormView as onMount } from '../../helpers/tracking/actions';
import { withTracking, withVisibilityTracking } from '../../helpers/wrappers';
import styles from './Form.module.scss';

const CAPTCHA_BUTTON_ID = 'captcha_button';

const Form = ( { children, layout, onSubmit: originalOnSubmit, setRef, useCaptcha, id } ) => {
	const onSubmit = useCaptchaSetup( useCaptcha, originalOnSubmit, id );

	return (
		<form
			className={styles[ layout ]}
			onSubmit={onSubmit}
			ref={setRef}
		>
			{children}
			{
				useCaptcha && <div id={id} />
			}
		</form>
	);
};

Form.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string,
	layout: PropTypes.oneOf( [ 'block', 'inline' ] ).isRequired,
	onSubmit: PropTypes.func.isRequired,
	setRef: PropTypes.func.isRequired,
	useCaptcha: PropTypes.bool.isRequired,
};

Form.defaultProps = {
	id: CAPTCHA_BUTTON_ID,
	layout: 'block',
	onSubmit: () => {},
	setRef: () => {},
	useCaptcha: false,
};

export default compose(
	withTracking( { onSubmit } ),
	withVisibilityTracking( { onMount } )
)( Form );
