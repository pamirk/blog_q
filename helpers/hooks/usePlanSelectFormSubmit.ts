import useCreateSubscription from 'helpers/hooks/useCreateSubscription';
import useRedeemGift from 'helpers/hooks/useRedeemGift';
import React, { useState } from 'react';
import {
	trackMembershipPaymentSuccess,
	trackBOGOConversionSuccess,
	trackMembershipPurchase,
	trackMembershipPurchaseEcommerce,
} from 'helpers/tracking/actions';
import trackSegmentOrderCompleted from 'helpers/tracking/segment/trackOrderCompleted';
import useTracking from 'helpers/hooks/useTracking';
import { getErrorMessage } from 'helpers/errors';

export default function usePlanSelectFormSubmit( args: {
	couponCode,
	freeTrialLength,
	getStripeTokenRef,
	giftCode,
	offer,
	planId,
	promoCodeRef,
} ) {
	const createSubscription = useCreateSubscription();

	const trackPaymentSuccess = useTracking( trackMembershipPaymentSuccess, {} );
	const trackPurchase = useTracking( trackMembershipPurchase, {} );
	const trackPurchaseEcommerce = useTracking ( trackMembershipPurchaseEcommerce, {} );

	const trackBOGOSuccess = useTracking( trackBOGOConversionSuccess, {} );

	const { redeemGift } = useRedeemGift();
	const [ error, setError ] = useState<string|null>( null );
	const [ loading, setLoading ] = useState<boolean>( false );

	async function handleSubmit( event: React.FormEvent, { captchaToken } ) {
		setError( null );

		if ( event ) {
			event.preventDefault();
		}

		// Redeeming a gift.
		if ( args.giftCode ) {
			return redeemGift( args.giftCode );
		}

		// The user entered a promo code, but hasn't validated it, so
		// we don't know what type of code it is and can't proceed.
		if ( args.promoCodeRef.current.value && !args.couponCode ) {
			setError( 'Please validate your promo code to continue.' );
			return;
		}

		// No token, so use the credit card element to generate one.
		const stripeTokenPromise = args.getStripeTokenRef.current();

		setLoading( true );

		return stripeTokenPromise
			.then( token => createSubscription( {
				planId: args.planId,
				captchaToken,
				freeTrialLength: args.freeTrialLength,
				couponCode: args.couponCode || undefined,
				offer: args.offer || undefined,
				tokenObject: token,
			} ) )
			.then( ( { altIdHash, user } ) => {
				setLoading( false );

				const subscriptionId = user.membership.subscription.id;
				const { amount, currency, nickname } = user.membership.subscription.plan;
				const { discount } = user.membership.subscription;

				trackPaymentSuccess( { altIdHash, subscriptionId } );

				// Google SEM Optimization
				trackPurchase( { amount: amount } );

				// Google Analytics
				trackPurchaseEcommerce( { ecommerce: {
					purchase: {
						actionField: {
							id: subscriptionId,
							revenue: amount,
							coupon: args.couponCode,
							discountPercent: discount?.coupon?.percentOff,
							currency,
						},
						products: {
							id: args.planId,
							price: amount,
							name: nickname,
						},
					},
				} } );

				trackSegmentOrderCompleted( {
					coupon: args.couponCode,
					currency,
					discountPercent: discount?.coupon?.percentOff,
					name: nickname,
					orderId: subscriptionId,
					price: amount,
					planId: args.planId,
				} );

				if ( args.offer ) {
					trackBOGOSuccess();
				}
			} )
			.catch( ( error: { message: string } ) => {
				setError( getErrorMessage( error.message ) );
			} );
	}

	return { error, loading, handleSubmit };
}
