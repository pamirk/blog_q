import { trackSegmentEvent } from './index';
import { BlockNameEnum, CollectionPartsFragment } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

/**
 * Determines the set (exclusive, alphabetically sorted) of `BlockNameEnum` types
 * contained in a given Nug or Collection of Nugs.
 */
export function blockTypesSet( props: {
	collection: CollectionPartsFragment[ 'blocks' ],
} ): BlockNameEnum[] | undefined {
	let blockTypes: BlockNameEnum[] = [];
	props.collection?.forEach( card => {
		if ( card?.connections?.[0]?.__typename === 'Nug' ) {
			const blocks = card.connections[0].blocks?.map( block => block?.type ).filter( notUndefinedOrNull );
			if ( blocks ) {
				blockTypes =  Array.from( new Set( [ ...blockTypes, ...blocks ] ) ).sort();
			}
		}
	} );
	if ( ! blockTypes.length ) {
		return undefined;
	}
	return blockTypes;
}

export type EssentialsCardViewedEventProperties = {
	/** Set of block types this card contains (exclusive, alphabetical) */
	block_types?: BlockNameEnum[],
	/** Nug ID in the CMS */
	card_id?: string,
	/** Card index in the stack, one-based */
	card_index: number,
	/** The title of the card */
	card_title?: string,
	/** The ID associated with this stack (Collection) in the CMS */
	collection_id: number,
	/** The title of this stack (Collection) */
	collection_title?: string,
	/** The sponsor name from the CMS, if this stack is sponsored */
	sponsor_name?: string,
	/** The current stack’s position among other stacks in the below-article placement, one-based */
	stack_index?: number,
	/** The number of cards in the current stack */
	stack_size: number,
}

/**
 * Corresponds to the `Essentials Card Viewed` event in the Segment schema.
 * Meant for tracking views of essentials card stacks (`CardDeck.tsx`),
 * typically found below articles and more rarely in inline ad slots
 * when an article has sponsored Essentials.
 */
export function trackEssentialsCardViewed( properties: EssentialsCardViewedEventProperties ) {
	trackSegmentEvent( 'Essentials Card Viewed', properties );
}

export type EssentialsFeedViewedEventProperties = {
	/** The unique block types from all cards within this feed. (exclusive, alphabetical) */
	block_types?: BlockNameEnum[],
	/** The total number of cards in this feed */
	card_count?: number,
	/** The IDs of all cards presented in this feed, ordered positionally */
	card_id?: string[],
	/** The ID associated with this Collection in the CMS */
	collection_id?: number,
	/** The title of this stack (Collection) */
	collection_title?: string,
}

/**
 * Corresponds to the `Essentials Card Viewed` event in the Segment schema.
 * Meant for tracking views of essentials card stacks (`CardDeck.tsx`),
 * typically found below articles and more rarely in inline ad slots
 * when an article has sponsored Essentials.
 */
export function trackEssentialsFeedViewed( properties: EssentialsFeedViewedEventProperties ) {
	trackSegmentEvent( 'Essentials Feed Viewed', properties );
}

export type EssentialsCardClickedEventProperties = {
	anchor_text?: string,
	card_id?: string,
	card_index: number,
	card_title?: string,
	collection_id: number,
	collection_title?: string,
	sponsor_name?: string,
	stack_index?: number,
	stack_size: number,
	url?: string,
}

/**
 * Tracks link clicks inside Essentials cards. Does not include clicks inside iframes or
 * taps to advance to the next card.
 */
export function trackEssentialsCardClicked( properties: EssentialsCardClickedEventProperties ) {
	trackSegmentEvent( 'Essentials Card Clicked', properties );
}
