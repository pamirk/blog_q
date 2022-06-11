import React, {Fragment, useRef, useState} from 'react';
import styles from './ArticlePaywallEmailExchange.module.scss';
import Link from 'components/Link/Link';
import {FormWithValidation} from 'components/FormWithValidation/FormWithValidation';
import {EmailInput} from 'components/Input/Input.jsx';
import SubscribeCTAs from 'components/SubscribeCTAs/SubscribeCTAs';
import {submitEmailExchange} from 'helpers/tracking/actions/newsletter';
import {submitNewsletterModule, trackCtaView, trackEmailExchangeSuccess,} from 'helpers/tracking/actions';
import useTracking, {useTrackingOnMount} from 'helpers/hooks/useTracking';
import useUserRegistration from 'helpers/hooks/useUserRegistration';
import segmentTrackEmailSubscribed from 'helpers/tracking/segment/trackEmailSubscribed';
import {getUtmQueryParams} from 'helpers/queryParams';
import {SUBSCRIBE_EMAIL_STEP} from 'config/membership';

const trackingData = {
    ctaName: 'Email exchange paywall',
    context: 'one free article',
};

const utmQueryParams = getUtmQueryParams();

// Format identifying info about the request to
// save in Sendgrid on the contact's custom fields.
// Only pass these if they're present.
const customFields = ['utm_campaign', 'utm_source'].reduce((acc, key) => {
    if (utmQueryParams[key]) {
        return {...acc, [key]: utmQueryParams[key]};
    }
    return acc;
}, {});

export default function ArticlePaywallEmailExchange(props: {
    id: string,
    source: string,
    submitText?: string,
}) {
    const {
        id,
        source,
        submitText,
    } = props;
    // Track mount, submission, conversion, and email list signup events
    useTrackingOnMount(trackCtaView, trackingData);
    const trackFormSubmission = useTracking(submitEmailExchange, trackingData);
    const trackPaywallConversion = useTracking(trackEmailExchangeSuccess, trackingData);
    const trackEmailListSignup = useTracking(submitNewsletterModule, {
        listSlugs: ['daily-brief'],
        location: 'email-exchange',
    });

    const emailRef = useRef<HTMLInputElement>();

    const {registerUser, loading} = useUserRegistration();
    const [error, setError] = useState<{ props: any }>();

    function onSubmit(_, opts: { captchaToken: string } | null) {
        const {captchaToken} = opts || {};
        const email = emailRef.current?.value || '';

        // Fire the form submission tracking event
        trackFormSubmission({
            email,
            captchaToken,
        });

        // Register the user with a coupon code. Pass the article ID so that
        // we can store it in Redux.
        registerUser({
            captchaToken,
            contentIds: [id],
            email,
            source,
        })
            .then(response => {
                // GA
                trackPaywallConversion(response);
                trackEmailListSignup();
                // Segment
                segmentTrackEmailSubscribed({
                    conversionFlow: 'In Content',
                    siteLocation: 'email-exchange',
                    subscribedToEmails: ['daily-brief'],
                });
            })
            .then(() => {
                // This is a little redundant, since all new users already get
                // signed up for the Daily Brief (via the webhook Zebroid sends).
                // But since our user database doesn't capture query params, we
                // need to upsert the Sendgrid contact ourselves, so that
                // marketing can get critical information about their campaigns.
                // This bears revisiting as we move to Piano!
                const body = {
                    email,
                    list_names: ['daily-brief'],
                    custom_fields: customFields,
                };
                const formPostVars = {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'},
                };

                return fetch('/api/email/subscribe', formPostVars);
            })
            .catch(message => setError(message));
    }

    // If this user is a return visitor who has already passed paywall once, the error prop is received as a React Fragment.
    // This error prop contains a link to the magic-link page (since it's the same response
    // as a user who would be trying to sign up again); but we want them to subscribe, not sign in.
    // Check to see if it's the fragment error and show them the subscribe CTAs. Other error messages we display as usual.
    const showCTA = !!error?.props;

    if (showCTA) {
        return (
            <Fragment>
                <p className={styles.cta}>It looks like you’ve used this email with us before. <Link
                    to={SUBSCRIBE_EMAIL_STEP}>Become a member</Link> to read unlimited stories from Quartz.</p>
                <div className={styles.ctaContainer}>
                    <SubscribeCTAs
                        trackingContext="Member unlock paywall"
                        showLogin={false}
                    />
                </div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <FormWithValidation
                error={error}
                loading={loading}
                inline={true}
                onSubmit={onSubmit}
                submitText={submitText}
                useCaptcha={true}
            >
                <div className={styles.emailField}>
                    <EmailInput
                        placeholder="e.g. example@qz.com"
                        inputRef={emailRef}
                        required={true}
                        id="email-exchange"
                    />
                </div>
            </FormWithValidation>
            <p className={styles.disclaimer}>By providing your email, you agree to the <Link
                to="/about/privacy-policy/">Quartz Privacy Policy</Link>.</p>
            <p className={styles.login}>Already a member? <Link to="/login/">Log in.</Link></p>
        </Fragment>
    );
}
