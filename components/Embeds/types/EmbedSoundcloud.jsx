import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withAmp from '../../../helpers/wrappers/withAmp';

const EmbedSoundcloud = ( { amp, embedUrl, resourceId, resourceType } ) => {
	if ( amp ) {

		if ( resourceId && resourceType ) {

			// soundcloud-amp expects either a data-trackid or data-playlistid prop containing the uid
			const soundcloudAmpProps = {
				[ resourceType === 'track' ? 'data-trackid' : 'data-playlistid' ]: parseInt( resourceId, 10 ),
			};

			return (
				<Fragment>
					<Helmet>
						<script async={undefined} custom-element="amp-soundcloud" src="https://cdn.ampproject.org/v0/amp-soundcloud-0.1.js"></script>
					</Helmet>
					<amp-soundcloud
						{...soundcloudAmpProps}
						layout="fixed-height"
						height="500"
					>
					</amp-soundcloud>
				</Fragment>
			);
		}

		// We couldn't extract the data we need to use amp-soundcloud, so we'll fall back to amp-iframe
		return (
			<Fragment>
				<Helmet>
					<script async={undefined} custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
				</Helmet>
				<amp-iframe
					src={embedUrl}
					width="620"
					height="500"
					frameBorder="0"
					layout="responsive"
					sandbox="allow-scripts allow-same-origin"
				>
				</amp-iframe>
			</Fragment>
		);
	}

	return (
		<div className="soundcloud-embed social-embed">
			<iframe
				src={embedUrl}
				width="100%"
				height="300"
				allowFullScreen={true}
				frameBorder="0"
				scrolling="no"
				title="Embedded SoundCloud player"
			></iframe>
		</div>
	);
};

EmbedSoundcloud.propTypes = {
	amp: PropTypes.bool.isRequired,
	embedUrl: PropTypes.string.isRequired,
	resourceId: PropTypes.string,
	resourceType: PropTypes.string,
};

export default withAmp()( EmbedSoundcloud );
