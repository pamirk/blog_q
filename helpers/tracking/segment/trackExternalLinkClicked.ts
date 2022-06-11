import { trackSegmentEvent } from './index';

export default function trackExternalLinkClicked ( properties: { anchor_text?: string, url?: string } ) {
	trackSegmentEvent( 'External Link Clicked', properties );
}
