import React from 'react';
import { SeriesPartsFragment } from '@quartz/content';
import DecorativeVideo from 'components/DecorativeVideo/DecorativeVideo';
import LayeredImage from 'components/LayeredImage/LayeredImage';
import TermHeader from 'components/TermHeader/TermHeader';

export default function SeriesHeaderMedia(
	props: {
		headerVideos: SeriesPartsFragment[ 'headerVideos' ],
		headerImages: SeriesPartsFragment[ 'headerImages' ],
		name?: string,
		slug?: string,
	}
) {
	const { headerVideos, headerImages, name, slug } = props;

	if ( headerVideos?.length ) {
		return <DecorativeVideo sources={headerVideos} />;
	}

	if ( headerImages?.length ) {
		return <LayeredImage sources={headerImages} />;
	}

	return (
		<TermHeader
			name={name}
			slug={slug}
			type="series"
		/>
	);
}
