import { trackSegmentEvent } from './index';

export default function trackEmailCaptured() {
	trackSegmentEvent( 'Email Captured In Subscription Flow' );
}
