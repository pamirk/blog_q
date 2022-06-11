import React, { ReactNode, useState } from 'react';
import Video from 'components/Video/Video';
import PlayIcon from 'svgs/play-icon';
import ResponsiveImage from 'components/ResponsiveImage/ResponsiveImage';
import styles from './VideoPlayer.module.scss';

const posterImageSizes = [
	{
		breakpoint: 'phone-only',
		width: 768,
	},
	{
		breakpoint: 'tablet-portrait-up',
		width: 1024,
	},
];

export default function VideoPlayer( props: {
	autoplay?: boolean,
	buttonLabel?: ReactNode,
	posterImageSrc?: string,
	videoSrc: string,
} ) {
	const [ isPlaying, setIsPlaying ] = useState( !! props.autoplay );

	if ( isPlaying ) {
		return (
			<Video
				autoplay={true}
				controls={!props.autoplay}
				loop={props.autoplay}
				poster={props.posterImageSrc}
				src={props.videoSrc}
			/>
		);
	}

	return (
		<button
			className={styles.poster}
			onClick={() => setIsPlaying( true )}
			type="button"
		>
			<div className={styles.posterImage}>
				{
					props.posterImageSrc &&
					<ResponsiveImage
						alt=""
						sources={posterImageSizes}
						src={props.posterImageSrc}
						aspectRatio={16 / 9}
					/>
				}
			</div>
			<span className={styles.posterLabel}>
				<PlayIcon
					aria-label="Play"
					className={styles.playIcon}
					role="img"
				/>
				{props.buttonLabel || 'Play'}
			</span>
		</button>
	);
}
