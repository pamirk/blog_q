import { trackSegmentEvent } from './index';

export default function trackCouponDeclined ( properties: { couponCode: string } ) {
	trackSegmentEvent( 'Coupon Declined', { coupon_code: properties.couponCode } );
}
