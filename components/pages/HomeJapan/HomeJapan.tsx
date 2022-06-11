import React, { Fragment } from 'react';
import styles from './HomeJapan.module.scss';
import { useLatestEmailByListQuery, useNugsByTagQuery } from '@quartz/content';
import { ButtonLabel, FeatureCard, Kicker } from '@quartz/interface';
import LatestArticleFeed from 'components/LatestArticleFeed/LatestArticleFeed';
import { MarqueeUnit } from 'components/Ad/Marquee/Marquee';
import Page from 'components/Page/Page';
import Link from 'components/Link/Link';
import EmailIframe from 'components/EmailIframe/EmailIframe';
import EmailFeed from 'components/EmailFeed/EmailFeed';
import PageSectionFooter from 'components/Page/PageSectionFooter/PageSectionFooter';
import { PostTout } from 'components/ContentBlocks/ContentBlocks';
import usePromotionsByTag from 'data/hooks/usePromotionsByTag';
import { formatDate } from 'helpers/dates';

export default function HomeJapan () {
	const { data: emailData } = useLatestEmailByListQuery( { variables: {
		slug: 'quartz-japan',
	} } );
	const email = emailData?.emailLists?.nodes?.[0]?.emails?.nodes?.[0] ?? null;
	const { data: nugData } = useNugsByTagQuery( { variables: {
		perPage: 1,
		slug: 'qz-japan-homepage',
	} } );
	const nug = nugData?.nugs?.nodes?.[0];
	const podcast = usePromotionsByTag( 'qz-japan-podcast-promo', 1 );

	return (
		<Page
			canonicalPath="/japan/"
			pageTitle="Quartz Japan"
			pageType="home"
		>
			<div className={styles.container}>
				<div className={styles.columns}>
					<MarqueeUnit path="home" targeting={{ region: 'japan' }} />
					<aside className={styles["left-rail-container"]}>
						<h2 className={styles.railHeading}>ポッドキャスト：新着エピソード</h2>
						<div className={styles["guide-promo-container"]}>
							{podcast[0] &&
							<Link to="https://anchor.fm/qz-japan">
								<FeatureCard
									thumbnailUrl={podcast[0].featuredImage?.sourceUrl ?? ''}
									title={podcast[0].title ?? ''}
									description={podcast[0].description ?? ''}
									size="small"
									isPortrait
								/>
							</Link>}
						</div>
						<Link to="https://anchor.fm/qz-japan">
							<ButtonLabel variant="secondary">他のエピソードを聴く</ButtonLabel>
						</Link>
					</aside>
					<div className={styles["center-well-container"]}>
						{
							email?.html && (
								<Fragment>
									{email?.dateGmt &&
										<Kicker>
											<p className={styles.dateline}>{`Quartz Japan email from ${formatDate( email.dateGmt, { dateOnly: true, human: true } )}`}</p>
										</Kicker>
									}
									<h2 className={styles["email-headline"]}>{email.title}</h2>
									<div className={styles["email-preview"]}>
										<EmailIframe
											maxHeight={500}
											html={email.html}
											showPaywall // we're not showing anyone the full email here - this is just for styling + suggesting the link below
											title={email.title ?? ''}
										/>
										<Link to={email.link ?? '/emails/quartz-japan'} className={styles["email-link"]}>
											<ButtonLabel variant="secondary">
												続きを読む
											</ButtonLabel>
										</Link>
									</div>
								</Fragment>
							)
						}
						<div className={styles["edge-to-edge"]}>
							<EmailFeed
								slug="quartz-japan"
								isBlock
								sectionBackground="alt"
								sectionHideTopPadding
								showLoadMore={false}
								constrain={false}
								perPage={5}
							/>
						</div>
						<PageSectionFooter url="/emails/quartz-japan" text="もっと見る" hideTop />
						<hr className={styles.hr} />
						{nug &&
						<PostTout
							connection={nug}
						/>}
					</div>
					<aside className={styles["right-rail-container"]}>
						<h2 className={styles["rail-heading"]}>お知らせ</h2>
						<LatestArticleFeed edition="JAPAN" />
						<Link to="/japan/latest/">
							<ButtonLabel variant="secondary">すべての記事を見る</ButtonLabel>
						</Link>
					</aside>
				</div>
			</div>
		</Page>
	);
}
