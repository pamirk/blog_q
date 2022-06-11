import React, {useEffect, useState, useCallback, useRef, Fragment} from 'react';
import Form from 'components/Form/Form';
import FormActions from 'components/FormActions/FormActions';
import PlanSelect from 'components/PlanSelect/PlanSelect';
import CreditCard from 'components/CreditCard/CreditCard';
import {offerCodeDiscount, stripeClientKey} from 'config/membership';
import styles from './PlanSelectForm.module.scss';
import PaymentRequestButton from 'components/PaymentRequestButton/PaymentRequestButton';
import Promotions from 'components/Promotions/Promotions';
import {JAPAN_SIGNUP_INTENT} from 'config/users';
import PlanSelectFormFooter from 'components/PlanSelectFormFooter/PlanSelectFormFooter';
import PromoFormHeader from 'components/PromoFormHeader/PromoFormHeader';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import getLocalization from 'helpers/localization';
import usePageVariant from 'helpers/hooks/usePageVariant';
import useCountryCode from 'helpers/hooks/useCountryCode';
import {getPlanDataByCountryCode} from 'helpers/plans';
import useSubscribePaymentRequest from 'helpers/hooks/useSubscribePaymentRequest';
import useJCBCardError from 'helpers/hooks/useJCBCardError';
import usePlanSelectFormPaymentRequestSubmit from 'helpers/hooks/usePlanSelectFormPaymentRequestSubmit';
import usePlanSelectFormSubmit from 'helpers/hooks/usePlanSelectFormSubmit';
import usePromoCodeCheck from 'helpers/hooks/usePromoCodeCheck';
import useSubscriptionPlanOptions from 'helpers/hooks/useSubscriptionPlanOptions';
import useClientSideUserData from 'helpers/hooks/useClientSideUserData';
import {ELIGIBLE_FOR_FREE_TRIAL} from 'helpers/types/account';
import withQueryParamData from 'helpers/wrappers/withQueryParamData';
import trackSegmentPaymentInfoEntered from 'helpers/tracking/segment/trackPaymentInfoEntered';

const dictionary = {
    ja: {
        'Use a credit or debit card': 'クレジットカード情報を記入',
        'Pay with Apple Pay': 'Apple Pay で支払う',
        'Pay with Google Pay': 'Google Pay で支払う',
    },
};

function useDefaultTitle({freeTrialLength, giftCode}) {
    const {getUserAttribute} = useClientSideUserData();

    if (giftCode) {
        return 'Redeem your offer';
    }

    const trialLanguage = freeTrialLength ? `Start your ${freeTrialLength}-day free trial` : `Get ${offerCodeDiscount} off today!`;

    return getUserAttribute(ELIGIBLE_FOR_FREE_TRIAL) ? trialLanguage : 'Give membership another try';
}

export type PromoType = 'coupon' | 'promoCode' | 'bogo' | null;

function PlanSelectForm(props: {
    freeTrialLength: number;
    intent?: string;
    isPromo: boolean;
    paymentRequestRef: React.RefObject<any>;
    submitText?: string;
    suggestedPromoCode?: string;
    title?: string,
    trackingData: {
        formName: string;
        context?: string;
        stageName: 'payment';
        trialDuration: number;
    };
}) {
    const {trackingData} = props;

    // Use geo headers to see the user's country
    const {countryCode, countryCodeOverride} = useCountryCode();
    // ... and offer them a country specific plan.
    const {defaultPlanId} = getPlanDataByCountryCode(countryCode, countryCodeOverride);

    // The id of the selected plan
    const [planId, setPlanId] = useState<string>(`${defaultPlanId}`);
    const [paymentInfoComplete, setPaymentInfoComplete] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedPromo, setSelectedPromo] = useState<PromoType>(null);

    const {
        checkPromoCode,
        clearPromoCode,
        loading: promoCodeLoading,
        error: promoCodeError,
        couponCode,
        giftCode,
        planPreview,
        planIds,
    } = usePromoCodeCheck();

    const defaultTitle = useDefaultTitle({freeTrialLength: props.freeTrialLength, giftCode});

    // If a suggested promo code arrives, verify it.
    useEffect(() => {
        if (props.suggestedPromoCode) {
            checkPromoCode(props.suggestedPromoCode);
        }
    }, [checkPromoCode, props.suggestedPromoCode]);

    // If that promo code is successsfully verified, autofill it
    // (into the initialized promo code field ref).
    useEffect(() => {
        if (
            inputRef.current &&
            couponCode && couponCode === props.suggestedPromoCode
        ) {
            inputRef.current.value = couponCode;
            setSelectedPromo('promoCode');
        }

    }, [couponCode, props.suggestedPromoCode]);

    useEffect(() => {
        if (inputRef.current && giftCode) {
            inputRef.current.value = giftCode;
        }

    }, [giftCode]);

    const bogoOffer = selectedPromo === 'bogo' ? 'bogo' : null;

    // Submit handlers for the two ways of submitting the form.
    const handlePaymentRequestSubmit = usePlanSelectFormPaymentRequestSubmit({
        couponCode,
        offer: bogoOffer,
        freeTrialLength: props.freeTrialLength,
        planId: parseInt(planId, 10),
    });

    // Bind the payment request handler and find out if we can
    // display the payment request button.
    const {
        onPaymentRequestClick,
        showApplePaymentRequestButton,
        showGooglePaymentRequestButton,
    } = useSubscribePaymentRequest({
        intent: props.intent,
        paymentRequestRef: props.paymentRequestRef,
        planId: parseInt(planId, 10),
        planPreview,
        handleSubmit: handlePaymentRequestSubmit,
    });

    // Initial Stripe token getter which will be overridden by CreditCard
    // component via handleStripeReady prop, which is passed down.
    const getStripeTokenRef = useRef(() => Promise.reject(new Error('Credit card form is not ready.')));

    function handleStripeReady(tokenGetter) {
        getStripeTokenRef.current = tokenGetter;
    }

    const {loading, error, handleSubmit} = usePlanSelectFormSubmit({
        giftCode,
        promoCodeRef: inputRef,
        couponCode,
        getStripeTokenRef,
        planId: parseInt(planId, 10),
        freeTrialLength: props.freeTrialLength,
        offer: bogoOffer,
    });

    // define some template conditionals
    const showGiftWording = !!giftCode;
    const showPayment = !giftCode;
    const showSpecialOffers = !giftCode && props.intent !== JAPAN_SIGNUP_INTENT;
    const submitText = !!giftCode ? 'Redeem your offer' : props.submitText || 'Sign up';

    const {language} = usePageVariant();
    const localize = getLocalization({dictionary, language});

    const subscriptionPlanOptions = useSubscriptionPlanOptions({giftCode, couponCode, planIds, planPreview});

    const selectedPlan = subscriptionPlanOptions.find(option => option.value === planId);

    const {cardSubtext: defaultCardSubtext, cardError: defaultCardError, setCardBrand} = useJCBCardError();
    // JCB cards are only a problem for Japanese (yen) plans.
    const cardError = props.intent === JAPAN_SIGNUP_INTENT ? defaultCardError : null;
    const cardSubtext = props.intent === JAPAN_SIGNUP_INTENT ? defaultCardSubtext : null;

    const promotionProps = {
        defaultValue: props.suggestedPromoCode,
        clearPromoCode,
        couponCode,
        checkPromoCode,
        giftCode,
        inputRef,
        selectedPromo,
        setSelectedPromo,
        loading: promoCodeLoading,
        error: promoCodeError,
        planPreview,
        trackingData: {formName: trackingData.formName},
        showSpecialOffers,
    };

    // If selected plan id changes from yearly, cancel
    // all the fun options.
    useEffect(() => {
        if (planId !== `${defaultPlanId}`) {
            clearPromoCode();

            if (inputRef.current?.value) {
                inputRef.current.value = ''; // clear promo code field
            }

            setSelectedPromo(null); // unselect promo radios

            return;
        }
    }, [planId, clearPromoCode, defaultPlanId]);

    const resetPlanToDefault = useCallback(() => {
        setPlanId(`${defaultPlanId}`);
    }, [defaultPlanId, setPlanId]);

    // If the country code or default id changes, reset the plan id to
    // the new, correct default id.
    useEffect(() => resetPlanToDefault(), [countryCodeOverride, resetPlanToDefault]);

    // A promotion (any promotion) has been selected.
    // Enforce default plan.
    useEffect(() => {
        if (selectedPromo) {
            resetPlanToDefault();
        }
    }, [selectedPromo, resetPlanToDefault]);

    // all of the information we want to track after payment info is entered is here, so just set a stateful trigger
    const onPaymentInfoComplete = (inputComplete) => setPaymentInfoComplete(inputComplete);
    // track payment info as we have it when Stripe detects something that looks like a complete CC #
    useEffect(() => {
        if (paymentInfoComplete) {
            trackSegmentPaymentInfoEntered({
                selectedPlanCurrency: selectedPlan?.currency,
                selectedPlanDiscount: planPreview?.discount?.coupon?.percentOff,
                selectedPlanId: selectedPlan.value,
                selectedPlanInterval: selectedPlan.type || selectedPlan.interval,
                selectedPlanPrice: selectedPlan.price.slice(1),
            });
        }
    }, [planPreview, paymentInfoComplete, selectedPlan]);

    return (
        <Fragment>
            {props.isPromo ? <PromoFormHeader/> : <FormHeader title={props.title || defaultTitle}/>}
            <Form
                onSubmit={handleSubmit}
                trackingData={{
                    ...trackingData,
                    planId,
                }}
                useCaptcha={true}
            >
                <div className={styles.field}>
                    <Promotions
                        {...promotionProps}
                    />
                </div>

                <div className={styles.field}>
                    <PlanSelect
                        options={subscriptionPlanOptions}
                        handleChange={setPlanId}
                        value={planId}
                        id="plan"
                    />
                </div>

                {showApplePaymentRequestButton && showPayment &&
                <div className={styles.paymentRequestButton}>
                    <PaymentRequestButton
                        onClick={onPaymentRequestClick}
                        label={localize('Pay with Apple Pay')}
                        type="apple-pay-button"
                    />
                </div>}

                {showGooglePaymentRequestButton && showPayment &&
                <div className={styles.paymentRequestButton}>
                    <PaymentRequestButton
                        onClick={onPaymentRequestClick}
                        label={localize('Pay with Google Pay')}
                        type="google-pay-button"
                    />
                </div>}

                {showPayment && stripeClientKey &&
                <div className={styles.field}>
                    <CreditCard
                        clientKey={stripeClientKey}
                        onStripeReady={handleStripeReady}
                        language={language}
                        label={localize('Use a credit or debit card')}
                        onPaymentInfoComplete={onPaymentInfoComplete}
                        setCardBrand={setCardBrand}
                        subtext={cardSubtext}
                        error={cardError}
                    />
                </div>}

                <div className={styles.formActions}>
                    <FormActions
                        submitText={submitText}
                        loading={loading}
                        error={error}
                        disabled={!!cardError}
                    />
                </div>

                <PlanSelectFormFooter
                    intent={props.intent}
                    selectedPlan={selectedPlan}
                    showGiftWording={showGiftWording}
                    freeTrialLength={props.freeTrialLength}
                />
            </Form>
        </Fragment>
    );
}

export default withQueryParamData()(PlanSelectForm);
