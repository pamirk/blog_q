import React, {Fragment} from 'react';
import Link from '../../Link/Link';
import {Button} from '../../../@quartz/interface';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Form from '../../Form/Form';
import FormActions from '../../FormActions/FormActions';
import PlanSelect from '../../PlanSelect/PlanSelect';
import withFieldState from '../../../helpers/wrappers/withFieldState';
import CreditCard from '../../CreditCard/CreditCard';
import {stripeClientKey} from '../../../config/membership';
import withGiftFormState, {fieldNames} from './withGiftFormState';
import styles from './GiftForm.module.scss';
import {EmailField, InputField, TextAreaField} from '../../../components/Input/Input';
import FormHeader from '../FormHeader/FormHeader';
import {LoginLink} from '../../../components/AccountLink/AccountLink';
import Disclaimer from '../../Disclaimer/Disclaimer';
import ArtDirection from '../../ArtDirection/ArtDirection';
import PaymentRequestButton from '../../PaymentRequestButton/PaymentRequestButton';
import useGiftPaymentRequest from '../../../helpers/hooks/useGiftPaymentRequest';
import {validateFields, validateForm} from '../../../helpers/forms';

const cx = classnames.bind(styles);

const title = 'Give the gift of Quartz';
const description = 'Gift your family, friends, or coworkers Quartz membership. They’ll unlock unlimited access to Quartz on all devices, member-exclusive coverage such as our deeply researched field guides on the issues defining the global economy, ready-to-use presentations, and more. It’s the complete guide to the new global economy.';
const trackingData = {
    context: 'Gift page',
    formName: 'Gift form',
};

const emailSubtext = (isLoggedIn, handleLogout) => isLoggedIn ?
    <Fragment>Not you? <Button onClick={handleLogout} inline={true}><span
        className={styles.logout}>Log out</span></Button></Fragment> :
    <Fragment>Already have an account? <LoginLink trackingContext="gift form"/></Fragment>;

const sources = [
    {
        breakpoint: 'phone-only',
        url: 'https://cms.qz.com/wp-content/uploads/2019/05/mobile-illustration.png',
        width: 845,
        height: 845,
    },
    {
        breakpoint: 'tablet-portrait-up',
        url: 'https://cms.qz.com/wp-content/uploads/2019/05/tablet-illustration.png',
        width: 1406,
        height: 724,
    },
    {
        breakpoint: 'desktop-up',
        url: 'https://cms.qz.com/wp-content/uploads/2019/05/desktop-illustration.png',
        width: 2319,
        height: 827,
    },
];

const PlanSelectField = withFieldState()(PlanSelect);

function GiftForm({
                      canSubmit,
                      formError,
                      formLoading,
                      formState,
                      giftPlanOptions,
                      handleFieldChange,
                      handlePaymentRequestSubmit,
                      handleLogout,
                      handleStripeReady,
                      handleSubmit,
                      isLoggedIn,
                      paymentRequestRef,
                  }) {
    const {
        onPaymentRequestClick: originalOnClick,
        showApplePaymentRequestButton,
        showGooglePaymentRequestButton,
    } = useGiftPaymentRequest({
        planId: formState.plan?.value,
        handleSubmit: handlePaymentRequestSubmit,
        paymentRequestRef,
    });

    // Validate the form before kicking off the paymentRequest purchase.
    function onPaymentRequestClick(event) {
        const newFormState = validateFields(fieldNames, formState);
        if (!validateForm(['senderEmail', 'senderName', 'recipientName', 'recipientEmail'], newFormState)) {
            return;
        }

        originalOnClick(event);
    }

    return (
        <Fragment>
            <div className={cx('header')}>
                <ArtDirection
                    sources={sources}
                    alt=""
                />
                <h1 className={cx('title')}>{title}</h1>
                {description && (
                    <p className={cx('description')}>{description}</p>
                )}
            </div>
            <div className={cx('form-container')}>
                <Form
                    onSubmit={handleSubmit}
                    trackingData={{
                        ...trackingData,
                        planId: formState.plan.value,
                    }}
                    useCaptcha={true}
                >
                    <div className={cx('section')}>
                        <h2 className={cx('title', 'plan-select-title')}>Select a plan</h2>
                        <PlanSelectField
                            handleFieldChange={handleFieldChange}
                            fieldState={formState.plan}
                            options={giftPlanOptions}
                            fieldName="plan"
                        />
                    </div>

                    <div className={cx('section')}>
                        <FormHeader title="Make it personal"/>
                        <fieldset className={cx('field-group')}>
                            <legend className={cx('label')}>To:</legend>
                            <div className={cx('input')}>
                                <InputField
                                    id="gift-recipient-name"
                                    fieldState={formState.recipientName}
                                    handleFieldChange={handleFieldChange}
                                    trackingData={trackingData}
                                    fieldName="recipientName"
                                    placeholder="Recipient name"
                                />
                            </div>
                            <div className={cx('input')}>
                                <EmailField
                                    id="gift-recipient-email"
                                    fieldState={formState.recipientEmail}
                                    handleFieldChange={handleFieldChange}
                                    trackingData={trackingData}
                                    fieldName="recipientEmail"
                                    placeholder="Recipient email"
                                />
                            </div>

                        </fieldset>
                        <fieldset className={cx('field-group')}>
                            <legend className={cx('label')}>From:</legend>
                            <div className={cx('input')}>
                                <InputField
                                    id="gift-sender-name"
                                    fieldState={formState.senderName}
                                    handleFieldChange={handleFieldChange}
                                    trackingData={trackingData}
                                    fieldName="senderName"
                                    placeholder="Sender name"
                                />
                            </div>
                            <div className={cx('input')}>
                                <EmailField
                                    id="gift-sender-email"
                                    fieldState={formState.senderEmail}
                                    handleFieldChange={handleFieldChange}
                                    trackingData={trackingData}
                                    fieldName="senderEmail"
                                    placeholder="Sender email"
                                    readOnly={isLoggedIn}
                                    hint={emailSubtext(isLoggedIn, handleLogout)}
                                />
                            </div>
                        </fieldset>
                        <TextAreaField
                            id="gift-message"
                            trackingData={trackingData}
                            handleFieldChange={handleFieldChange}
                            fieldState={formState.message}
                            fieldName="message"
                            label="Write a personal note (optional)"
                            placeholder="Write a note here"
                        />
                    </div>

                    <div className={cx('section')}>
                        <FormHeader title="Send your gift"/>
                        <CreditCard
                            clientKey={stripeClientKey}
                            onStripeReady={handleStripeReady}
                            label="Use a credit or debit card"
                        />
                        <FormActions
                            submitText="Send gift"
                            loading={formLoading}
                            inactive={canSubmit}
                            error={formError}
                        />

                        {showApplePaymentRequestButton &&
                        <div className={cx('payment-request-button')}>
                            <PaymentRequestButton
                                onClick={onPaymentRequestClick}
                                label="Or pay with Apple Pay"
                                type="apple-pay-button"
                            />
                        </div>
                        }

                        {showGooglePaymentRequestButton &&
                        <div className={cx('payment-request-button')}>
                            <PaymentRequestButton
                                onClick={onPaymentRequestClick}
                                label="Or pay with Google Pay"
                                type="google-pay-button"
                            />
                        </div>
                        }

                        <Disclaimer>
                            <p>By sending this gift, you agree to the <Link to="/about/terms-conditions/">Terms and
                                Conditions</Link> and <Link to="/about/privacy-policy/">Privacy Policy</Link>.</p>
                            <p>This site is protected by reCAPTCHA and the Google <Link
                                to="https://policies.google.com/privacy">Privacy Policy</Link> and <Link
                                to="https://policies.google.com/terms">Terms of Service</Link> apply.</p>
                        </Disclaimer>
                    </div>
                </Form>
            </div>
        </Fragment>
    );
}

const fieldPropTypes = {
    value: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(PropTypes.node),
    validator: PropTypes.func,
};

const formPropTypes = fieldNames.reduce((acc, name) => ({...acc, [name]: PropTypes.shape(fieldPropTypes)}), {});

GiftForm.propTypes = {
    canSubmit: PropTypes.bool.isRequired,
    formError: PropTypes.node,
    formLoading: PropTypes.bool.isRequired,
    formState: PropTypes.shape(formPropTypes),
    giftPlanOptions: PropTypes.arrayOf(PropTypes.shape({
        bannerText: PropTypes.string,
        description: PropTypes.node,
        label: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired, // yes really ... thanks, radio buttons
    })),
    handleFieldChange: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
    handlePaymentRequestSubmit: PropTypes.func.isRequired,
    handleStripeReady: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    paymentRequestRef: PropTypes.shape({current: PropTypes.object}).isRequired,
};

export default withGiftFormState()(GiftForm);
