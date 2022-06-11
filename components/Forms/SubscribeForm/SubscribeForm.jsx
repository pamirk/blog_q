import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import compose from '../../../helpers/compose';
import classnames from 'classnames/bind';
import styles from '../Forms.module.scss';
import { withProps } from '../../../helpers/wrappers';
import withSubscribeFormState, { sharedPropTypes } from './withSubscribeFormState';
import { MEMBERSHIP_SIGNUP } from '../../../helpers/tracking/actions';
import ConfirmationStep from './components/ConfirmationStep/ConfirmationStep';
import NewsletterStep from './components/NewsletterStep/NewsletterStep';
import EmailStep from './components/EmailStep/EmailStep';
import JapanEmailStep from './components/JapanEmailStep/JapanEmailStep';
import PlanSelectForm from '../../../components/PlanSelectForm/PlanSelectForm';
import ProfileStep from './components/ProfileStep/ProfileStep';
import PasswordStep from './components/PasswordStep/PasswordStep';
import Redirect from '../../../components/Redirect/Redirect';
import { Spinner } from '../../../@quartz/interface';
import { USER_EMAIL, USER_HAS_SET_PASSWORD, PLAN_ID } from '../../../helpers/types/account';
import {
	MEMBERSHIP_SIGNUP_INTENT,
	JAPAN_SIGNUP_INTENT,
} from '../../../config/users';
import JapanConfirmationStep from './components/JapanConfirmationStep/JapanConfirmationStep';
import useUserSettings from '../../../helpers/hooks/useUserSettings';

const cx = classnames.bind( styles );

// IMPORTANT: These steps map to URLs, e.g., /subscribe/email/. Therefore the
// values here must match the routes defined in common/routes/index.js.
export const MEMBERSHIP_EMAIL_STEP = 'email';
export const MEMBERSHIP_PAYMENT_STEP = 'payment';
export const MEMBERSHIP_PASSWORD_STEP = 'password';
export const MEMBERSHIP_PROFILE_STEP = 'profile';
export const MEMBERSHIP_NEWSLETTER_STEP = 'newsletter';
export const MEMBERSHIP_CONFIRMATION_STEP = 'confirmation';

export const getCurrentRegistrationStep = ( {
	intent,
	getUserAttribute,
	isMember,
	completedNewsletterStep,
	completedProfileStep,
} ) => {
	const completedEmailStep = getUserAttribute ( USER_EMAIL );
	const userHasSetPassword = getUserAttribute ( USER_HAS_SET_PASSWORD );

	if ( !completedEmailStep ) {
		return MEMBERSHIP_EMAIL_STEP;
	}

	if ( !isMember ) {
		return MEMBERSHIP_PAYMENT_STEP;
	}

	if ( !userHasSetPassword ) {
		return MEMBERSHIP_PASSWORD_STEP;
	}

	if ( !completedNewsletterStep && !( intent === JAPAN_SIGNUP_INTENT ) ) {
		return MEMBERSHIP_NEWSLETTER_STEP;
	}

	if ( !completedProfileStep ) {
		return MEMBERSHIP_PROFILE_STEP;
	}

	return MEMBERSHIP_CONFIRMATION_STEP;
};

export const redirectToCurrentStep = ( {
	locale,
	requestedStep,
	registrationStep,
} ) => {
	if ( requestedStep === registrationStep ) {
		return {
			redirectTo: null,
		};
	}

	return {
		redirectTo: `/${locale ? `${locale}/` : ''}subscribe/${registrationStep}/`,
	};
};

export const getStepPropsForIntent = ( intent, previousPath, freeTrialLength ) => {
	if ( intent === JAPAN_SIGNUP_INTENT ) {
		const planTitle = freeTrialLength ? `${freeTrialLength}日間の無料体験をはじめよう` : 'Quartz Japanの購読をはじめよう';

		return {
			email: {
				title: '世界とつながる、新しいニュース体験。',
				description: <Fragment><p>世界の「今」と「次」の情報が、「探す」必要なく「毎日届く」。Quartz Japanのニュースレターは、次世代のビジネスパーソンがアイデアを生み、実現し、新たな時代を生き抜くために必要不可欠なグローバルニュースを、英語を学びながら効率的かつ最大限にインプットできる、新たな習慣を提供しています。</p><p>📲 7日間のフリートライアルでぜひ、Quartz Japanの新しいニュースレターを体験してみてください。</p></Fragment>,
				submitText: '料金プランを確認',
			},
			planSelect: {
				title: planTitle,
				submitText: '申し込む',
			},
			password: {
				title: 'パスワードを設定する',
				submitText: '次へ',
			},
			profile: {
				title: 'プロフィールを設定しよう',
				description: 'この情報はQuartzのプロフィールに表示されます。実名を、英語でご登録お願いします。',
				submitText: '次へ',
			},
			confirmation: {
				title: 'Quartzにご登録いただきありがとうございます。',
				primaryCTAText: 'アカウントを管理する',
				secondaryCTAText: 'Quartzの英語コンテンツを見る',
				primaryCTALink: '/japan/settings/profile/',
				secondaryCTALink: '/',
			},
		};
	}

	return {
		email: {
			title: <Fragment>Enrich your perspective.<br />Embolden your work.<br />Become a Quartz member.</Fragment>,
			description: <Fragment>Try it for free, and if it’s not for you cancel hassle-free.</Fragment>,
			submitText: 'See plans and pricing',
		},
		planSelect: {
			submitText: 'Sign up',
		},
		password: {
			title: 'Welcome! It’s [time] to pick a password.',
			description: '(Need help? How about: favorite city in the world + year you expect we’ll have flying cars.).',
			imageUrl: 'https://cms.qz.com/wp-content/uploads/2020/10/seinfield.gif',
		},
		profile: {
			title: 'Okay, we can’t stand the suspense any longer. Tell us about yourself!',
			description: 'We’d like to know who’s reading Quartz to better tailor our reporting.',
			submitText: 'Complete registration',
		},
		newsletter: {
			title: 'Not to brag, but our emails are pretty great. Curate your experience below.',
			description: 'We promise to pique your interest, and we’ll always keep it concise. We’ve pre-selected the emails that are core to your membership experience.',
			primaryCTAText: 'Save email preferences',
		},
		confirmation: {
			title: 'Thanks for supporting our journalism',
			description: 'Our team of reporters around the world works hard to keep you informed on the global economy through award-winning journalism. That work takes [time] and resources to produce, and without supporters like you it wouldn’t be possible.',
			primaryCTAText: 'Launch into membership 🚀',
			previousPath,
		},
	};
};

export const SubscribeFormStep = ( {
	freeTrialLength,
	getUserAttribute,
	getUserSetting,
	handleFieldChange,
	handleNewsletterSubmit,
	handleProfileSubmit,
	intent,
	isPromo,
	registrationStep,
	stepProps,
	trackingContext,
	formState,
	...props
} ) => {

	const paymentRequestRef = useRef();

	const sharedTrackingData = {
		context: trackingContext,
		formName: MEMBERSHIP_SIGNUP,
		planId: getUserSetting( PLAN_ID ),
	};

	// The user is a member, and they completed their profile. Confirm success!
	if ( MEMBERSHIP_CONFIRMATION_STEP === registrationStep ) {

		return intent === JAPAN_SIGNUP_INTENT ?
			<JapanConfirmationStep
				{...props}
				{...stepProps.confirmation}
				intent={intent}
				trackingData={{
					...sharedTrackingData,
					stageName: 'confirmation',
				}}
			/> : <ConfirmationStep
				{...props}
				{...stepProps.confirmation}
				intent={intent}
				trackingData={{
					...sharedTrackingData,
					stageName: 'confirmation',
				}}
			/>;
	}

	if ( MEMBERSHIP_PROFILE_STEP === registrationStep )	{
		return (
			<ProfileStep
				{...props}
				{...stepProps.profile}
				formState={formState}
				handleFieldChange={handleFieldChange}
				getUserAttribute={getUserAttribute}
				handleSubmit={handleProfileSubmit}
				trackingData={{
					...sharedTrackingData,
					stageName: 'profile',
				}}
			/>
		);
	}

	// The user is a member, and they supplied a password. Offer them
	// the opportunity to sign up for our emails
	if ( MEMBERSHIP_NEWSLETTER_STEP === registrationStep ) {
		return (
			<NewsletterStep
				{...props}
				{...stepProps.newsletter}
				handleNewsletterSubmit={handleNewsletterSubmit}
				intent={intent}
				trackingData={{
					...sharedTrackingData,
					stageName: 'newsletter',
				}}
			/>
		);
	}

	// The user is a member, and they have an initial (random) password;
	// but they need to supply a permanent password.
	if ( MEMBERSHIP_PASSWORD_STEP === registrationStep ) {
		return (
			<PasswordStep
				{...stepProps.password}
				trackingData={{
					...sharedTrackingData,
					stageName: 'password',
				}}
			/>
		);
	}

	// Show a separate step for plan selection.
	if ( MEMBERSHIP_PAYMENT_STEP === registrationStep ) {
		return (
			<PlanSelectForm
				{...stepProps.planSelect}
				freeTrialLength={freeTrialLength}
				intent={intent}
				isPromo={isPromo}
				paymentRequestRef={paymentRequestRef}
				trackingData={{
					...sharedTrackingData,
					stageName: 'payment',
					trialDuration: freeTrialLength,
				}}
			/>
		);
	}

	// Default: start by collecting the user's email.
	if ( MEMBERSHIP_EMAIL_STEP === registrationStep ) {
		if ( intent === JAPAN_SIGNUP_INTENT ) {
			return (
				<JapanEmailStep
					{...stepProps.email}
					trackingData={{
						...sharedTrackingData,
						stageName: 'email',
					}}
				/>
			);
		}

		return (
			<EmailStep
				{...stepProps.email}
				trackingData={{
					...sharedTrackingData,
					stageName: 'email',
				}}
			/>
		);
	}
};

SubscribeFormStep.propTypes = {
	...sharedPropTypes,
	freeTrialLength: PropTypes.number.isRequired,
	initialPassword: PropTypes.string,
	intent: PropTypes.string.isRequired,
	isMember: PropTypes.bool.isRequired,
	isPromo: PropTypes.bool.isRequired,
	redirectTo: PropTypes.string,
	stepProps: PropTypes.object.isRequired,
	trackingContext: PropTypes.string.isRequired,
};

SubscribeFormStep.defaultProps = {
	intent: MEMBERSHIP_SIGNUP_INTENT,
	isMember: false,
};

export const SubscribeForm = ( {
	intent,
	isLoggedIn,
	isMemberPromotion,
	promo,
	redirectTo,
	...props
} ) => {
	const { loading } = useUserSettings( );

	// If the user is logged in and we don't yet have their settings, wait until
	// we do before proceeding.
	if ( isLoggedIn && loading ) {
		return (
			<div className={styles.spinner}>
				<Spinner />
			</div>
		);
	}

	// Redirects users who try to access a registration step
	// they shouldn't have access to
	if ( redirectTo ) {
		return <Redirect to={redirectTo} />;
	}

	// Now that the page has loaded and we have determined the correct step, we
	// can load the appropriate page contents and track the page view
	const isPromo = isMemberPromotion || promo;

	return (
		<div className={cx( 'container', { isPromo, constrained: intent !== JAPAN_SIGNUP_INTENT } )}>
			<SubscribeFormStep {...props} intent={intent} isPromo={isPromo} />
		</div>
	);
};

SubscribeForm.propTypes = {
	completedProfileStep: PropTypes.bool.isRequired,
	intent: PropTypes.string.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	isMemberPromotion: PropTypes.bool.isRequired,
	locale: PropTypes.string,
	promo: PropTypes.bool.isRequired,
	redirectTo: PropTypes.string,
	registrationStep: PropTypes.string.isRequired,
};

SubscribeForm.defaultProps = {
	isLoggedIn: false,
	isMemberPromotion: false,
	promo: false,
};

export default compose(
	withSubscribeFormState(),
	withProps( props => ( {
		registrationStep: getCurrentRegistrationStep( props ),
	} ) ),
	withProps( redirectToCurrentStep ),
	withProps( ( { freeTrialLength, intent, previousPath } ) => ( {
		stepProps: getStepPropsForIntent( intent, previousPath, freeTrialLength ),
	} ) )
)( SubscribeForm );
