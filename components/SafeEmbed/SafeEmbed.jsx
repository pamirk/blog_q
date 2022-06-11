import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SafeEmbed.module.scss';
import { usePostMessage } from '../../helpers/hooks';
import { getHostname, getPath } from '../../helpers/urls';

// This event name must match the name of the event dispatched from inside the
// iframe. If you change this, you must also change the WordPress plugin that
// will dispatch the event.
const eventName = 'SafeEmbedHeight';

/**
 * SafeEmbed loads third-party embeds using a special iframe powered by
 * WordPress. WordPress already has the ability to use oEmbed to load specific
 * markup for a supported embed provider (e.g., Twitter). However, rendering
 * this third-party markup directly on qz.com is a security risk, since it would
 * have access to our DOM, cookies, analytics data layer, etc.
 *
 * Instead, we wrote a custom WordPress plugin to render this markup on
 * cms.qz.com, which we can then render in an iframe. Since qz.com and
 * cms.qz.com are different origins, the security risks are mitigated. We also
 * use postMessage to the frame with an initial height and listens for requests
 * to update the height.
 */
const SafeEmbed = ( { initialHeight, postId, url } ) => {
	const [ height, setHeight ] = useState( initialHeight || 'auto' );

	// Listen for height change events and update height if it has changed.
	const listener = ( { data = {} } ) => {
		if ( height !== data.height ) {
			setHeight( data.height );
		}
	};

	// Remove protocol and querystring. The double slashes in the protocol are
	// sometimes condensed to one by browsers and we always want to transact with
	// HTTPS anyway. The querystring get stripped since it becomes a querystring
	// on the parent URL. Remove trailing slash since it will be removed by
	// WordPress rewrites.
	const bareUrl = `${getHostname( url )}${getPath( url )}`.replace( /\/+$/, '' );

	// Use the URL as the frame ID.
	usePostMessage( eventName, listener, bareUrl );

	return (
		<iframe
			className={styles.container}
			height={height}
			src={`https://cms.qz.com/embed-sandbox/${postId}/${bareUrl}`}
			title={bareUrl}
		/>
	);
};

SafeEmbed.propTypes = {
	initialHeight: PropTypes.number,
	postId: PropTypes.number.isRequired,
	url: PropTypes.string.isRequired,
};

export default SafeEmbed;
