import { useEffect } from 'react';
import { handlers } from 'helpers/wrappers/withPostMessage';

/**
 * A simple hook to help implement postMessage communication. This piggybacks on
 * top of withPostMessage, using the same global event listener and shared
 * handlers array. This means we can have a single listener instead of one per
 * frame. Eventually we might phase out withPostMessage and bring that shared
 * listener here.
 */
export default (
	/** Name of the event you would like to listen to */
	eventName: string,
	/** Callback to fire when the listened-for event arrives */
	eventHandler: ( data: any ) => void,
	/** Frame ID to restrict listening to a specific frame */
	frameId?: string,
	/** If there may be multiple listeners on an `eventName`, provide a componentId
	  * to ensure the listener for another component isn’t prematurely removed. */
	componentId?: string
) => {
	useEffect( () => {
		// The withPostMessage HOC generates a component ID to remove all listeners
		// that were added by the component on unmount. Usually this hook will only be used
		// with a single listener and a single iframe, so we will use the frame ID as
		// a fallback for the component ID.
		//
		// Push into the shared handlers array. When a message is posted to the
		// parent, it will call the event handler if (1) it matches the event name
		// and (2) it matches the frameId, if supplied.
		handlers.add( { componentId: componentId ?? frameId, eventName, eventHandler, frameId } );

		// On unmount, remove this listener from the shared handlers array.
		return () => {
			handlers.remove( frameId );
		};
	}, [ eventHandler, eventName, frameId, componentId ] );
};
