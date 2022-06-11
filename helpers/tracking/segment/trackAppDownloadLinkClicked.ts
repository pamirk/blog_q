import { trackSegmentEvent } from './index';

export default function trackAppDownloadLinkClicked () {
	trackSegmentEvent( 'Request App Download Link' );
}
