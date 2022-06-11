// noinspection JSIgnoredPromiseFromCall

import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import FormWithValidation from '../../../components/FormWithValidation/FormWithValidation';
import FormHeader from '../../../components/Forms/FormHeader/FormHeader';
import styles from './MagicLinkForm.module.scss';
import { EmailInput } from '../../../components/Input/Input';
import { Button } from '../../../@quartz/interface';
import useMagicLinkRequest from '../../../helpers/hooks/useMagicLinkRequest';
import useNotifications from '../../../helpers/hooks/useNotifications';
import { SUBSCRIBE_EMAIL_STEP } from '../../../config/membership';

const cx = classnames.bind( styles );

function MagicLinkForm ( { initialEmail, from } ) {
	const { loading, error, requestMagicLink } = useMagicLinkRequest();
	const { notifyError } = useNotifications();

	// A weird marriage of form approaches here: the form is uncontrolled,
	// but we need to remember the email after the form (and thus the ref)
	// is removed from the DOM.
	const emailRef = useRef();
	const [ email, setEmail ] = useState();

	const requestData = {};

	if ( [ SUBSCRIBE_EMAIL_STEP, '/become-a-member/' ].includes( from ) ) {
		requestData.redirectTo = 'subscribe';
	}

	function onSubmit() {
		// noinspection JSUnresolvedVariable
		const enteredEmail = emailRef.current.value;

		requestMagicLink( { email: enteredEmail, ...requestData } )
			.then( () => setEmail( enteredEmail ) )
			.catch( () => notifyError( 'An error occurred and we couldn’t generate your link.' ) );
	}

	function resendMagicLink() {
		requestMagicLink( { email, ...requestData } );
	}

	if ( email ) {
		return (
			<Fragment>
				<FormHeader
					title="We’ve sent you a login link via email"
					description="Please click that link to continue. If you don’t get a response in the next few minutes make sure to check your spam folder."
				/>
				<div className={cx( 'form-container' )}>
					<Button
						onClick={resendMagicLink}
						loading={loading}
					>
						Resend email
					</Button>
				</div>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<FormHeader
				title="Email yourself a login link"
			/>
			<div className={cx( 'form-container' )}>
				<FormWithValidation
					error={error}
					loading={loading}
					submitText="Send link"
					onSubmit={onSubmit}
				>
					<div className={cx( 'field-container' )}>
						<EmailInput
							id="change-email"
							label="Email"
							placeholder="e.g. example@qz.com"
							inputRef={emailRef}
							defaultValue={initialEmail}
						/>
					</div>
				</FormWithValidation>
			</div>
		</Fragment>
	);
}

MagicLinkForm.propTypes = {
	from: PropTypes.string,
	initialEmail: PropTypes.string,
};

export default MagicLinkForm;
