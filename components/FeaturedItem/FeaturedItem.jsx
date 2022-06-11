import React from 'react';
import PropTypes from 'prop-types';
import styles from './FeaturedItem.module.scss';
import { getSrcSet } from '../../helpers/images';
import { resizeWPImage } from '../../@quartz/js-utils';
import ImageLoader from '../../components/ImageLoader/ImageLoader';
import Link from '../../components/Link/Link';
import { TextGroup } from '../../@quartz/interface';

export const FeaturedItem = ( { description, destination, featuredImage, title } ) => {
	let image = null;

	if ( featuredImage ) {
		const { sourceUrl } = featuredImage;

		const srcSetParams = [
			[ 220, 220, true ],
			[ 400, 400, true ],
			[ 570, 570, true ],
			[ 640, 640, true ],
		];
		const srcSet = getSrcSet( sourceUrl, srcSetParams );
		const fallbackSrc = resizeWPImage( sourceUrl, 220, 220, true );

		const sizes = [
			'(min-width: 100em) 640px',
			'(min-width: 64em) 570px',
			'(min-width: 48em) 400px',
			'220px',
		];

		image = (
			<ImageLoader
				width={220}
				height={220}
				alt=""
				sizes={sizes}
				src={fallbackSrc}
				srcSet={srcSet}
				aspectRatio={1}
				lazyLoad={true}
				disableBackground={true}
			/>
		);
	}

	return (
		<li className={styles.container}>
			<Link className={styles.link} to={destination}>
				<div className={styles.image}>
					{image}
				</div>
				<div className={styles.textGroup}>
					<TextGroup
						size="extra-large"
						tagline={description}
						title={title}
					/>
				</div>
			</Link>
		</li>
	);
};

FeaturedItem.propTypes = {
	description: PropTypes.string,
	destination: PropTypes.string,
	featuredImage: PropTypes.shape( {
		sourceUrl: PropTypes.string,
	} ),
	title: PropTypes.string,
};

export default FeaturedItem;
