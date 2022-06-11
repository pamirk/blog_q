import { trackSegmentEvent } from './index';
interface PaymentInfoProperties {
	selectedPlanCurrency: string
	selectedPlanDiscount: number
	selectedPlanId: number
	selectedPlanInterval?: string
	selectedPlanPrice: number
}

export default function trackPaymentInfoEntered ( properties: PaymentInfoProperties ) {
	const {
		selectedPlanCurrency,
		selectedPlanDiscount,
		selectedPlanId,
		selectedPlanInterval,
		selectedPlanPrice,
	} = properties;

	trackSegmentEvent( 'Payment Info Entered', {
		selected_plan_currency: selectedPlanCurrency,
		selected_plan_discount: selectedPlanDiscount,
		selected_plan_id: selectedPlanId,
		selected_plan_interval: selectedPlanInterval,
		selected_plan_price: parseFloat( `${selectedPlanPrice}` ),
	} );
}
