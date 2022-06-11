import React from 'react';
import AccountEmailForm, { SubscribeFormTrackingData } from 'components/AccountEmailForm/AccountEmailForm';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import SignupHints from 'components/SignupHints/SignupHints';
import Link from 'components/Link/Link';
import NewPerks from 'components/NewPerks/NewPerks';
import Testimonials from 'components/Testimonials/Testimonials';

import styles from './EmailStep.module.scss';

function AccountEmailSignup ( props: {
	submitText?: string,
	trackingData: SubscribeFormTrackingData,
} ) {
	return (
		<AccountEmailForm
			emailLabel="Enter your email"
			submitText={props.submitText || 'Next'}
			trackingData={props.trackingData}
			source="subscribe"
		>
			<p className={styles.disclaimer}>
				By providing your email, you agree to the <Link to="/about/privacy-policy/">Quartz Privacy Policy</Link>. We’ll use your email to provide complimentary access to the <Link to="/emails/daily-brief/">Quartz Daily Brief</Link> along with other updates and promotions. This site is protected by reCAPTCHA and the Google <Link to="https://policies.google.com/privacy">Privacy Policy</Link> and <Link to="https://policies.google.com/terms">Terms of Service</Link> apply.
			</p>
		</AccountEmailForm>
	);
}

function EmailStep ( props: {
	description: string,
	submitText?: string,
	title: string,
	trackingData: SubscribeFormTrackingData,
} ): React.ReactNode {
	return (
		<div className={styles.container}>
			<FormHeader title={props.title} description={props.description} />

			<div className={styles.topFormContainer}>
				<AccountEmailSignup submitText={props.submitText} trackingData={props.trackingData} />
			</div>

			<div className={styles.perksContainer}>
				<p className={styles.perkLabel}>Membership unlocks:</p>
				<NewPerks length="short" />
			</div>

			<div className={styles.testimonialContainer}>
				<Testimonials />
			</div>

			<div className={styles.hints}>
				<SignupHints
					align="center"
					showLogin={true}
					showQuartzJapanLink
				/>
			</div>
		</div>
	);
}

export default EmailStep;
