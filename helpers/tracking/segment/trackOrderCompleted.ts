import { trackSegmentEvent } from './index';

export interface PlanInfoProperties {
	coupon?: string,
	currency?: 'gbp' | 'inr' | 'jpy' | 'usd'
	discount?: number
	discountPercent?: number
	name?: string
	orderId?: string
	planId?: number
	price?: number
}

export default function trackOrderCompleted( properties: PlanInfoProperties ) {
	const {
		coupon,
		currency,
		discountPercent,
		name,
		orderId,
		planId,
		price,
	} = properties;

	// "Order Completed" is a reserved/special event within Segment that has some formatting expectations
	// hence this object structure
	const orderDetails = {
		coupon,
		currency: currency?.toUpperCase(),
		discount_percent: discountPercent,
		order_id: orderId,
		products: [
			{
				name,
				price,
				product_id: planId,
				quantity: 1,
			},
		],
		revenue: price, // needed for the special properties of this event
	};

	trackSegmentEvent( 'Order Completed', orderDetails );
}
