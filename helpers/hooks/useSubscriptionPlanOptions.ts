import useCountryCode from 'helpers/hooks/useCountryCode';
import { getPlanDataByCountryCode, getPlanOptions } from 'helpers/plans';

export default function useSubscriptionPlanOptions( { giftCode, couponCode, planIds, planPreview } ) {
	const { countryCode, countryCodeOverride } = useCountryCode();
	const planOptions = getPlanOptions( { giftCode, couponCode, planIds, planPreview, countryCode, countryCodeOverride } );

	// Further limit the plan options to display.
	if ( giftCode ) {
		// Nothing to do since the only plan option is already the user's gift.
		return planOptions;
	}

	// Otherwise, regionalize the plan options.
	const regionalPlanData = getPlanDataByCountryCode( countryCode, countryCodeOverride );

	// From the full set of possible planOptions, pick the right ones to display.
	return regionalPlanData.subscriptionPlans.map( id => {
		const plan = planOptions.find( plan => `${id}` === plan.value );
		return {
			currency: regionalPlanData.currency,
			...plan,
		};
	} );
}
