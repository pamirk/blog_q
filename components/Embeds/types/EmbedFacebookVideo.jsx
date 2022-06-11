import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withAmp from '../../../helpers/wrappers/withAmp';

const EmbedFacebookVideo = ( { url, width } ) => (
	<div
		className="fb-video social-embed"
		data-allowfullscreen="true"
		data-href={url}
		data-show-text="false"
		data-width={width}
	/>
);

EmbedFacebookVideo.defaultProps = {
	width: 620,
};

EmbedFacebookVideo.propTypes = {
	url: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,
};

const EmbedFacebookVideoAmp = ( { url } ) => (
	<Fragment>
		<Helmet>
			<script async={undefined} custom-element="amp-facebook" src="https://cdn.ampproject.org/v0/amp-facebook-0.1.js" />
		</Helmet>
		<amp-facebook
			width="552"
			height="310"
			data-embed-as="video"
			layout="responsive"
			data-href={url}
		/>
	</Fragment>
);

EmbedFacebookVideoAmp.propTypes = {
	url: PropTypes.string.isRequired,
};

export default withAmp( EmbedFacebookVideoAmp )( EmbedFacebookVideo );
