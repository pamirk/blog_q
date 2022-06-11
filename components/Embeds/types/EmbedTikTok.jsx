import React from 'react';
import PropTypes from 'prop-types';
import { withAmp } from '../../../helpers/wrappers';

// TikTok is not supported in Google AMP.
export const EmbedTikTok = ( { url } ) => {
	const matches = url.match( /\/video\/([0-9]+)/ );
	if ( ! matches ) {
		return null;
	}

	const [ , id ] = matches;

	// Not sandboxing this iframe since it lives on another domain.
	return (
		<iframe
			height="800"
			src={`https://www.tiktok.com/embed/v2/${id}`}
			style={{ border: 0 }}
			title={url}
			width="100%"
		/>
	);
};

EmbedTikTok.propTypes = {
	url: PropTypes.string.isRequired,
};

export default withAmp( () => null )( EmbedTikTok );
