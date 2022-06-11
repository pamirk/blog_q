import React from 'react';
import PropTypes from 'prop-types';
import { getSrcSet } from '../../helpers/images';
import Image from '../../components/Image/Image';
import styles from './EmailListFeaturedImage.module.scss';

const EmailListFeaturedImage = ( { image } ) => {
	if ( !image ) {
		return null;
	}

	const { sourceUrl, altText } = image;
	const srcSetParams = [
		150, // mobile
		300, // mobile @ 2x
		350, // desktop
		700, // desktop @ 2x
	];

	const srcSet = getSrcSet( sourceUrl, srcSetParams );
	const sizes = [
		'(min-width: 48em) 350px',
		'150px',
	];

	return (
		<div className={styles.container}>
			<Image
				width={646}
				height={1320}
				src={sourceUrl}
				alt={altText}
				sizes={sizes}
				srcSet={srcSet}
			/>
		</div>
	);
};

EmailListFeaturedImage.propTypes = {
	image: PropTypes.shape( {
		sourceUrl: PropTypes.string,
		altText: PropTypes.string,
	} ),
};

export default EmailListFeaturedImage;
