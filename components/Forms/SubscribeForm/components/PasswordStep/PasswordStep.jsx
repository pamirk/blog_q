import React from 'react';
import PropTypes from 'prop-types';
import FormHeader from '../../../../../components/Forms/FormHeader/FormHeader';
import AccountPasswordForm from '../../../../../components/Forms/AccountPasswordForm/AccountPasswordForm';
import Image from '../../../../../components/Image/Image';
import styles from './PasswordStep.module.scss';

function PasswordStep( {
	description,
	imageUrl,
	title,
	submitText,
	trackingData,
} ) {
	return (
		<div className={styles.container}>
			{imageUrl &&
					<div className={styles.memeContainer}>
						<Image
							alt="GIF of Seinfield characters rejoicing"
							className={styles.meme}
							src={imageUrl}
							height={250}
							width={333}
						/>
					</div>
			}

			<FormHeader title={title} description={description}/>

			<AccountPasswordForm
				submitText={submitText}
				trackingData={trackingData}
			/>
		</div>
	);
}

PasswordStep.propTypes = {
	description: PropTypes.string,
	imageUrl: PropTypes.string,
	submitText: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	trackingData: PropTypes.object.isRequired,
};

PasswordStep.defaultProps = {
	submitText: 'Next',
};

export default PasswordStep;
