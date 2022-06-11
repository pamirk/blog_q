import { GTM, TRACKING } from '../../../../helpers/types/tracking';

const event = 'EmailSignup';
const eventCategory = 'Email signup';

export const viewNewsletterModule = ( { listSlugs, location } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event,
			eventAction: 'View email module',
			eventCategory,
			eventLabel: location ? `${listSlugs.join( '|' )}|${location}` : listSlugs.join( '|' ),
		},
	},
	type: 'VIEW_NEWSLETTER_MODULE',
} );

export const viewNewsletterList = ( { eventLabel } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event,
			eventAction: 'View multi-signup screen',
			eventCategory,
			eventLabel,
		},
	},
	type: 'VIEW_NEWSLETTER_LIST',
} );

export const clickNewsletterModule = ( { listSlugs, location } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event,
			eventAction: 'Click email input',
			eventCategory,
			eventLabel: location ? `${listSlugs.join( '|' )}|${location}` : listSlugs.join( '|' ),
		},
	},
	type: 'CLICK_NEWSLETTER_MODULE',
} );

export const clickNewsletterCheckbox = ( { listSlug } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event,
			eventAction: 'Click email checkbox',
			eventCategory,
			eventLabel: listSlug,
		},
	},
	type: 'CLICK_NEWSLETTER_CHECKBOX',
} ) ;

export const submitNewsletterModule = ( { listSlugs, location } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event,
			eventAction: 'Submit email signup',
			eventCategory,
			eventLabel: location ? `${listSlugs.join( '|' )}|${location}` : listSlugs.join( '|' ),
		},
	},
	type: 'SUBMIT_NEWSLETTER_MODULE',
} );

export const instantNewsletterSignup = ( { listSlug }, { altIdHash } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event,
			eventAction: 'instant',
			eventCategory,
			eventLabel: listSlug,
			AltIdHash: altIdHash,
		},
	},
	type: 'INSTANT_EMAIL_SIGNUP',
} );

export const submitEmailExchange = ( { context } ) => ( {
	[ TRACKING ]: {
		[ GTM ]: {
			event,
			eventAction: 'Submit email exchange',
			eventCategory: 'Paywall',
			eventLabel: context,
		},
	},
	type: 'SUBMIT_EMAIL_REGWALL',
} );
