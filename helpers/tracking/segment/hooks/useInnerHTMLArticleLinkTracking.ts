import { useInnerHTMLSegmentLinkTracking } from './useInnerHTMLSegmentLinkTracking';
import trackExternalLinkClicked from '../trackExternalLinkClicked';

/** Tracks clicks on anchor links inside articles that lead to external pages. */
export function useInnerHTMLArticleLinkTracking() {
	return useInnerHTMLSegmentLinkTracking( {
		trackingFunction: trackExternalLinkClicked,
		ignoreInternalLinks: true,
	} );
}
