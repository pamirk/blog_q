import useUserApi from 'helpers/hooks/useUserApi';
import { getPlanDataByCountryCode } from 'helpers/plans';
import { useState, useCallback } from 'react';
import useCountryCode from 'helpers/hooks/useCountryCode';
import useTracking from 'helpers/hooks/useTracking';
import { trackCodeValidation as trackingActionCreator } from 'helpers/tracking/actions';
import trackSegmentCouponApplied from 'helpers/tracking/segment/trackCouponApplied';
import trackSegmentCouponDeclined from 'helpers/tracking/segment/trackCouponDeclined';

export default function usePromoCodeCheck() {
	const { countryCode, countryCodeOverride } = useCountryCode();
	const { callApi, loading } = useUserApi();
	const [ error, setError ] = useState<string|null>( null );

	const [ couponCode, setCouponCode ] = useState<string|null>( null );
	const [ planPreview, setPlanPreview ] = useState<any>( null );
	const [ giftCode, setGiftCode ] = useState<string|null>( null );
	const [ planIds, setPlanIds ] = useState<Array<number>>( [] ) ;

	const { defaultPlanId } = getPlanDataByCountryCode( countryCode, countryCodeOverride );

	const clearPromoCode = useCallback( () => {
		setGiftCode( null );
		setCouponCode( null );
		setPlanIds( [] );
	}, [ setPlanIds, setCouponCode, setGiftCode ] );

	const trackCodeValidation = useTracking( trackingActionCreator, {} );

	const checkPromoCode = useCallback( ( code?: string ) => {
		setError( null );
		clearPromoCode();

		if ( !code ) {
			setError( 'Not a valid code' );
			return;
		}

		return callApi( {
			endpoint: 'validate_promo_code',
			method: 'post',
			body: { code, defaultPlanId },
		} )
			.then( ( { promoCode: { type, code, data }, preview } ) => {
				switch ( type ) {
					case 'gift':
						setGiftCode( code );
						setPlanIds( [ data.plan.id ] );
						return { giftCode: code, type, preview };

					case 'coupon':
						setPlanPreview( preview );
						setCouponCode( code );
						// Coupon codes can only apply to a yearly plan.
						setPlanIds( [ defaultPlanId ] );
						return { couponCode: code, type, preview };

					default:
						throw new Error( `Unknown promoCode type: ${type}` );
				}
			} )
			.then( ( { giftCode, couponCode, type, preview } ) => {
				trackCodeValidation( { giftCode, couponCode } );
				trackSegmentCouponApplied( { couponCode: giftCode || couponCode, couponType: type, discountApplied: preview?.discount?.coupon?.percentOff  } );
			} )
			.catch( ( err ) => {
				setError( err );
				trackCodeValidation( { code } );
				trackSegmentCouponDeclined( { couponCode: code } );
			} );
	}, [ callApi, defaultPlanId, clearPromoCode, setError, trackCodeValidation ] );

	return {
		checkPromoCode,
		clearPromoCode,
		loading,
		error,
		couponCode,
		giftCode,
		planPreview,
		planIds,
	};
}
