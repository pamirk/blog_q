import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withAmp from '../../../helpers/wrappers/withAmp';

const EmbedFacebook = ( { url, width } ) => (
	<div
		className="fb-post social-embed"
		data-href={url}
		data-width={width}
	/>
);

EmbedFacebook.defaultProps = {
	width: 750,
};

EmbedFacebook.propTypes = {
	url: PropTypes.string.isRequired,
	width: PropTypes.number,
};

const EmbedFacebookAmp = ( { url } ) => (
	<Fragment>
		<Helmet>
			<script async={undefined} custom-element="amp-facebook" src="https://cdn.ampproject.org/v0/amp-facebook-0.1.js" />
		</Helmet>
		<amp-facebook
			width="552"
			height="310"
			layout="responsive"
			data-href={url}
		/>
	</Fragment>
);

EmbedFacebookAmp.propTypes = {
	url: PropTypes.string.isRequired,
};

export default withAmp( EmbedFacebookAmp )( EmbedFacebook );
