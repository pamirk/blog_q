import React from 'react';
import styles from './LatestArticleFeed.module.scss';
import useLatestArticles from 'data/hooks/useLatestArticles';
import useLatestFeedContent from 'data/hooks/useLatestFeedContent';
import Link from 'components/Link/Link';
import { EditionName } from '@quartz/content';
import { FeatureCard } from '@quartz/interface';

function LatestArticleCards ( props: { posts: Array<any> } ) {
	return (
		<>
			{props.posts.map( article => {
				if ( !article.featuredImage || !article.link || !article.title ) {
					return null;
				}

				const {
					edition,
					editions,
					id,
					featuredImage,
					title,
					video,
				} = article;

				if ( !featuredImage.sourceUrl ) {
					return null;
				}

				// tweaks for emails;
				let editionName = '';
				if ( edition?.name ) {
					editionName = !!article.emailId ? `${edition?.name}` : edition?.name;
				}
				if ( editions ) {
					editionName = editions.nodes?.[0]?.name;
				}
				const link = !!article.emailId ? article.link.replace( '/email/', '/emails/' ) : article.link;

				return (
					<li key={id} className={styles.item}>
						<Link to={link}>
							<FeatureCard
								description={editionName}
								showPlayIcon={!!video}
								thumbnailUrl={featuredImage.sourceUrl}
								title={title}
								size="medium"
							/>
						</Link>
					</li>
				);
			} )
			}
		</>
	);
}

function LatestEditionFeed ( props: {
	edition: EditionName,
} ) {
	const { posts } = useLatestArticles( { edition: props.edition } );

	if ( ! posts ) {
		return null;
	}

	return <LatestArticleCards posts={posts} />;
}

function LatestFeed() {
	const { posts } = useLatestFeedContent();

	if ( !posts ) {
		return null;
	}

	return <LatestArticleCards posts={posts} />;
}

export default function LatestArticleFeed ( props: {
	edition: EditionName,
} ) {
	return (
		<ul className={styles.container}>
			{
				'QUARTZ' === props.edition ?
					<LatestFeed />
					:
					<LatestEditionFeed edition={props.edition} />
			}
		</ul>
	);
}
