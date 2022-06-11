import { trackSegmentEvent } from './index';

export default function trackSignedOut () {
	trackSegmentEvent( 'Signed Out' );
}
