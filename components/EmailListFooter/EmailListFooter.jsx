import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../@quartz/interface';
import styles from './EmailListFooter.module.scss';

const EmailListFooter = ( { handleSubmit, handleCancel, canSubmit, buttonText, error, showError } ) => (
	<div className={styles.container}>
		<div className={styles.buttons}>
			<Button onClick={handleSubmit} inactive={!canSubmit}>{buttonText}</Button>
			<Button onClick={handleCancel} variant="secondary">No, thanks</Button>
		</div>
		{showError && error && <div className={styles.error}>{error}</div>}
	</div>
);

EmailListFooter.propTypes = {
	buttonText: PropTypes.string,
	canSubmit: PropTypes.bool,
	error: PropTypes.string,
	handleCancel: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	showError: PropTypes.bool,
};

EmailListFooter.defaultProps = {
	canSubmit: false,
	buttonText: 'Sign me up',
};

export default EmailListFooter;
