import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import compose from '../../helpers/compose';
import styles from './EmailSignup.module.scss';
import Input from '../../components/Input/Input';
import Link from '../../components/Link/Link';
import SubscribeCTAs from '../../components/SubscribeCTAs/SubscribeCTAs';
import EmailCheckboxList from './EmailCheckboxList/EmailCheckboxList';
import { Button } from '../../@quartz/interface';
import { viewNewsletterModule, clickNewsletterModule, submitNewsletterModule } from '../../helpers/tracking/actions';
import useUserRegistration from '../../helpers/hooks/useUserRegistration';
import {
	withProps,
	withQueryParamData,
} from '../../helpers/wrappers';
import { useEmailSubmit, useClientSideUserData } from '../../helpers/hooks';
import classnames from 'classnames/bind';
import emails, { emailList, MEMBER_ONLY_EMAILS } from '../../config/emails';
import { offerCodeDiscount, SUBSCRIBE_EMAIL_STEP } from '../../config/membership';
import useTracking, { useTrackingOnView } from '../../helpers/hooks/useTracking';
import segmentTrackEmailSubscribed from '../../helpers/tracking/segment/trackEmailSubscribed';

const cx = classnames.bind( styles );

// generic container that provides the styling for a "wrapped" EmailSignup container, i.e. with border + background
export const EmailSignupContainer = ( { children } ) => (
	<div className={cx( 'wrapper' )}>
		{children}
	</div>
);

EmailSignupContainer.propTypes = {
	children: PropTypes.node.isRequired,
};
export const EmailSignup = () => {
	return <div></div>
}
export const Comentout_EmailSignup = ( {
	buttonText,
	checkboxListSlugs,
	email,
	emailName,
	id,
	handleChange,
	hideEmailOptions,
	location,
	slugs,
	onSignupConfirmed,
	placeholder,
	referredByEmail,
	registerUser,
	title,
	trackingData,
	trackFocus,
	viewRef,
} ) => {
	const [ primarySignupConfirmed, setPrimarySignupConfirmed ] = useState( false );
	const [ allSignupsConfirmed, setAllSignupsConfirmed ] = useState( false );
	const { isLoggedIn, isMember } = useClientSideUserData();

	const {
		emailAddress,
		handleEmailSubmit,
		setEmail,
		toggleCheckbox,
		inputStatus,
		selectedSlugs,
		loading,
		error,
		showErrors,
	} = useEmailSubmit( {
		email,
		handleChange,
		isLoggedIn,
		slugs,
		onSignupConfirmed: response => {
			segmentTrackEmailSubscribed( {
				conversionFlow: 'Other',
				siteLocation: location,
				subscribedToEmails: response.slugs,
			} );

			// if this is the first signup step (email input), set primary signup confirmed
			if ( !primarySignupConfirmed ) {
				setPrimarySignupConfirmed( true );
			}
			// if this is the second signup step (checkboxes), show thank you message
			// if we're hiding additional email options, skip the checkbox step
			if ( primarySignupConfirmed || hideEmailOptions ) {
				setAllSignupsConfirmed( true );
			}
			onSignupConfirmed( response );
		},
		referredByEmail,
		registerUser,
	} );

	// reset the listSlugs in the event that user selects more (i.e. stage 2, below)
	const trackSubmit = useTracking( submitNewsletterModule, { ...trackingData, listSlugs: selectedSlugs } );

	// Add "the" before select lists in signup confirmation
	const fullEmailName = [
		'Quartz Daily Brief',
		'Quartz Weekly Obsession',
		'Quartz Africa Weekly Brief' ].includes( emailName ) ? `the ${emailName}` : emailName;

	if ( allSignupsConfirmed && !loading ) {
		// "stage 3" - thank-you message for signing up & CTA to subscribe
		return (
			<div className={cx( 'container', inputStatus )}>
				<p className={cx( 'confirmation-text' )}>
					You’re all set.
					{
						!isMember && <span> Since you’re here, take {offerCodeDiscount} off Quartz Membership today.</span>
					}
				</p>
				{
					!isMember && (
						<Fragment>
							<p className={cx( 'member-link' )}>Membership gets you <Link to={SUBSCRIBE_EMAIL_STEP}>unlimited access</Link> to our business journalism with a global perspective.</p>
							<SubscribeCTAs
								showLogin={false}
								style="side-by-side"
								subscribeLabel={<Fragment>Let’s do it 👍</Fragment>}
								trackingContext="email-signup"
							/>
						</Fragment>
					)
				}
			</div>
		);
	}

	return (
		<form
			onSubmit={( e ) => {
				e.preventDefault();
				handleEmailSubmit();
				trackSubmit();
			}}
			className={cx( 'container' )}
			ref={viewRef}
		>
			{
				title &&
				primarySignupConfirmed
					? <Fragment>
						<p className={cx( 'thanks' )}>
							{`🎉 You’re signed up${fullEmailName ? ` for ${fullEmailName}.` : '.' }`}
						</p>
						<p className={cx( 'want-more' )}>Want more Quartz in your inbox?</p>
					</Fragment>
					: <p className={cx( 'title' )}>{title}</p>
			}
			<div className={cx( 'content' )}>
				{
					// "stage 1" - email input + primary email signup
					!primarySignupConfirmed && (
						<Fragment>
							<div className={cx( 'email' )}>
								<Input
									id={id}
									handleChange={setEmail}
									placeholder={placeholder}
									value={emailAddress}
									status={inputStatus}
									handleFocus={trackFocus}
									type="email"
									aria-label={placeholder}
									invalid={!!error}
								/>
								{showErrors && error && (
									<div
										className={cx( 'error-message' )}
										dangerouslySetInnerHTML={{ __html: error }}
									/>
								)}
							</div>
							<div className={cx( 'button-wrapper' )}>
								<Button loading={loading} type="submit">{buttonText}</Button>
							</div>
						</Fragment>
					)
				}
				{
					// "stage 2" - show a list of checkboxes for additional email signups
					primarySignupConfirmed && (
						<Fragment>
							<EmailCheckboxList
								checkboxListSlugs={checkboxListSlugs}
								selectedSlugs={selectedSlugs}
								toggleCheckbox={toggleCheckbox}
							/>
							<div className={cx( 'check-ctas' )}>
								<div className={cx( 'button' )}>
									<Button loading={loading} type="submit">
										{buttonText}
									</Button>
								</div>
								<div className={cx( 'button' )}>
									<Button onClick={() => setAllSignupsConfirmed( true )} variant="secondary">
										No thanks
									</Button>
								</div>
							</div>
							{showErrors && error && (
								<div
									className={cx( 'error-message' )}
									dangerouslySetInnerHTML={{ __html: error }}
								/>
							)}
						</Fragment>
					)
				}
			</div>
			<p
				className={cx( 'disclaimer' )}
			>
				By providing your email, you agree to the <Link to="/about/privacy-policy/">Quartz Privacy Policy</Link>.
			</p>
		</form>
	);
};

EmailSignup.propTypes = {
	buttonText: PropTypes.string,
	checkboxListSlugs: PropTypes.array,
	email: PropTypes.string,
	emailName: PropTypes.string,
	handleChange: PropTypes.func,
	hideEmailOptions: PropTypes.bool,
	id: PropTypes.string.isRequired,
	location: PropTypes.string.isRequired,
	onSignupConfirmed: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	referredByEmail: PropTypes.string,
	registerUser: PropTypes.func.isRequired,
	// note - slug order matters
	// first in the list is the primary slug for the component
	slugs: PropTypes.arrayOf( PropTypes.string ).isRequired,
	title: PropTypes.node,
	trackFocus: PropTypes.func.isRequired,
	trackingData: PropTypes.object.isRequired,
	viewRef: PropTypes.func,
};

EmailSignup.defaultProps = {
	buttonText: 'Sign me up',
	handleChange: () => {},
	hideEmailOptions: false,
	placeholder: 'Enter your email',
	onSignupConfirmed: () => {},
	title: '',
	referredByEmail: null,
};

function EmailSignupWithHooks( { trackingData, ...props } ) {
	const { registerUser } = useUserRegistration();
	const trackFocus = useTracking( clickNewsletterModule, trackingData );
	const viewRef = useTrackingOnView( viewNewsletterModule, trackingData );

	return (
		<EmailSignup
			registerUser={registerUser}
			trackingData={trackingData}
			trackFocus={trackFocus}
			viewRef={viewRef}
			{...props}
		/>
	);
}

EmailSignupWithHooks.propTypes = {
	trackingData: PropTypes.object,
};

export default compose(
	withQueryParamData(),
	withProps( ( { slugs, location } ) => ( {
		id: `email-signup-${slugs.join( '-' )}`,
		// remove the primary email slug from the checkbox list
		checkboxListSlugs: emailList.filter( slug => !slugs.includes( slug ) && !MEMBER_ONLY_EMAILS.includes( slug ) ),
		emailName: emails[ slugs[0] ]?.name,
		trackingData: {
			location,
			listSlugs: slugs,
		},
	} ) )
)( EmailSignupWithHooks );
