import useDeepCompareEffect from 'helpers/hooks/useDeepCompareEffect';
import { useInView } from 'helpers/hooks';
import {
	EssentialsCardViewedEventProperties,
	EssentialsFeedViewedEventProperties,
	trackEssentialsCardViewed,
	trackEssentialsFeedViewed,
} from '../trackEssentials';

/**
 * Helper hook for `trackEssentialsCardViewed` in components.
 * Handles viewport visibility tracking for the first card and prevents duplicate events from
 * firing in reaction to an unrelated re-render.
 */
export function useEssentialsCardViewTracking(
	properties: EssentialsCardViewedEventProperties
) {
	const [ ref, visible ] = useInView();

	useDeepCompareEffect( () => {
		if ( visible ) {
			trackEssentialsCardViewed( properties );
		}
	}, [ properties, visible ] );

	return ref;
}

/**
 * Helper hook for `trackEssentialsFeedViewed` in components.
 * Handles viewport visibility tracking for the first card and prevents duplicate events from
 * firing in reaction to an unrelated re-render.
 */
export function useEssentialsFeedViewTracking(
	properties: EssentialsFeedViewedEventProperties
) {
	const [ ref, visible ] = useInView();

	useDeepCompareEffect( () => {
		if ( visible ) {
			trackEssentialsFeedViewed( properties );
		}
	}, [ properties, visible ] );

	return ref;
}
