import React, { Fragment, useState } from 'react';
import compose from 'helpers/compose';
import styles from './EmailsForm.module.scss';
import PageSection from 'components/Page/PageSection/PageSection';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import EmailsSection from 'components/EmailsSection/EmailsSection';
import { ButtonLabel, PageHeader } from '@quartz/interface';
import EmailsFooter from 'components/EmailsFooter/EmailsFooter';
import { viewNewsletterList } from 'helpers/tracking/actions';
import { withVisibilityTracking } from 'helpers/wrappers';
import Link from 'components/Link/Link';
import { useClientSideUserData } from 'helpers/hooks';
import { SUBSCRIBE_EMAIL_STEP } from 'config/membership';

function EmailsForm () {
	const [ slugs, setSlugs ] = useState<string[]>( [] );
	const [ showConfirmation, setShowConfirmation ] = useState<boolean>( false );
	const [ touched, setTouched ] = useState<boolean>( false );
	const [ email, setEmail ] = useState<string>( '' );

	const { isMember } = useClientSideUserData();

	const onSignupConfirmed = ( { email } ) => {
		setShowConfirmation( true );
		setEmail( email );
		setTouched( false );
	};

	const handleChange = ( slug, checked ) => {
		if ( checked && !slugs.includes( slug ) ) {
			setSlugs( [ slug, ...slugs ] );
		} else {
			setSlugs( slugs.filter( item => item !== slug ) );
		}

		setTouched( true );
		setShowConfirmation( false );
	};

	const listsChecked = !!slugs.length;
	const showSignup = listsChecked && touched;
	let text = '';
	let subtext = '';

	// No checkboxes checked; show the prompt
	if ( !listsChecked ) {
		text = 'Select the emails you’d like to receive';
	}

	// There are checkboxes checked, and the form has been touched. so this won't
	// display after form submission until the user clicks a checkbox again.
	if ( showSignup ) {
		text = 'Select more or enter your email';
	}

	if ( showConfirmation ) {
		// Don't show membership CTAs to existing members
		if ( !isMember ) {
			text = 'You’re all set. Since you’re here, take 20% off Quartz membership today.';
			subtext = 'Membership gets you unlimited access to our business journalism with a global perspective.';
		} else {
			text = 'You’re all set.';
		}
	}

	// Footer display depends on the screen size, but some views should always
	// be visible or hidden regardless of screen size
	const alwaysShowFooter = showSignup || showConfirmation;
	const alwaysHideFooter = !text;

	return (
		<Fragment>
			<PageHeader
				title="Emails"
				intro="Our emails are made to shine in your inbox, with something fresh every morning, afternoon, and weekend."
				border={false}
			/>
			<PageSection
				background={"alt"}
				hideTopPadding={true}
				hideTopBorder={true}
			>
				<EmailsSection handleChange={handleChange} />
			</PageSection>
			<EmailsFooter alwaysShow={alwaysShowFooter} alwaysHide={alwaysHideFooter}>
				{text && <div className={styles.text}>{text}</div>}
				{subtext && <div className={styles.confirmationText}>{subtext}</div>}
				{
					showConfirmation && !isMember &&
					<Link to={SUBSCRIBE_EMAIL_STEP}>
						<ButtonLabel>Let’s do it 👍</ButtonLabel>
					</Link>
				}
				{
					showSignup && !showConfirmation &&
					<div className={styles.emailSignupContainer}>
						<EmailSignup
							email={email}
							handleChange={setEmail}
							slugs={slugs}
							buttonText="Sign me up"
							hideEmailOptions
							onSignupConfirmed={onSignupConfirmed}
							location="emails-page"
						/>
					</div>
				}
			</EmailsFooter>
		</Fragment>
	);
}

export default compose(
	withVisibilityTracking( {
		onMount: () => viewNewsletterList( { eventLabel: 'Emails landing' } ), // adding event label
	} )
)( EmailsForm );
