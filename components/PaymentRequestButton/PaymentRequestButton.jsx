import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './PaymentRequestButton.module.scss';
import GooglePayLogo from '../../svgs/google-pay-logo';

const cx = classnames.bind( styles );

// We localize the labels, but shouldn't localize the button itself:
// https://developers.google.com/pay/api/web/guides/brand-guidelines

const PaymentRequestButton = ( {
	label,
	onClick,
	type,
} ) => (
	<div className={cx( 'field' )}>
		<label
			htmlFor="payment-request"
			id="payment-request-label"
			className={cx( 'label' )}
		>
			{label}
		</label>
		<button
			aria-labelledby="payment-request-label"
			className={cx( 'payment-request', `${type}` )}
			onClick={onClick}
		>
			{type === 'google-pay-button' && (
				<Fragment>
					<GooglePayLogo className={cx( 'google-pay-logo' )} aria-hidden="true"/>
					Pay
				</Fragment>
			)}
		</button>
	</div>
);

PaymentRequestButton.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
};

export default PaymentRequestButton;
