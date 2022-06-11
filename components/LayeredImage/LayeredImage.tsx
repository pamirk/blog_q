import React from 'react';
import styles from './LayeredImage.module.scss';
import { SeriesPartsFragment } from '@quartz/content';
import ArtDirection from 'components/ArtDirection/ArtDirection';

const sizesToBreakpoints = {
	small: 'phone-only',
	large: 'tablet-portrait-up',
};

export default function LayeredImage( props: { sources: SeriesPartsFragment[ 'headerImages' ] } ) {
	const { sources } = props;
	const sizesToDimensions = {};
	const layers: any[] = [];
	/*
		Sort the supplied images into a matrix of sizes and layers.
		Each layer will have an array of art direction source objects.
		This array is passed directly into ArtDirection to output the
		appropriate image at the specified breakpoint.
	*/
	sources?.forEach( source => {
		const { image, layer, size } = source ?? {};

		// Do not continue if an image has not been uploaded for this field
		if ( ! image || ! layer ) {
			return;
		}

		const { altText, mediaDetails, sourceUrl } = image;

		// Set up the structure for the layer if it doesn't exist yet
		if ( ! layers[ layer ] ) {
			layers[ layer ] = {
				altText,
				imageSources: [],
			};
		}

		// Save this image source into the appropriate layer
		layers[ layer ].imageSources.push( {
			size,
			url: sourceUrl,
		} );

		// Get the image dimensions for this size if mediaDetails are available
		if ( size && ! sizesToDimensions[ size ] && mediaDetails ) {
			const { width, height } = mediaDetails;
			sizesToDimensions[ size ] = {
				height,
				width,
			};
		}
	} );

	const layersWithArtDirection = layers
		// Remove any empty array elements caused by non-sequential/non-zero-based numbering of layers
		.filter( layer => !! layer )
		// Map the appropriate image dimensions and breakpoints onto the ArtDirection sources
		.map( layer => {
			const { imageSources } = layer;
			const sources = imageSources.map( imageSource => {
				const { size } = imageSource;
				const breakpoint = sizesToBreakpoints[ size ];
				const dimensions = sizesToDimensions[ size ];

				return {
					breakpoint,
					...dimensions,
					...imageSource,
				};
			} );

			return {
				...layer,
				sources,
			};
		} );

	return (
		<div className={styles.container}>
			{
				layersWithArtDirection.map( ( { altText, sources }, layer ) => (
					<div className={styles.layer} key={layer}>
						<ArtDirection alt={altText} sources={sources} preload />
					</div>
				) )
			}
		</div>
	);
}
