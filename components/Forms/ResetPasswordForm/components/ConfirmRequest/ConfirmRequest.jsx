import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FormHeader from '../../../FormHeader/FormHeader';
import FormActions from '../../../../FormActions/FormActions';
import Form from '../../../../Form/Form';
import Link from '../../../../Link/Link';

const ConfirmRequest = ( { title, onSubmit, loading, error, verb } ) => (
	<Fragment>
		<FormHeader
			title={title}
			description={<Fragment>If you have signed up with this email address, you will receive an email with instructions on how to {verb} your password. If you don’t get a response in the next few minutes, you may be using a different address than the one you used to sign up. Contact us at <Link to="mailto:support@qz.com">support@qz.com</Link> and we’ll help you out.</Fragment>}
		/>
		<Form onSubmit={onSubmit}>
			<FormActions
				submitText="Resend email"
				loading={loading}
				error={error}
			/>
		</Form>
	</Fragment>
);

ConfirmRequest.propTypes = {
	error: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	title: PropTypes.string,
	verb: PropTypes.string,
};

ConfirmRequest.defaultProps = {
	verb: 'reset',
};

export default ConfirmRequest;
