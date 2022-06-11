import { useEffect } from 'react';
import { EditionName } from '@quartz/content';

/**
 * Send messages to the iOS app via a WebKit script message.
*/
export default function useAppMessage( { hasPaywall, logoVariant }: {
	hasPaywall?: boolean;
	logoVariant?: EditionName;
} ) {
	interface WebKitWindow extends Window {
		webkit?: any;
	}
	/* eslint-disable @typescript-eslint/consistent-type-assertions */
	useEffect( () => {
		if ( undefined !== hasPaywall ) {
			( window as WebKitWindow )?.webkit?.messageHandlers?.paywallDisplayed?.postMessage?.( hasPaywall );
		}
	}, [ hasPaywall ] );
	useEffect( () => {
		if ( undefined !== logoVariant ) {
			( window as WebKitWindow )?.webkit?.messageHandlers?.logoVariant?.postMessage?.( logoVariant.toLowerCase() );
		}
	}, [ logoVariant ] );
}
