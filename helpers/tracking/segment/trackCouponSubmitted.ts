import { trackSegmentEvent } from './index';

export default function trackCouponEntered ( properties: { couponCode?: string } ) {
	trackSegmentEvent( 'Coupon Code Submitted', { coupon_code: properties.couponCode } );
}
