import { giftPlans } from 'config/membership';
import usePaymentRequest from './usePaymentRequest';
import React from "react";

export default function useGiftPaymentRequest( args: {
	handleSubmit: ( event: React.FormEvent, captchaToken: string ) => Promise<void>,
	paymentRequestRef: React.RefObject<any>,
	planId: number,
} ) {
	const { priceInt, priceDec, planName } = giftPlans[ args.planId ];

	const price = priceDec || priceInt;

	return usePaymentRequest( {
		amount: price,
		country: 'US',
		currency: 'usd',
		handleSubmit: args.handleSubmit,
		label: planName,
		paymentRequestRef: args.paymentRequestRef,
	} );
}
