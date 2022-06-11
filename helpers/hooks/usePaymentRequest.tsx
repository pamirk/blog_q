// noinspection TypeScriptValidateJSTypes

import React, { useEffect, useState, useRef } from 'react';
import { loadScriptOnce } from 'helpers/utils';
import { stripeClientKey } from 'config/membership';

export default function usePaymentRequest( args: {
	amount: number,
	country: string,
	currency: string,
	handleSubmit: ( event: any, captchaToken: any ) => Promise<void>
	label: string,
	locale?: string,
	paymentRequestRef: React.RefObject<any>,
} ) {
	const { currency, amount, label, locale, country, handleSubmit, paymentRequestRef } = args;

	const [ applePayVisible, setApplePayVisible ] = useState( false );
	const [ googlePayVisible, setGooglePayVisible ] = useState( false );

	const [ stripeConfigured, setConfigured ] = useState( false );

	const stripe = useRef<any>();

	// Configure Stripe once on mount, and then again if the locale changes.
	useEffect( () => {
		setConfigured( false );

		loadScriptOnce( 'https://js.stripe.com/v3/', {} )
			.then( () => {
				// Configure Stripe.
				if ( ! stripeClientKey ) {
					return;
				}
				const options = locale ? { locale } : {};
				// @ts-ignore
				stripe.current = window.Stripe( stripeClientKey, options );
				setConfigured( true );
			} );

	}, [ locale ] );

	// Configure/reconfigure the paymentRequest: after every [time] Stripe is configured,
	// and when any of the paymentRequest's values have changed.
	useEffect( () => {
		if ( !stripeConfigured ) {
			return;
		}

		const request = stripe.current.paymentRequest( {
			country: country,
			currency: currency,
			total: {
				label: label,
				amount: amount,
			},
			requestPayerName: true,
			requestPayerEmail: true,
		} );

		Object.assign( paymentRequestRef, { current: request } );

		// Check whether a browser payment API is available.
		// https://stripe.com/docs/js/payment_request/can_make_payment
		paymentRequestRef.current.canMakePayment().then( ( result: { applePay?: boolean } ) => {
			// The result has an Apple Pay key that will be set to true if Apple Pay is enabled,
			// however if Google Pay is enabled, result is an object with Apple Pay set to false.
			// If nothing is enabled, an empty object is returned.
			setApplePayVisible( !!result?.applePay );
			setGooglePayVisible( false === result?.applePay );
		} );

		// Bind the submit handler to the paymentRequest's token event,
		// which fires when the payment is successfully created in the dialog.
		// When buying with a payment request, this is how we submit the form.
		paymentRequestRef.current.on( 'token', ( event ) => {
			// Make the purchase
			handleSubmit( event, null )
				.then( () => event.complete( 'success' ) )
				.catch( () => event.complete( 'fail' ) );
		} );

	}, [ currency, amount, label, country, handleSubmit, paymentRequestRef, stripeConfigured ] );

	function showDialog( event ) {
		event.preventDefault();
		paymentRequestRef.current.show();
	}

	return {
		onPaymentRequestClick: showDialog,
		showApplePaymentRequestButton: applePayVisible,
		showGooglePaymentRequestButton: googlePayVisible,
	};
}
