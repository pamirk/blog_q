import { GTM, TRACKING } from 'helpers/types/tracking';

export function trackEssentialsLinkClick ( { eventLabel }, { destinationHeadline, destinationUrl } ) {
	return {
		[ TRACKING ]: {
			[ GTM ]: {
				destinationHeadline,
				destinationUrl,
				event: 'Interaction',
				eventAction: 'Essentials link clicked',
				eventCategory: 'Interaction',
				eventLabel,
			},
		},
		type: 'TRACK_ESSENTIALS_LINK_CLICK',
	};
}

export function trackArticleEssentialsView( { eventLabel } ) {
	return {
		[ TRACKING ]: {
			[ GTM ]: {
				event: 'Interaction',
				eventAction: 'View Essential',
				eventCategory: 'Interaction',
				eventLabel,
			},
		},
		type: 'VIEW_ARTICLE_ESSENTIALS',
	};
}

export function trackEssentialsShowMoreClick ( _, { eventLabel } ) {
	return {
		[ TRACKING ]: {
			[ GTM ]: {
				event: 'Interaction',
				eventAction: 'Expand Essential',
				eventCategory: 'Interaction',
				eventLabel,
			},
		},
		type: 'SHOW_MORE_ESSENTIALS_NUGS',
	};
}
