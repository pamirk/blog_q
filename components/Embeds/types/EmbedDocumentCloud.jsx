import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withAmp from '../../../helpers/wrappers/withAmp';

const EmbedDocumentCloud = ( { amp, url } ) => {
	const embedUrl = `${url}?embed=true`;

	if ( amp ) {
		return (
			<Fragment>
				<Helmet>
					<script async={undefined} custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
				</Helmet>
				<amp-iframe
					src={embedUrl}
					width="300"
					height="415"
					frameBorder="0"
					layout="responsive"
					sandbox="allow-scripts allow-same-origin"
				>
				</amp-iframe>
			</Fragment>
		);
	}

	return (
		<div className="social-embed documentcloud-embed">
			<iframe
				src={embedUrl}
				width="100%"
				height="820"
				allowFullScreen={true}
				frameBorder="0"
				title="Embedded DocumentCloud document"
			></iframe>
		</div>
	);
};

EmbedDocumentCloud.propTypes = {
	amp: PropTypes.bool.isRequired,
	url: PropTypes.string.isRequired,
};

export default withAmp()( EmbedDocumentCloud );
