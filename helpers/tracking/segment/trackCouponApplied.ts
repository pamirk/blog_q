import { trackSegmentEvent } from './index';

export default function trackCouponApplied ( properties: { couponCode: string, couponType: string, discountApplied: number, } ) {
	const {
		couponCode,
		couponType,
		discountApplied,
	} = properties;

	trackSegmentEvent( 'Coupon Applied', {
		coupon_code: couponCode,
		coupon_type: couponType,
		discount_applied: discountApplied,
	} );
}
