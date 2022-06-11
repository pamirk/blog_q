import useUserApi from 'helpers/hooks/useUserApi';

// Create subscription for existing user.
export default function useCreateSubscription() {
	const { callApi } = useUserApi();

	function createSubscription ( args: {
		captchaToken?: string,
		couponCode: string | null,
		freeTrialLength: number
		offer?: string,
		planId: number,
		tokenObject: {
			id: string,
			card: {
				address_zip: number,
				country: string,
			}
		},
	} ) {
		return callApi( {
			endpoint: 'subscription',
			method: 'post',
			body: {
				addressZip: args.tokenObject.card.address_zip,
				addressCountry: args.tokenObject.card.country,
				captchaToken: args.captchaToken,
				freeTrialLength: args.freeTrialLength,
				planId: args.planId,
				token: args.tokenObject?.id,
				couponCode: args.couponCode,
				offer: args.offer,
			},
		} );
	}

	return createSubscription;
}
