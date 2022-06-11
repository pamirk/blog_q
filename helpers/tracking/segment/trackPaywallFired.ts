import { trackSegmentEvent } from './index';

export default function trackPaywallFired( properties: {
	paywallType: string
} ) {
	const { paywallType } = properties;
	trackSegmentEvent( 'Paywall Fired', { paywall_type: paywallType } );
}
