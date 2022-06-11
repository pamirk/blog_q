import React from 'react';
import PropTypes from 'prop-types';
import ArtDirection from '../../../../../components/ArtDirection/ArtDirection';

const HomeLeadImage = ( { topStory, featuredImage } ) => {

	const { sourceUrl, mediaDetails } = featuredImage;
	const { width, height } = mediaDetails;

	// Landscape images have an aspect ratio of 16:9. Otherwise use the width and height of the image.
	const aspectRatio = width > height ? 1.77 : width / height;

	let sources;

	if ( topStory ) {
		sources = [
			{
				breakpoint: 'phone-only',
				url: sourceUrl,
				width: 767,
				height: 767,
			},
			{
				breakpoint: 'tablet-portrait-up',
				url: sourceUrl,
				width: 800,
				height: Math.round( 800 / aspectRatio ),
			},
			{
				breakpoint: 'tablet-landscape-up',
				url: sourceUrl,
				width: 600,
				height: Math.round( 600 / aspectRatio ),
			},
			{
				breakpoint: 'desktop-up',
				url: sourceUrl,
				width: 800,
				height: Math.round( 800 / aspectRatio ),
			},
		];
	} else {
		sources = [
			{
				breakpoint: 'phone-only',
				url: sourceUrl,
				width: 75,
				height: 75,
			},
			{
				breakpoint: 'tablet-portrait-up',
				url: sourceUrl,
				width: 140,
				height: Math.round( 140 / aspectRatio ),
			},
			{
				breakpoint: 'tablet-landscape-up',
				url: sourceUrl,
				width: 420,
				height: Math.round( 420 / aspectRatio ),
			},
		];
	}

	return (
		<ArtDirection
			alt={featuredImage.altText}
			sources={sources}
		/>
	);
};

HomeLeadImage.propTypes = {
	featuredImage: PropTypes.object.isRequired,
	topStory: PropTypes.bool.isRequired,
};

export default HomeLeadImage;
