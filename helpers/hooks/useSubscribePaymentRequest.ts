import { allPlans } from 'config/membership';
import { JAPAN_SIGNUP_INTENT } from 'config/users';
import { getPlanDataByCountryCode } from 'helpers/plans';
import useCountryCode from 'helpers/hooks/useCountryCode';
import usePaymentRequest from './usePaymentRequest';
import React from "react";

export default function useSubscribePaymentRequest( args: {
	handleSubmit: ( event: React.FormEvent, captchaToken: string ) => Promise<void>,
	intent?: string,
	paymentRequestRef: React.RefObject<any>,
	planId: number,
	planPreview?: { total: number },
} ) {

	const { countryCode, countryCodeOverride } = useCountryCode();
	const { currency, countryCode: supportedCountry } = getPlanDataByCountryCode( countryCode, countryCodeOverride );
	const { priceInt, priceDec, planName } = allPlans[ args.planId ];
	const stripeCountry = supportedCountry.toUpperCase();

	let price;

	if ( args.planPreview ) { // coupon on yearly plan
		price = args.planPreview.total;
	} else {
		price = priceDec || priceInt;
	}

	const locale = args.intent === JAPAN_SIGNUP_INTENT ? 'ja' : 'auto';

	return usePaymentRequest( {
		amount: price,
		country: stripeCountry,
		currency,
		handleSubmit: args.handleSubmit,
		label: planName,
		locale,
		paymentRequestRef: args.paymentRequestRef,
	} );
}
