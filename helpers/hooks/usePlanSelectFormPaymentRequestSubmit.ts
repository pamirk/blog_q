import useCreateSubscription from 'helpers/hooks/useCreateSubscription';
import {
    trackBOGOConversionSuccess,
    trackMembershipPaymentSuccess,
    trackMembershipPurchase,
    trackMembershipPurchaseEcommerce,
} from 'helpers/tracking/actions';
import useTracking from 'helpers/hooks/useTracking';
import {identifySegmentUser} from 'helpers/tracking/segment';
import trackSegmentOrderCompleted from 'helpers/tracking/segment/trackOrderCompleted';

export default function usePlanSelectFormPaymentRequestSubmit({couponCode, offer, freeTrialLength, planId}) {
    const createSubscription = useCreateSubscription();

    const trackPaymentSuccess = useTracking(trackMembershipPaymentSuccess, {});
    const trackBOGOSuccess = useTracking(trackBOGOConversionSuccess, {});
    const trackPurchase = useTracking(trackMembershipPurchase, {});
    const trackPurchaseEcommerce = useTracking(trackMembershipPurchaseEcommerce, {});

    return function handlePaymentRequestSubmit(event) {
        // If the user isn't using a coupon code, we don't want to
        // set a couponCode value at all because an empty string will throw an error
        // on Stripe's side
        return createSubscription({
            couponCode: couponCode || undefined,
            freeTrialLength,
            offer: offer || undefined,
            planId,
            tokenObject: event.token,
        })
            .then(({altIdHash, user}) => {
                const subscriptionId = user.membership.subscription.id;
                const {amount, currency, nickname} = user.membership.subscription.plan;
                const {discount} = user.membership.subscription;

                trackPaymentSuccess({altIdHash, subscriptionId});

                // Google SEM Optimization
                trackPurchase({amount: amount});

                // Google Analytics
                trackPurchaseEcommerce({
                    ecommerce: {
                        purchase: {
                            actionField: {
                                id: subscriptionId,
                                revenue: amount,
                                coupon: couponCode,
                                discountPercent: discount?.coupon?.percentOff,
                                currency,
                            },
                            products: {
                                id: planId,
                                price: amount,
                                name: nickname,
                            },
                        },
                    }
                });

                // Segment tracking events
                identifySegmentUser(user.userId, {email: user.email});
                trackSegmentOrderCompleted({
                    coupon: couponCode,
                    currency,
                    discountPercent: discount?.coupon?.percentOff,
                    name: nickname,
                    orderId: subscriptionId,
                    price: amount,
                    planId: planId,
                });

                if (offer) {
                    trackBOGOSuccess();
                }
            });
    };
}
