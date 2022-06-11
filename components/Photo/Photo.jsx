import React from 'react';
import PropTypes from 'prop-types';
import { getSrcSet } from '../../helpers/images';
import { resizeWPImage } from '../../@quartz/js-utils';
import classnames from 'classnames/bind';
import styles from './Photo.module.scss';
import ImageLoader from '../../components/ImageLoader/ImageLoader';

const cx = classnames.bind( styles );

const Photo = ( { alt, src, title, className, ratio, widths } ) => {
	const breakpoints = [ '48em', '64em', '75em' ];
	const srcSetParams = widths.map( width => [ width, Math.round( width / ratio ) ] );
	const srcSet = getSrcSet( src, srcSetParams );
	const [ defaultWidth ] = widths;
	const defaultHeight = defaultWidth / ratio;
	const fallbackSrc = resizeWPImage( src, defaultWidth, Math.round( defaultWidth / ratio ) );
	// Provide the image sizes to use with breakpoints
	const sizes = widths.slice( 1 ).map( ( width, index ) => `(min-width: ${breakpoints[index]}) ${width}px` ).reverse();
	// Add the default size
	sizes.push( `${defaultWidth}px` );
	return (
		<div className={cx( 'container', className )}>
			<ImageLoader
				alt={alt}
				title={title}
				width={defaultWidth}
				height={defaultHeight}
				lazyLoad={true}
				sizes={sizes}
				src={fallbackSrc}
				srcSet={srcSet}
				aspectRatio={ratio}
			/>
		</div>
	);
};

Photo.propTypes = {
	alt: PropTypes.string,
	className: PropTypes.string,
	ratio: PropTypes.number.isRequired,
	src: PropTypes.string.isRequired,
	title: PropTypes.string,
	widths: PropTypes.arrayOf( PropTypes.number ).isRequired,
};

Photo.defaultProps = {
	className: '',
	alt: '',
};

export default Photo;
