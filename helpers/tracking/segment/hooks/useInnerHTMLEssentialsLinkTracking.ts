import {useInnerHTMLSegmentLinkTracking} from './useInnerHTMLSegmentLinkTracking';
import {EssentialsCardClickedEventProperties, trackEssentialsCardClicked} from '../trackEssentials';

/** Tracks clicks on anchor links inside Essentials cards or landing pages. */
export function useInnerHTMLEssentialsLinkTracking(props: Omit<EssentialsCardClickedEventProperties, 'anchor_text' | 'url'>) {

    return useInnerHTMLSegmentLinkTracking({
        // @ts-ignore
        trackingFunction: trackEssentialsCardClicked,
        context: props,
    });
}
