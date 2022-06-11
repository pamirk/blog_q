import React from 'react';
import PropTypes from 'prop-types';
import FormHeader from '../../../../../components/Forms/FormHeader/FormHeader';
import FormActions from '../../../../../components/FormActions/FormActions';
import Form from '../../../../../components/Form/Form';
import { CommonProfileFields } from '../../../../../components/Forms/ProfileForm/ProfileForm';
import styles from '../../../Forms.module.scss';

const ProfileStep = ( {
	description,
	formError,
	formLoading,
	formState,
	handleFieldChange,
	handleSubmit,
	submitText,
	title,
	trackingData,
} ) => (
	<Form
		onSubmit={handleSubmit}
		trackingData={trackingData}
	>
		<FormHeader
			description={description}
			title={title}
		/>
		<fieldset className={styles.fieldGroup}>
			<CommonProfileFields
				formState={formState}
				handleFieldChange={handleFieldChange}
			/>
		</fieldset>
		<div className={styles.field}>
			<FormActions
				error={formError}
				disabled={!!formError}
				loading={formLoading}
				submitText={submitText}
			/>
		</div>
	</Form>
);

ProfileStep.propTypes = {
	description: PropTypes.string.isRequired,
	formError: PropTypes.string,
	formLoading: PropTypes.bool.isRequired,
	formState: PropTypes.object.isRequired,
	handleFieldChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	submitText: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	trackingData: PropTypes.object.isRequired,
};

ProfileStep.defaultProps = {
	submitText: 'Next',
	formLoading: false,
	formState: {},
};

export default ProfileStep;
