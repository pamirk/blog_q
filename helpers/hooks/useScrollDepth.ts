import { useEffect, useRef, useState } from 'react';
import { addHandler, removeHandler } from 'helpers/wrappers/withScroll';
import useInView from './useInView';

// The scroll milestones we care about. NOTE: We are not guaranteed to hit each
// milestone as the user scrolls depending on how fast they scroll and their
// browser's performance.
const milestoneCount = 8;

export default function useScrollDepth(): [( el: HTMLElement | null ) => void, number | null]  {
	const domRef = useRef<HTMLElement | null>( null );
	const [ milestone, setMilestone ] = useState<number | null>( null );

	const [ setEl, inView ] = useInView( {
		refFunc: el => domRef.current = el,
	} );

	useEffect( () => {
		if ( ! domRef.current || ! inView || 1 === milestone ) {
			return;
		}

		// Just became visible? Set to first milestone.
		if ( null === milestone ) {
			setMilestone( 0 );
			return;
		}

		const id = addHandler( ( scrollProps ) => {
			if ( ! domRef.current ) {
				return;
			}

			const { height, top } = domRef.current.getBoundingClientRect();
			const offset = scrollProps.innerHeight - top;
			const depth = Math.min( 1, Math.max( 0, offset / height ) );

			// Get closest milestone without going over.
			const newMilestone = Math.floor( depth * milestoneCount ) / milestoneCount;

			if ( newMilestone > milestone ) {
				setMilestone( newMilestone );
			}
		} );

		return () => removeHandler( id );
	}, [ inView, milestone ] );

	return [ setEl, milestone ];
}
