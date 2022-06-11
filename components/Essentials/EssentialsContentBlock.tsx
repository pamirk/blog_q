import React, { ComponentProps } from 'react';
import mergeRefs from 'react-merge-refs';
import { ContentBlock } from 'components/ContentBlocks/ContentBlocks';
import { useTrackingOnInnerHtmlLinkClick } from 'helpers/hooks/useTracking';
import { trackEssentialsLinkClick } from 'helpers/tracking/actions/interaction';
import { useInnerHTMLEssentialsLinkTracking } from 'helpers/tracking/segment/hooks/useInnerHTMLEssentialsLinkTracking';

/**
 * Wrapper component for `ContentBlock` that adds additional tracking hooks
 * for link clicks inside Essentials components (`CardDeck` and `Essentials`).
 */
export function EssentialsContentBlock(
	props: ComponentProps<typeof ContentBlock> & {
		card_index?: number,
		card_title?: string,
		collection_id?: number,
		collection_title?: string,
		sponsor_name?: string,
		stack_index?: number,
		stack_size: number,
		trackingContext?: string,
	}
) {

	// Two link click tracking events — Scott wants us to continue sending to GA even while
	// adding the new Segment link tracking event. Ideally, we should remove the GA tracking
	// as soon as possible.

	const googleLinkTrackingRef = useTrackingOnInnerHtmlLinkClick( trackEssentialsLinkClick, { eventLabel: props.trackingContext } );

	const segmentLinkTrackingRef = useInnerHTMLEssentialsLinkTracking( {
		card_id: props.id || undefined,
		card_index: props.card_index || 1,
		card_title: props.card_title,
		collection_id: props.collection_id || -1,
		collection_title: props.collection_title,
		sponsor_name: props.sponsor_name,
		stack_index: props.stack_index || 1,
		stack_size: props.stack_size,
	} );

	return (
		<div ref={mergeRefs( [ googleLinkTrackingRef, segmentLinkTrackingRef ] )}>
			<ContentBlock {...props} />
		</div>
	);
}
