import React from 'react';
import styles from './Figure.module.scss';
import ResponsiveImage from 'components/ResponsiveImage/ResponsiveImage';

export default function Figure ( props: {
	alt: string;
	aspectRatio: number;
	caption?: string | null;
	credit?: string | null;
	lazyLoad?: boolean;
	preload?: boolean,
	src: string;
} ) {
	const { alt = '', aspectRatio, caption, credit, lazyLoad, preload, src } = props;
	return ( <figure className={styles.container}>
		<div className={styles.imageContainer}>
			<ResponsiveImage
				alt={alt}
				aspectRatio={aspectRatio}
				lazyLoad={lazyLoad}
				preload={preload}
				sources={[
					{
						breakpoint: 'phone-only',
						width: 424,
					},
					{
						breakpoint: 'tablet-portrait-up',
						width: 820,
					},
				]}
				src={src}
			/>
			{
				credit &&
				<span className={styles.credit}>
					<span className={styles.creditLabel}>Image copyright: </span>
					<span>{credit}</span>
				</span>
			}
		</div>
		{
			caption &&
			<figcaption className={styles.caption}>{caption}</figcaption>
		}
	</figure> );
}
