import { useEffect } from 'react';
import {useRouter as useLocation} from 'next/router'
import { identifySegmentUser, trackPageViewed } from 'helpers/tracking/segment';
import useClientSideUserData from 'helpers/hooks/useClientSideUserData';
import {
	USER_COMPANY,
	USER_EMAIL,
	USER_ID,
	USER_NAME,
	USER_TITLE,
} from 'helpers/types/account';

// This component centralizes calls we make to Segment as a result
// of side-effects at the App level. Generally this is anything that
// is NOT the result of an explicit action taken by the user.
//
// A good use-case for this component is identifying the user. Segment
// has a distinct `identify` method which allows us to pass along traits
// about the user as we learn them. It doesn't matter when or why we
// learn these traits, and they are separate from tracking events. We
// may fire off many identification calls to Segment during the course
// of a session as we learn more about the user.
//
// You probably don't want to use this component to track an event
// that's defined in the Tracking Plan (https://app.segment.com/quartz-media/protocols/tracking-plans/rs_1neytYqHJ7WKYBw1tVml9Vj73no).
// These events are usually fired explicitly using Segment's .track
// method, often as a result of an explicit user action.

export default function SegmentTracking() {
	const { pathname } = useLocation();
	const { getUserAttribute, isMember } = useClientSideUserData();
	const userId = getUserAttribute( USER_ID );
	const userTraits = {
		company_name: getUserAttribute( USER_COMPANY ),
		email: getUserAttribute( USER_EMAIL ),
		first_name: getUserAttribute( USER_NAME ),
		job_role: getUserAttribute( USER_TITLE ),
	};

	// Fire the page tracking event when the path changes
	useEffect( () => {
		trackPageViewed( { isMember, path: pathname } );
	}, [ isMember, pathname ] );

	// Identify the user when we become aware of an identifying trait
	useEffect( () => {
		const haveTrait = !! Object.values( userTraits ).find( Boolean );
		if ( userId || haveTrait ) {
			// We know the user's ID or have at least one truthy trait, we
			// can therefore identify the user in Segment.
			identifySegmentUser( userId || null, userTraits );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ userId, ...Object.values( userTraits ) ] );

	return null;
}
