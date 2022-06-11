import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { blurFields, validateField, validateFields, validateForm, getFieldErrors } from '../../../helpers/forms';
import { validateEmail, validatePassword } from '../../../helpers/user';
import { withUserApi } from '../../../helpers/wrappers';
import Request from './components/Request/Request';
import Reset from './components/Reset/Reset';
import ConfirmRequest from './components/ConfirmRequest/ConfirmRequest';
import ConfirmReset from './components/ConfirmReset/ConfirmReset';
import styles from '../Forms.module.scss';

export class ResetPasswordForm extends Component {
	constructor( props ) {
		super( props );

		this.state = { confirmed: false };
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.initialPassword === 'CURRENT_PASSWORD' && this.props.initialPassword == null ) {
			this.setState( { confirmed: true } );
		}
	}

	render() {
		const { formState, handleFieldChange, handleRequestReset, handleResend, handleResetPassword, token, initialPassword, isSettingPassword, loading, error } = this.props;
		const { confirmed } = this.state;
		const { password, passwordConfirmation } = formState;

		const verb = isSettingPassword ? 'set' : 'reset';
		const capitalizedVerb = isSettingPassword ? 'Set' : 'Reset';

		const sharedProps = {
			handleFieldChange,
			formState,
			loading,
			title: `${capitalizedVerb} password`,
			verb,
		};

		// Default state. There's no initialPassword value to indicate a reset attempt has been initiated,
		// or token to let us know it's under way.
		let step = (
			<Request
				onSubmit={handleRequestReset}
				inactive={!validateForm( [ 'email' ], formState )}
				{...sharedProps}
			/>
		);

		// Password email has been requested.
		if ( initialPassword === 'RESETTING' ) {
			step = (
				<ConfirmRequest
					onSubmit={handleResend}
					{...sharedProps}
				/>
			);
		}

		// The user clicked the link in their password reset email, and we have the token.
		if ( token ) {
			step = (
				<Reset
					formState={{ password, passwordConfirmation }}
					onSubmit={handleResetPassword}
					inactive={!validateForm( [ 'password', 'passwordConfirmation' ], formState )}
					error={error}
					submitText={capitalizedVerb}
					{...sharedProps}
				/>
			);
		}

		// The password was changed.
		if ( confirmed ) {
			step = <ConfirmReset />;
		}

		return (
			<div className={styles.container}>
				{step}
			</div>
		);
	}
}

ResetPasswordForm.propTypes = {
	error: PropTypes.string,
	/** Password is being set, not reset */
	formState: PropTypes.shape( {
		email: PropTypes.object.isRequired,
		password: PropTypes.object.isRequired,
		passwordConfirmation: PropTypes.object.isRequired,
	} ),
	/** Initial password is still in state */
	handleCancel: PropTypes.func,
	handleFieldChange: PropTypes.func.isRequired,
	handleRequestReset: PropTypes.func.isRequired,
	handleResend: PropTypes.func.isRequired,
	handleResetPassword: PropTypes.func.isRequired,
	handleSuccess: PropTypes.func.isRequired,
	initialPassword: PropTypes.string,
	isSettingPassword: PropTypes.bool,
	loading: PropTypes.bool.isRequired,
	token: PropTypes.string,
	userError: PropTypes.string,
};

class ResetPasswordWithFormState extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			formError: null,
			email: {
				value: '',
				errors: [],
				validator: validateEmail,
			},
			password: {
				value: '',
				errors: [],
				validator: validatePassword,
			},
			passwordConfirmation: {
				value: '',
				errors: [],
				validator: validatePassword,
			},
		};

		this.handleFieldChange = this.handleFieldChange.bind( this );
		this.handleRequestReset = this.handleRequestReset.bind( this );
		this.handleUserExit = this.handleUserExit.bind( this );
		this.handleSuccess = this.handleSuccess.bind( this );
		this.handleResend = this.handleResend.bind( this );
		this.handleResetPassword = this.handleResetPassword.bind( this );
	}

	componentDidMount() {
		const fieldNames = [ 'email', 'password', 'passwordConfirmation' ];
		this.setState( validateFields( fieldNames, this.state ) );
	}

	handleFieldChange( name, fieldState = {} ) {
		const oldFieldState = this.state[name];
		const newFieldState = validateField( { ...oldFieldState, ...fieldState } );

		this.setState( {
			formError: null,
			[name]: newFieldState,
		} );
	}

	handleRequestReset( event ) {
		event.preventDefault();
		const { requestResetPassword } = this.props;

		// Validate the fields in case the user hits submit without touching anything.
		const newFormState = validateFields( [ 'email' ], this.state );
		const { email } = newFormState;

		if ( email.errors?.length ) {
			this.setState( blurFields( [ 'email' ], newFormState ) );
			return;
		}

		requestResetPassword( { email: email.value } );
	}

	handleResend( event ) {
		event.preventDefault();
		const { requestResetPassword } = this.props;
		const { email: { value: emailValue } } = this.state;

		requestResetPassword( emailValue );
	}

	handleResetPassword( event ) {
		event.preventDefault();
		const { resetPassword, token } = this.props;
		const fieldNames = [ 'password', 'passwordConfirmation' ];

		// Validate the fields in case the user hits submit without touching anything.
		const newFormState = validateFields( fieldNames, this.state );
		const fieldErrors = getFieldErrors( fieldNames, newFormState );

		if ( fieldErrors?.length ) {
			this.setState( blurFields( fieldNames, newFormState ) );
			return;
		}

		const { password, passwordConfirmation } = newFormState;
		if ( password.value !== passwordConfirmation.value ) {
			this.setState( { formError: 'Passwords do not match' } );
			return;
		}

		resetPassword( { password: password.value, token } );
	}

	handleUserExit( event, location ) {
		event.preventDefault();

		const { handleCancel, history } = this.props;

		// Modal? Close it.
		if ( handleCancel ) {
			handleCancel();
			return;
		}

		// Non modal? Go to provided location.
		history.push( location );
	}

	handleSuccess( event ) {
		this.handleUserExit( event, '/' );
	}

	render() {
		const { email, password, passwordConfirmation, formError } = this.state;
		const {
			initialPassword,
			isSettingPassword,
			token,
			userError,
			pendingRequestId,
		} = this.props;

		return (
			<ResetPasswordForm
				isSettingPassword={isSettingPassword}
				error={userError || formError}
				formState={{ email, password, passwordConfirmation }}
				handleFieldChange={this.handleFieldChange}
				initialPassword={initialPassword}
				loading={!!pendingRequestId}
				handleRequestReset={this.handleRequestReset}
				handleResend={this.handleResend}
				handleResetPassword={this.handleResetPassword}
				handleSuccess={this.handleSuccess}
				token={token}
			/>
		);
	}
}

ResetPasswordWithFormState.propTypes = {
	handleCancel: PropTypes.func,
	history: PropTypes.object,
	initialPassword: PropTypes.string,
	isSettingPassword: PropTypes.bool.isRequired,
	pendingRequestId: PropTypes.string,
	requestResetPassword: PropTypes.func.isRequired,
	resetPassword: PropTypes.func.isRequired,
	token: PropTypes.string,
	userError: PropTypes.string,
};

export default withUserApi()( ResetPasswordWithFormState );
