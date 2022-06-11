import React from 'react';
import styles from './FeatureSection.module.scss';
import { BadgeGroup, FeatureCard } from '@quartz/interface';
import { stylizedTimestamp } from '@quartz/js-utils';
import Link from 'components/Link/Link';

function getDescription ( dateGmt, edition, video?: { episode?: string, season?: string } ) {
	if ( video?.season ) {
		return `Season ${video.season} • Episode ${video.episode}`;
	}

	if ( video?.episode ) {
		return `Episode ${video.episode}`;
	}

	return `${stylizedTimestamp( dateGmt )} • ${edition?.name}`;
}

const FeatureSection = ( props: {
	description?: string,
	featuredImage?: any,
	link?: string,
	name?: string,
	posts: any,
	shortDescription?: string,
} ) => (
	<section className={styles.container}>
		{
			props.name &&
			<Link to={props.link} className={styles['header-link']}>
				<BadgeGroup
					size="medium"
					title={props.name}
					tagline={props.shortDescription || props.description}
					imageUrl={props.featuredImage?.sourceUrl}
				/>
			</Link>
		}
		<ul className={`${styles.posts} ${props.posts.length < 3 && styles['align-left']}`}>
			{
				props.posts.map( ( {
					dateGmt,
					edition,
					featuredImage,
					id,
					kicker,
					link,
					title,
					name,
					video,
				} ) => (
					<li className={styles.post} key={id}>
						<Link to={link}>
							<FeatureCard
								description={getDescription( dateGmt, edition, video )}
								kicker={kicker}
								showPlayIcon={!!video}
								title={title || name}
								thumbnailUrl={featuredImage?.sourceUrl}
								size="medium"
							/>
						</Link>
					</li>
				) )
			}
		</ul>
	</section>
);

export default FeatureSection;
