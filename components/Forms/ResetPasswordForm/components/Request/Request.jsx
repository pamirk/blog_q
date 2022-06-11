import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../Forms.module.scss';
import classnames from 'classnames/bind';
import { EmailField } from '../../../../Input/Input';
import FormActions from '../../../../FormActions/FormActions';
import Form from '../../../../Form/Form';
import FormHeader from '../../../FormHeader/FormHeader';

const cx = classnames.bind( styles );

const Request = ( { loading, error, handleFieldChange, inactive, formState, title, verb, onSubmit } ) => (
	<Fragment>
		<FormHeader
			title={title}
			description={`Please enter your email address below. If we find an account registered with that email address, we will send you an email containing a link to ${verb} your password.`}
		/>
		<Form onSubmit={onSubmit}>
			<fieldset className={cx( 'field-group' )}>
				<div className={cx( 'field' )}>
					<EmailField
						id="password-reset-request"
						fieldName="email"
						placeholder="Enter your email address"
						handleFieldChange={handleFieldChange}
						fieldState={formState.email}
					/>
				</div>
			</fieldset>
			<FormActions
				submitText="Send email"
				loading={loading}
				inactive={inactive}
				error={error}
			/>
		</Form>
	</Fragment>
);

Request.propTypes = {
	error: PropTypes.string,
	formState: PropTypes.shape( {
		email: PropTypes.object.isRequired,
	} ).isRequired,
	handleFieldChange: PropTypes.func.isRequired,
	inactive: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	verb: PropTypes.string,
};

Request.defaultProps = {
	verb: 'reset',
};

export default Request;
