import React from 'react';
import styles from './Recirculation.module.scss';
import List from 'components/List/List';
import useArticlesByPopularity from 'data/hooks/useArticlesByPopularity';
import withBulletinOrArticle from 'components/Ad/BulletinAd/withBulletinOrArticle.js';
import { Engage } from 'components/Ad/Ad';
import usePageVariant from 'helpers/hooks/usePageVariant';
import { EditionName } from '@quartz/content';
import { ArticleStrip } from '@quartz/interface';
import Link from 'components/Link/Link';

function ListArticle( props: { article, onClick } ) {
	const { isAmp } = usePageVariant();
	const {
		bulletin,
		dateGmt,
		edition,
		featuredImage,
		kicker,
		link,
		title,
	} = props.article;

	return (
		<Link
			className={styles.bulletin}
			onClick={props.onClick}
			to={link}
		>
			<ArticleStrip
				amp={isAmp}
				dateGmt={dateGmt}
				edition={edition?.name}
				kicker={kicker}
				size="extra-large"
				sponsor={bulletin?.sponsor?.name}
				thumbnailUrl={featuredImage?.sourceUrl}
				title={title}
			/>
		</Link>
	);
}

const BulletinListArticle = withBulletinOrArticle( ListArticle );

type RecirculationProps = {
	ad,
	edition: EditionName,
	postId: number,
	showBulletin: boolean,
	showEngage: boolean,
	ssr: boolean,
};

function Recirculation ( {
	ad,
	edition,
	postId,
	showBulletin,
	showEngage,
	ssr,
}: RecirculationProps ) {
	const { articles } = useArticlesByPopularity( edition, ssr );

	if ( ! articles ) {
		return null;
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.headingContainer}>
					<h2 className={styles.heading}>Popular stories</h2>
				</div>
				<div className={styles.feed}>
					<List constrain={false} collection={articles.slice( 0, 2 )} />
					{
						showBulletin &&
						<BulletinListArticle
							path={ad.path}
							dataProp="element"
							id="bulletin-ad-1"
							key="bulletin-1"
							size="large"
							targeting={{ ...ad.targeting, bulletin_tile: 2 }}
						/>
					}
					<List constrain={false} collection={articles.slice( 2, 6 )} />
				</div>
			</div>

			{
				showEngage &&
				<Engage
					path={ad.path}
					id="engage-1"
					targeting={{ ...ad.targeting, tile: 1 }}
				/>
			}

			<div className={styles.container} key={`below-${postId}`}>
				<div className={styles.feed}>
					<List constrain={false} collection={articles.slice( 6 )} />
				</div>
			</div>
		</>
	);
}

export default Recirculation;
