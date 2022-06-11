import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withAmp from '../../../helpers/wrappers/withAmp';

const EmbedSpotify = ( { url, amp } ) => {
	// The embed URL is the same as the permalink, but with /embed/ before the path
	const embedUrl = url.replace( '.com/', '.com/embed/' );

	if ( amp ) {
		return (
			<Fragment>
				<Helmet>
					<script async={undefined} custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
				</Helmet>
				<amp-iframe
					src={embedUrl}
					width="300"
					height="380"
					frameBorder="0"
					layout="responsive"
					sandbox="allow-scripts allow-same-origin"
				>
				</amp-iframe>
			</Fragment>
		);
	}

	return (
		<div className="spotify-embed social-embed">
			<iframe
				src={embedUrl}
				width="300"
				height="380"
				allow="encrypted-media"
				allowtransparency="true"
				frameBorder="0"
				title="Embedded Spotify player"
			></iframe>
		</div>
	);
};

EmbedSpotify.propTypes = {
	amp: PropTypes.bool.isRequired,
	url: PropTypes.string.isRequired,
};

export default withAmp()( EmbedSpotify );
