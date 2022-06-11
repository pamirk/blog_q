import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../Forms.module.scss';
import classnames from 'classnames/bind';
import { PasswordField } from '../../../../Input/Input';
import FormActions from '../../../../FormActions/FormActions';
import { PASSWORD_LENGTH_ERROR } from '../../../../../helpers/user';
import FormHeader from '../../../FormHeader/FormHeader';
import Form from '../../../../Form/Form';

const cx = classnames.bind( styles );

const Reset = ( { loading, error, handleFieldChange, inactive, formState, submitText, onSubmit } ) => (
	<Fragment>
		<FormHeader
			title="Reset password"
			description="Please enter in your new password below."
		/>
		<Form onSubmit={onSubmit}>
			<fieldset className={cx( 'field-group' )}>
				<div className={cx( 'field' )}>
					<PasswordField
						id="password-reset-new"
						fieldName="password"
						handleFieldChange={handleFieldChange}
						fieldState={formState.password}
						hint={PASSWORD_LENGTH_ERROR}
						autoComplete="new-password"
					/>
				</div>
				<div className={cx( 'field' )}>
					<PasswordField
						id="password-reset-confirm"
						fieldName="passwordConfirmation"
						placeholder="Enter your password again"
						handleFieldChange={handleFieldChange}
						fieldState={formState.passwordConfirmation}
						autoComplete="new-password"
					/>
				</div>
			</fieldset>
			<FormActions
				submitText={submitText}
				loading={loading}
				inactive={inactive}
				error={error}
			/>
		</Form>
	</Fragment>
);

Reset.propTypes = {
	error: PropTypes.string,
	formState: PropTypes.shape( {
		password: PropTypes.object.isRequired,
		passwordConfirmation: PropTypes.object.isRequired,
	} ),
	handleFieldChange: PropTypes.func.isRequired,
	inactive: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	submitText: PropTypes.string.isRequired,
};

export default Reset;
