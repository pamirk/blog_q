import React from 'react';
import { SeriesPartsFragment } from '@quartz/content';
import styles from './SeriesHeader.module.scss';

export default function SeriesHeaderCredit(
	props: {
		headerVideos: SeriesPartsFragment[ 'headerVideos' ],
		headerImages: SeriesPartsFragment[ 'headerImages' ],
	}
) {
	const { headerVideos, headerImages } = props;

	let credit: string | null | undefined;

	if ( headerVideos?.length ) {
		credit = headerVideos.find( video => video?.mp4?.credit )?.mp4?.credit;
	} else if ( headerImages?.length ) {
		credit = headerImages.find( image => image?.image?.credit )?.image?.credit;
	}

	if ( credit ) {
		return (
			<div className={styles.credit}>
				{credit}
			</div>
		);
	}

	return null;
}
