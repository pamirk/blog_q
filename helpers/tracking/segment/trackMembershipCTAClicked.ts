import { trackSegmentEvent } from './index';

export default function trackMembershipCTAClicked( properties: { siteLocation: string } ) {
	trackSegmentEvent( 'Membership CTA Clicked', { site_location: properties.siteLocation } );
}
