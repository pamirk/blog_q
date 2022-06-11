import React from 'react';
import { Helmet } from 'react-helmet-async';
import ImageLoader from 'components/ImageLoader/ImageLoader';
import { breakpoints, getImprovedSrcSet } from 'helpers/images';
import { resizeWPImage } from '@quartz/js-utils';

type Source = {
	breakpoint: string,
	width: number,
}

const ResponsiveImage = ( props: {
	alt: string,
	aspectRatio: number,
	className?: string,
	crop?: boolean,
	lazyLoad?: boolean,
	preload?: boolean,
	sources: Source[],
	src: string,
} ) => {
	const {
		src,
		alt,
		aspectRatio,
		crop = true,
		sources,
		lazyLoad = false,
		className,
		preload = false,
	} = props;

	const srcSet: string[] = [];
	const sizes: string[] = [];

	sources.forEach( ( { width, breakpoint } ) => {

		srcSet.push(
			getImprovedSrcSet(
				src,
				[
					width,
					Math.round( width / aspectRatio ),
					crop,
				]
			)
		);

		sizes.push(
			breakpoint === 'phone-only' ? `${width}px` : `${breakpoints[breakpoint].media} ${width}px`
		);
	} );

	// this is important, otherwise it will default to mobile on desktop
	sizes.reverse();

	const [ { width } ] = sources;
	const height = Math.round( width / aspectRatio );
	const defaultSrc = resizeWPImage( src, width, height, crop );

	return (
		<>
			{preload && !lazyLoad && (
				<Helmet>
					{/* @ts-expect-error imagesrcset is valid per https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link but unrecognized by TS */}
					<link rel="preload" as="image" href={src} imagesrcset={srcSet} imagesizes={sizes} />
				</Helmet>
			)}
			<ImageLoader
				width={width}
				height={height}
				src={defaultSrc}
				alt={alt}
				srcSet={srcSet}
				sizes={sizes}
				lazyLoad={lazyLoad}
				className={className}
			/>
		</>
	);
};

export default ResponsiveImage;
