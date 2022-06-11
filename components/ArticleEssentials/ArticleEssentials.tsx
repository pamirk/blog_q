import React, { Fragment } from 'react';
import styles from './ArticleEssentials.module.scss';
import useEssentialsByArticle from 'data/hooks/useEssentialsByArticle';
import { useTrackingOnView } from 'helpers/hooks/useTracking';
import { trackArticleEssentialsView } from 'helpers/tracking/actions/interaction';
import CardDeck from 'components/CardDeck/CardDeck';
import SponsoredEssentialStack from 'components/Essentials/SponsoredEssential/SponsoredEssential';

export default function ArticleEssentials( props: {
	postId: number;
	isInApp: boolean;
	ad: {
		path: string,
		targeting: any
	},
	time?: number,
	token?: string,
} ) {
	const { postId, isInApp, ad, time, token } = props;

	const essentials = useEssentialsByArticle( postId, { time, token } );
	const ref = useTrackingOnView( trackArticleEssentialsView, { eventLabel: postId } );

	const {
		hasSponsoredEssential,
		sponsoredEssential,
	} = SponsoredEssentialStack( { ad, showHint: !essentials.length, stackPosition: 2 } );

	if ( ! essentials.length && ! hasSponsoredEssential ) {
		return sponsoredEssential;
	}

	return (
		<div className={styles.container} ref={ref}>
			<div className={styles.contents}>
				<h2 className={styles.sectionHeading}>Quartz essentials</h2>
				<p className={styles.intro}>Facts and figures to help you put this story in context.</p>
				<ul className={styles.essentials}>
					{
						!essentials[0] ?
							<li className={styles.essential}>
								{sponsoredEssential}
							</li> :
							essentials.map( ( essential, i ) => (
								<Fragment key={`essential-${i}`}>
									<li className={styles.essential}>
										{essential &&
										<CardDeck
											badgeUrl={essential.badge ?? ''}
											cards={essential.blocks}
											collectionId={essential.collectionId ?? -1}
											headerLink={essential.link ?? ''}
											isInApp={isInApp}
											sponsor=""
											showHint={( i === 0 )}
											stackPosition={i + 1}
											tagline={essential.tagline ?? ''}
											title={essential.title ?? ''}
											trackingContext={`article-essential-${i}`}
										/>}
									</li>
									{
										i === 0 &&
										<li className={styles.essential}>
											{sponsoredEssential}
										</li>
									}
								</Fragment>
							) )
					}
				</ul>
			</div>
		</div>
	);
}
