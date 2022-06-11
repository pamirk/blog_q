import React from 'react';
import PropTypes from 'prop-types';
import withAmp from '../../../helpers/wrappers/withAmp';
import styles from './EmbedAtlas.module.scss';
import classnames from 'classnames/bind';
import Image from 'next/image'

const cx = classnames.bind( styles );
const getImageSrc = ( url ) => `${url.replace( /\/charts\//, '/i/atlas_' )}.png`;

const EmbedAtlas = ( { url, width, height } ) => {
	const match = url.match( /https:\/\/(www\.theatlas|atlas\.qz)\.com\/charts\/([A-Za-z0-9_-]+)(\/)?/ );

	if ( match === null ) {
		return null;
	}

	const [ ,, id ] = match;

	return (
		<div
			className={cx( 'atlas-embed', 'atlas-chart', 'embed' )}
			data-id={id}
			data-width={width}
			data-height={height}
			role="presentation"
			aria-label="Embedded chart from TheAtlas.com"
		>
			<Image src={getImageSrc( url )} alt="Chart from TheAtlas.com" />
		</div>
	);
};

// AMP version of Atlas embed is just showing the image
const EmbedAtlasAmp = ( { url, width, height } ) => {

	const aspectRatio = width / height;

	return (
		<Image
			alt={''}
			src={getImageSrc( url )}
			width={aspectRatio}
			height={1}
			layout="responsive">
		</Image>
	);
};

EmbedAtlas.propTypes = EmbedAtlasAmp.propTypes = {
	height: PropTypes.number,
	url: PropTypes.string.isRequired,
	width: PropTypes.number,
};

EmbedAtlas.defaultProps = EmbedAtlasAmp.defaultProps = {
	width: 640,
	height: 400,
};

export default withAmp( EmbedAtlasAmp )( EmbedAtlas );
