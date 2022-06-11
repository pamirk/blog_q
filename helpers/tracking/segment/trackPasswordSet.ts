import { trackSegmentEvent } from './index';

export default function trackPasswordSet () {
	trackSegmentEvent( 'Password Set' );
}
