import React from 'react';
import PropTypes from 'prop-types';

const EmbedEmbedly = ( { url } ) => (
	<div className="inline-embedly-card social-embed">
		<a className="embedly-card" href={url}>{url}</a>
	</div>
);

EmbedEmbedly.propTypes = {
	url: PropTypes.string.isRequired,
};

export default EmbedEmbedly;
