import { getUtmQueryParams } from 'helpers/queryParams';

interface SegmentWindow extends Window {
	// analytics?: SegmentAnalytics.AnalyticsJS;
	analytics?: any;
}

// Event names and identifying traits must be defined in the Segment
// Tracking Plan for qz.com:
// https://app.segment.com/quartz-media/protocols/tracking-plans/rs_1neytYqHJ7WKYBw1tVml9Vj73no
type EventName = (
	'Article Consumed' |
	'Coupon Applied' |
	'Coupon Declined' |
	'Coupon Code Submitted' |
	'Email Captured In Subscription Flow' |
	'Email Subscribed' |
	'Email Link Clicked' |
	'Essentials Card Clicked' |
	'Essentials Card Viewed' |
	'Essentials Feed Viewed' |
	'External Link Clicked' |
	'Membership CTA Clicked' |
	'Order Completed' |
	'Payment Info Entered' |
	'Paywall Fired' |
	'Password Set' |
	'Request App Download Link' |
	'Signed Out'
);

interface IdentifyingTraits {
	company_name?: string
	email?: string
	first_name?: string
	job_role?: string
}

type SegmentIdentifyMethod = {
	name: 'identify'
	traits?: IdentifyingTraits
	userId?: number | null
}

type SegmentTrackMethod = {
	name: 'track'
	eventName: EventName
	eventProperties?: Record<string, unknown>
}

type SegmentResetMethod = {
	name: 'reset'
}

type SegmentPageMethod = {
	name: 'page'
	eventProperties?: Record<string, unknown>
}

// Represents a method on Segment's Analytics.js object (window.analytics)
// See: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/
type SegmentMethod = SegmentIdentifyMethod | SegmentPageMethod | SegmentResetMethod | SegmentTrackMethod;

const segmentMethodQueue: SegmentMethod[] = [];

function callSegmentMethod( method: SegmentMethod ) {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const windowWithSegment = window as SegmentWindow;

	if ( windowWithSegment.analytics ) {
		switch ( method.name ) {
			case 'identify':
				// Must cast traits to any due to seemingly erroneous parameter
				// type for identify method in SegmentAnalytics interface
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
				windowWithSegment.analytics.identify( method.userId?.toString(), method.traits as any );
				break;
			case 'page':
				windowWithSegment.analytics.page( method.eventProperties );
				break;
			case 'reset':
				windowWithSegment.analytics.reset();
				break;
			case 'track':
				windowWithSegment.analytics.track( `${method.eventName}`, method.eventProperties );
		}
	}
}

function queueOrCallSegmentMethod( method: SegmentMethod ) {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const windowWithSegment = window as SegmentWindow;

	if ( ! windowWithSegment.analytics ) {
		// Analytics.js library not available, enqueue the method
		segmentMethodQueue.push( method );
	} else {
		// Send any queued events and the new method
		let queuedMethod;
		while ( ( queuedMethod = segmentMethodQueue.shift() ) !== undefined ) {
			callSegmentMethod( queuedMethod );
		}

		callSegmentMethod( method );
	}
}

export function resetSegment() {
	queueOrCallSegmentMethod( { name: 'reset' } );
}

export function identifySegmentUser( userId: number | null, traits: IdentifyingTraits ) {
	queueOrCallSegmentMethod( { name: 'identify', userId, traits } );
}

export function trackPageViewed( properties?: { isMember: boolean, path: string } ) {
	const utmParams = getUtmQueryParams();
	queueOrCallSegmentMethod( { name: 'page', eventProperties: {
		membership_state: properties?.isMember ? 'Member' : 'Non-Member',
		path: properties?.path,
		...utmParams,
	} } );
}

// Do not call this function directly from your component!
//
// Instead, create an event-tracking wrapper in a new file, with a
// well-defined interface, and call it from there
export function trackSegmentEvent( eventName: EventName, properties?: Record<string, unknown> ) {
	// add utm params to every event's properties
	const utmParams = getUtmQueryParams();
	queueOrCallSegmentMethod( {
		name: 'track',
		eventName,
		eventProperties: {
			...utmParams,
			...properties,
		},
	} );
}
