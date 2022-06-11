import React from 'react';
import styles from './HomeWork.module.scss';
import HomeGuideArticle from './components/HomeGuideArticle/HomeGuideArticle';
import HomeLeadArticle from './components/HomeLeadArticle/HomeLeadArticle';
import HomeObsessionsArticle from './components/HomeObsessionsArticle/HomeObsessionsArticle';
import HomeContributorArticle from './components/HomeContributorArticle/HomeContributorArticle';
import { MarqueeUnit } from 'components/Ad/Marquee/Marquee';
import Spotlight from 'components/Ad/Spotlight/Spotlight';
import withBulletinOrArticle from 'components/Ad/BulletinAd/withBulletinOrArticle.js';
import Link from 'components/Link/Link';
import ListWithAds from 'components/List/ListWithAds';
import useArticlesByTag from 'data/hooks/useArticlesByTag';
import useContributors from 'data/hooks/useContributors';
import useLatestArticles from 'data/hooks/useLatestArticles';
import useMenuItems from 'data/hooks/useMenuItems';
import useObsessions from 'data/hooks/useObsessions';
import Page, { PageLoading } from 'components/Page/Page';
import getMeta from 'config/meta';
import { getArticleProps } from 'helpers/data/article';

const BulletinOrLead = withBulletinOrArticle( HomeLeadArticle );
const BulletinOrHomeGuide = withBulletinOrArticle( HomeGuideArticle );

const ad = { path: 'home' };

function HomeWork () {
	const { articles: contributors } = useContributors( 5 );
	const latest = useLatestArticles( { edition: 'WORK', postsPerPage: 20 } );
	const lead = useMenuItems( 'top_work', 7 );
	const obsessions = useObsessions();
	const workGuides = useArticlesByTag( 'work-guides', 5 );

	if ( ! contributors || ! latest?.posts || ! lead || ! obsessions || ! workGuides ) {
		return <PageLoading />;
	}

	const leadArticles = lead.map( getArticleProps );

	return (
		<Page
			canonicalPath="/work/"
			feedLink="edition/work"
			pageTitle={getMeta( 'WORK' ).shortDescription}
			pageType="home"
		>
			<MarqueeUnit path={ad.path} />
			<div className={styles.container}>
				<div className={styles.row}>
					<ul className={styles.lead} data-module-name="homepage-featured">
						{
							leadArticles.slice( 0, 1 ).map( ( post, index ) => (
								<HomeLeadArticle
									article={post}
									key={index}
									topStory={true}
								/>
							) )
						}
						{
							leadArticles.slice( 1, 3 ).map( ( post, index ) => (
								<HomeLeadArticle
									article={post}
									key={index}
								/>
							) )
						}
						<BulletinOrLead id="bulletin-or-lead" path={ad.path} targeting={{ tile: 1 }}>
							<HomeLeadArticle
								article={leadArticles[3]}
							/>
						</BulletinOrLead>
					</ul>
					<ul className={styles.leadStories} data-module-name="homepage-featured">
						{
							leadArticles.slice( 4, 7 ).map( ( post, index ) => (
								<HomeLeadArticle
									leadStory={true}
									article={post}
									key={index}
								/>
							) )
						}
					</ul>
					<ul className={styles.contributors} data-module-name="homepage-contributors">
						<h2 className={styles.title}>
							<Link
								to="/work/contributors/"
								className={styles.titleText}
							>
								Contributors
							</Link>
						</h2>
						{
							contributors.map( ( article, index ) => (
								<HomeContributorArticle
									key={index}
									article={article}
								/>
							) )
						}
					</ul>
				</div>
				<Spotlight
					id="spotlight-1"
					path={ad.path}
					className={styles.spotlightAd}
				/>
				<div className={styles.row}>
					<section className={styles.guides} data-module-name="homepage-guides">
						<h2 className={styles.title}>
							<Link
								to="/re/work-guides/"
								className={styles.titleText}
							>
								Work Guides
							</Link>
						</h2>
						{
							workGuides.articles?.map( ( article, index ) => {
								if ( 0 === index ) {
									return (
										<HomeGuideArticle
											key={index}
											article={article}
											topStory={true}
										/>
									);
								} else if ( 2 === index ) {

									return (
										<BulletinOrHomeGuide
											id="bulletin-or-home-guide"
											path={ad.path}
											targeting={{ tile: 2 }}
											key={index}
										>
											<HomeGuideArticle
												key={index}
												article={article}
											/>
										</BulletinOrHomeGuide>
									);
								}

								return (
									<HomeGuideArticle
										key={index}
										article={article}
									/>
								);
							} )
						}
					</section>
					<section className={styles.obsessions} data-module-name="homepage-obsessions">
						<h2 className={styles.title}>
							<Link
								to="/work/obsessions/"
								className={styles.titleText}
							>
								Obsessions
							</Link>
						</h2>
						{
							obsessions.map( ( obsession, index ) => (
								<HomeObsessionsArticle
									key={index}
									article={getArticleProps( obsession.posts?.nodes?.[0] )}
									obsession={obsession}
								/>
							) )
						}
					</section>
				</div>
			</div>
			<section
				className={styles.moreStories}
				data-module-name="homepage-feed"
			>
				<div className={styles.constrain}>
					<h2 className={styles.title}>More stories</h2>
				</div>
				<ListWithAds
					collection={latest.posts.map( post => getArticleProps( post ) )}
					ad={ad}
					bulletinTileStart={3}
					flexTileStart={1}
				/>
			</section>
		</Page>
	);
}

export default HomeWork;
