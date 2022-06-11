import React, {useRef, useState} from 'react';
import classnames from 'classnames/bind';
import Form from 'components/Form/Form';
import FormActions from 'components/FormActions/FormActions';
import {EmailInput} from 'components/Input/Input';
import styles from './AccountEmailForm.module.scss';
import {getQueryParams} from 'helpers/urls';
import {useClientSideUserData} from 'helpers/hooks';
import {USER_EMAIL} from 'helpers/types/account';
import useUserRegistration from 'helpers/hooks/useUserRegistration';
import useUserEmailUpdate from 'helpers/hooks/useUserEmailUpdate';
import {submitNewsletterModule, trackEmailFormSuccess} from 'helpers/tracking/actions';
import segmentTrackEmailCaptured from 'helpers/tracking/segment/trackEmailCaptured';
import segmentTrackEmailSubscribed from 'helpers/tracking/segment/trackEmailSubscribed';
import useTracking from 'helpers/hooks/useTracking';

const cx = classnames.bind(styles);

const {email: suggestedEmail} = getQueryParams();

export interface SubscribeFormTrackingData {
    context: string,
    formName: string,
    planId?: number,
    stageName: string
}

export default function AccountEmailForm(props: {
    children: React.ReactNode,
    emailLabel?: string,
    id?: string,
    layout?: 'block' | 'inline',
    source: 'subscribe' | 'subscribe-japan',
    submitText: string,
    trackingData: SubscribeFormTrackingData,
}) {
    const emailRef = useRef<HTMLInputElement>();
    const [error, setError] = useState<React.ReactNode>(null);
    const {getUserAttribute, isLoggedIn} = useClientSideUserData();
    const {updateUserEmail, loading: updateLoading} = useUserEmailUpdate();
    const {registerUser, loading: registerLoading} = useUserRegistration();

    const loading = updateLoading || registerLoading;

    const sendFormSuccessTrackingEvent = useTracking(trackEmailFormSuccess, props.trackingData);
    const sendEmailSignupTrackingEvent = useTracking(submitNewsletterModule, {
        listSlugs: ['daily-brief'],
        location: 'subscribe-flow',
    });

    const defaultValue = getUserAttribute(USER_EMAIL) || suggestedEmail || '';

    function onSubmit(_, {captchaToken}): void {
        const email = emailRef.current?.value;

        if (!email) {
            return;
        }

        setError(null);

        // Not all users are guaranteed to have an email (e.g. Auth0 users). If the
        // user does not have an email address, set it before proceeding.
        if (isLoggedIn && !getUserAttribute(USER_EMAIL)) {
            updateUserEmail(email)
                .catch((message: React.ReactNode) => setError(message));
            return;
        }

        registerUser({
            captchaToken,
            email,
            source: props.source,
        })
            .then((args: { altIdHash: string, user: { email: string, userId: number } }) => {
                sendFormSuccessTrackingEvent({altIdHash: args.altIdHash});

                // also fire Segment track event
                segmentTrackEmailCaptured();

                // Fire Daily Brief subscribe tracking events if this isn't the
                // Quartz Japan signup flow
                if ('subscribe-japan' !== props.source) {
                    sendEmailSignupTrackingEvent();
                    segmentTrackEmailSubscribed({
                        conversionFlow: 'Membership flow',
                        siteLocation: 'subscribe-flow',
                        subscribedToEmails: ['daily-brief'],
                    });
                }
            })
            .catch((message: React.ReactNode) => setError(message));
    }

    const layout = props.layout || 'block';

    return (
        <Form
            layout={layout}
            onSubmit={onSubmit}
            trackingData={props.trackingData}
            useCaptcha={true}
            id={props.id}
        >
            <div className={cx(layout, 'field')}>
                <EmailInput
                    id="account-email"
                    autoComplete="username"
                    label={props.emailLabel || 'Enter your email'}
                    fieldName="email"
                    inputRef={emailRef}
                    defaultValue={defaultValue}
                    trackingData={props.trackingData}
                    readOnly={false}
                    required={true}
                />
            </div>
            <div className={cx(layout, 'buttons')}>
                <FormActions
                    loading={loading}
                    submitText={props.submitText}
                />
            </div>
            {error && <p className={cx('error')} data-cy="account-email-error">{error}</p>}
            {props.children}
        </Form>
    );
}
