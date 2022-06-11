import React from 'react';
import PropTypes from 'prop-types';
import YouTube from '../../../components/YouTube/YouTube';

const EmbedYoutube = ( { url } ) => {

	if ( !url ) {
		return null;
	}

	const match = url.match( /(youtu\.be\/|youtube\.com\/.*v=)([^\?&"#'>]+)/ );
	if ( !match ) {
		return null;
	}

	const [ ,, id ] = match;

	return (
		<YouTube video={{ id }}/>
	);
};

EmbedYoutube.propTypes = {
	url: PropTypes.string.isRequired,
};

export default EmbedYoutube;
