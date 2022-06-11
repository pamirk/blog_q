import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withAmp from '../../../helpers/wrappers/withAmp';
import EmbedEmbedly from './EmbedEmbedly';

const EmbedRedditAmp = ( { url } ) => (
	<Fragment>
		<Helmet>
			<script async={undefined} custom-element="amp-reddit" src="https://cdn.ampproject.org/v0/amp-reddit-0.1.js" />
		</Helmet>
		<amp-reddit
			layout="responsive"
			width="400"
			height="300"
			data-embedtype="post"
			data-src={url}
		></amp-reddit>
	</Fragment>
);

EmbedRedditAmp.propTypes = {
	url: PropTypes.string.isRequired,
};

export default withAmp( EmbedRedditAmp )( EmbedEmbedly );
