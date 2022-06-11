import React from 'react';
import PropTypes from 'prop-types';
import QuartzObject from '../../../components/QuartzObject/QuartzObject';

const EmbedObjects = ( { url } ) => {

	if ( !url ) {
		return null;
	}

	const match = url.match( /(objects.qz\.com\/.*object\/)([^\?&/"#'>]+)/ );
	if ( !match ) {
		return null;
	}

	const [ ,, id ] = match;

	return (
		<QuartzObject id={id}/>
	);
};

EmbedObjects.propTypes = {
	url: PropTypes.string.isRequired,
};

export default EmbedObjects;
