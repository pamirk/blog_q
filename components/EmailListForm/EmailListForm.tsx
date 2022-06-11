import React, { Fragment, useEffect, useState } from 'react';
import compose from 'helpers/compose';
import EmailListSignup from 'components/EmailListSignup/EmailListSignup';
import PageSection from 'components/Page/PageSection/PageSection';
import EmailListFooter from 'components/EmailListFooter/EmailListFooter';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';
import StickyFooter from 'components/StickyFooter/StickyFooter';
import handleSignup from 'components/EmailSignup/handleSignup';
import MoreEmailsSignup from './MoreEmailsSignup';
import { withFormState } from 'helpers/wrappers';
import { viewNewsletterList, submitNewsletterModule } from 'helpers/tracking/actions';
import EmailFeed from 'components/EmailFeed/EmailFeed';
import { loadScriptOnce } from 'helpers/utils';
import useUserRegistration from 'helpers/hooks/useUserRegistration';
import useTracking from 'helpers/hooks/useTracking';
import { useClientSideUserData } from 'helpers/hooks';
import { ButtonLabel, Hed } from '@quartz/interface';
import styles from './EmailListForm.module.scss';
import segmentTrackEmailSubscribed from 'helpers/tracking/segment/trackEmailSubscribed';
import { EmailListSlug } from 'config/emails';
import { SUBSCRIBE_PAYMENT_STEP } from 'config/membership';

interface GrowsurfWindow extends Window {
	growsurf?: any;
}

function EmailListForm ( props: {
	email?: {
		emailId: number,
	},
	list: {
		slug: string,
	},
	handleFieldChange(): void,
	isMember: boolean,
	formState: {
		canSubmit: boolean,
		field: {
			error: string,
			// Must be an array of valid email list slugs as defined in
			// config/emails#emailList
			value: EmailListSlug[],
		},
		loading: boolean,
		onError( string?: string ): void,
		onSubmit(): void,
		onSuccess(): void,
		submitted: boolean,
		succeeded: boolean,
	},
} ) {
	const [ listSubscribed, setListSubscribed ] = useState<boolean>( false );
	const [ emailAddress, setEmailAddress ] = useState<string>( '' );

	const {
		email,
		list,
		list: { slug },
		handleFieldChange,
		formState,
	} = props;

	const { registerUser } = useUserRegistration();
	const trackViewList = useTracking( viewNewsletterList, { eventLabel: 'Our other emails' } );
	const trackMoreEmailsSubmit = useTracking( submitNewsletterModule, { listSlugs: formState?.field.value, location: 'more-emails' } );
	const { isMember } = useClientSideUserData();

	function scrollToTop() {
		if ( window.pageYOffset ) {
			window.scroll( 0, 0 );
		}
	}

	useEffect( () => {
		loadScriptOnce( 'https://growsurf.com/growsurf.js?v=2.0.0', { 'grsf-campaign': 'pueh05' } );
	}, [] );

	useEffect( () => {
		setListSubscribed( false ) ;
	}, [ slug ] );

	function handleMoreEmailsSuccess() {
		formState.onSuccess();
		scrollToTop();

		// GA
		trackMoreEmailsSubmit();
		// Segment
		segmentTrackEmailSubscribed( {
			conversionFlow: 'Multi List Page',
			siteLocation: 'more-emails',
			subscribedToEmails: formState?.field.value,
		} );
	}

	function handleMoreEmailsSubmit() {
		const { loading, onError, onSubmit, canSubmit, field: { error } } = formState;

		if ( !canSubmit ) {
			return onError( error || 'Please select an email above or click "No thanks"' );
		}

		if ( loading ) {
			return null;
		}

		onSubmit();

		handleSignup( {
			data: { emailAddress, slugs: formState.field.value },
			isLoggedIn: false,
			onSuccess: handleMoreEmailsSuccess,
			onError,
			registerUser,
		} );

		return;
	}

	// Because EmailSignup is a standalone component,
	// it controls itself and reports back with the value.
	function onListSignupSuccess( { email } ) {
		// Because the email checkbox list is shown after the user signs up for the initial email
		// at the top of the page we want to fire this event here when we set listSubscribed to true
		trackViewList();

		setEmailAddress( email );
		setListSubscribed( true );

		// check for GrowSurf referral;
		if ( ( window as GrowsurfWindow )?.growsurf?.getReferrerId() ) {
			( window as GrowsurfWindow )?.growsurf?.triggerReferral( email );
		}

		scrollToTop();
	}

	const moreEmailsSubmitted = formState.succeeded;

	const primaryTitle = listSubscribed ? 'Our other emails' : 'More emails';
	const primarySubtitle = listSubscribed ? '🎉 You’re signed up. Want more Quartz in your inbox?' : null;

	const stageOne = !listSubscribed;
	const stageTwo = listSubscribed && !moreEmailsSubmitted;
	const stageThree = moreEmailsSubmitted;

	// Currently no plans to use email feeds on email lists other than Obsession and Quartz Japan
	const isFeedEmail = [ 'quartz-japan', 'quartz-obsession' ].includes( slug );
	const isOlympics = 'olympics' === slug; // used to offer Olympics subscribers a specific email code, temporary

	return (
		<div className={styles.container}>
			{stageOne &&
				<PageSection background="alt" hideTopPadding>
					<EmailListSignup
						{...list}
						emailId={email?.emailId}
						emailAddress={emailAddress}
						onSignupConfirmed={onListSignupSuccess}
						hideSignup={'quartz-japan' === list.slug}
					/>
				</PageSection>
			}
			{stageOne && isFeedEmail &&
				<EmailFeed slug={list.slug} />
			}
			{( stageOne && !isFeedEmail || stageTwo ) && // Don't show MoreEmailsSignup on stage one if this is the Obsession email list
				<MoreEmailsSignup
					firstOnPage={stageTwo}
					primaryTitle={primaryTitle}
					primarySubtitle={primarySubtitle}
					excludeSlug={list.slug}
					handleFieldChange={handleFieldChange}
					showErrors={formState.submitted}
					fieldState={formState.field}
				/>
			}
			{stageThree &&
				<Fragment>
					<PageSection background="alt" hideBottomPadding>
						<div className={styles.confirmation}>
							<PageSectionHeader
								title="You’re all set."
							/>
							<main className={styles.confirmationMessage}>
								{isMember ?
									<p>Our best wishes on a productive day.</p> :
									<>
										<Hed size="medium">{`Since you’re here, take ${isOlympics ? '40%' : '20%'} off Quartz Membership${isOlympics ? ' with code QUARTZGOLD' : ''}.`}</Hed>
										<p>Membership gets you unlimited access to our business journalism with a global perspective.</p>
										{isOlympics ?
											<a href={`https://qz.com${SUBSCRIBE_PAYMENT_STEP}?code=QUARTZGOLD`}>
												<ButtonLabel>Let’s do it 👍</ButtonLabel>
											</a>
											:
											<a href={`https://qz.com${SUBSCRIBE_PAYMENT_STEP}?code=QZTWENTY`}>
												<ButtonLabel>Let’s do it 👍</ButtonLabel>
											</a>
										}
									</>
								}
							</main>
						</div>
					</PageSection>
				</Fragment>
			}
			{stageTwo && (
				<StickyFooter>
					{stageTwo && (
						<EmailListFooter
							canSubmit={formState.canSubmit}
							error={formState.field.error}
							showError={formState.submitted}
							handleCancel={handleMoreEmailsSuccess}
							handleSubmit={handleMoreEmailsSubmit}
						/>
					)}
				</StickyFooter>
			)}
		</div>
	);
}

const withMoreEmailsFormState = compose(
	withFormState( {
		field: {
			value: [],
		},
	} )
);

export default compose(
	withMoreEmailsFormState
)( EmailListForm );
