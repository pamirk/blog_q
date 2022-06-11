import { MEMBERSHIP_SIGNUP } from '../../../helpers/tracking/actions';
import { GTM, TRACKING } from '../../../helpers/types/tracking';

// A helper function for creating GTM tracking functions for the cancelation flow
export const makeTrackingAction = ( { eventAction, eventLabel = 'settings' } ) => overrides => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event: 'Cancelation flow',
			eventAction,
			eventCategory: MEMBERSHIP_SIGNUP,
			eventLabel,
			...overrides,
		},
	},
	type: 'TRACK_CANCELATION_FLOW',
} );
