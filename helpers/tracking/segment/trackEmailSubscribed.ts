import { trackSegmentEvent } from './index';
import { EmailListSlug } from 'config/emails';

export default function trackEmailSubscribed( properties: {
	conversionFlow: string
	siteLocation: string
	// Must be an array of valid email list slugs as defined in
	// config/emails#emailList
	subscribedToEmails: EmailListSlug[]
} ) {
	const { conversionFlow, siteLocation, subscribedToEmails } = properties;

	trackSegmentEvent( 'Email Subscribed', {
		conversion_flow: conversionFlow,
		site_location: siteLocation,
		subscribed_to_emails: subscribedToEmails,
	} );
}
