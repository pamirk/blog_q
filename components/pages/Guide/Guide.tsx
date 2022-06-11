import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import LandingPagePromoModule from 'components/LandingPagePromoModule/LandingPagePromoModule';
import { MarqueeUnit } from 'components/Ad/Marquee/Marquee';
import ListWithAds from 'components/List/ListWithAds';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import MembershipCTA from 'components/MembershipCTA/MembershipCTA';
import Page, { PageLoading } from 'components/Page/Page';
import SeriesHeader from 'components/SeriesHeader/SeriesHeader';
import useArticlesByGuide from 'data/hooks/useArticlesByGuide';
import useEssentialsByGuide from 'data/hooks/useEssentialsByGuide';
import useUserRole from 'helpers/hooks/useUserRole';
import Essentials from 'components/Essentials/Essentials';
import Link from 'components/Link/Link';
import {
	Spinner,
	TabNav,
	TabNavItem,
} from '@quartz/interface';
import styles from './Guide.module.scss';

function GuidePageOuter( props: {
	canonicalPath: string;
	children: JSX.Element;
} ) {
	const slug = useRouter().query.slug as string;
	const { isLoggedIn, isMember } = useUserRole();
	const data = useArticlesByGuide( slug );
	const { guide } = data;

	if ( ! guide ) {
		return <PageLoading />;
	}

	const { colors } = guide;

	// Custom colors may be defined.
	let colorSchemes;

	if ( colors && colors.length >= 3 ) {
		const [
			typography,
			background1,
			accent,
		] = colors;

		colorSchemes = [
			{
				accent,
				background1,
				type: 'default',
				typography,
			},
		];
	}

	return (
		<Page
			canonicalPath={props.canonicalPath}
			canonicalUrl={`https://qz.com${props.canonicalPath}`}
			colorSchemes={colorSchemes}
			feedLink={`/guide/${slug}/`}
			pageDescription={guide.description ?? ''}
			pageTitle={guide.name ?? ''}
			pageType="guide"
			redirectCanonical={false}
			socialImage={guide.socialImage?.sourceUrl ?? ''}
		>
			<MarqueeUnit
				path="list"
				targeting={{
					taxonomy: 'guide',
					term: slug,
				}}
			/>
			<LandingPagePromoModule />
			<SeriesHeader
				{...guide}
				taxonomy="guide"
			/>
			{
				!isMember &&
					<MembershipCTA isLoggedIn={isLoggedIn} trackingContext="guide" type="guide" />
			}
			{props.children}
		</Page>
	);
}

function GuideLatestArticles() {
	const { slug } = useRouter().query ;
	const data = useArticlesByGuide( slug as string );
	const {
		articles,
		fetchMore,
		hasMore,
		loading,
	} = data;

	return (
		<Fragment>
			<ListWithAds
				ad={{
					path: 'list',
					targeting: {
						page: 'guide',
						taxonomy: 'guide',
						term: slug,
					},
				}}
				bulletinRate={3}
				collection={articles}
				engageStart={3}
			/>
			<LoadMoreButton
				fetching={loading}
				hasMorePosts={hasMore}
				loadMore={fetchMore}
			/>
		</Fragment>
	);
}

function GuideEssentials() {
	const { slug } = useRouter().query;
	const { essentials } = useEssentialsByGuide( slug );

	if ( ! essentials ) {
		return (
			<div className={styles.spinner}>
				<Spinner />
			</div>
		);
	}

	return (
		<div className={styles.essentials}>
			<Essentials
				ad={{
					path: 'list',
					targeting: {
						page: 'guide',
						taxonomy: 'essential',
					},
				}}
				collectionId={essentials?.collectionId}
				collectionTitle={essentials?.title ?? undefined}
				blocks={essentials?.blocks}
				trackingContext="guide-landing"
			/>
		</div>
	);
}

function TabbedGuide() {
	const { slug, tab } = useRouter().query;
	const data = useArticlesByGuide( slug as string );
	const isLatest = 'latest' === tab;

	if ( ! data ) {
		return null;
	}

	return (
		<Fragment>
			<div className={styles['tab-container']}>
				<TabNav>
					<TabNavItem isActive={!isLatest}>
						<Link to={`/guide/${slug}/`}>Quartz Essentials</Link>
					</TabNavItem>
					<TabNavItem isActive={isLatest}>
						<Link to={`/guide/${slug}/latest/`}>All stories</Link>
					</TabNavItem>
				</TabNav>
			</div>
			{
				isLatest &&
				<GuideLatestArticles />
			}
			{
				! isLatest &&
				<GuideEssentials />
			}
		</Fragment>
	);
}

function Guide () {
	const { slug } = useRouter().query;
	const data = useArticlesByGuide( slug as string );
	const canonicalPath = `/guide/${slug}/`;

	if ( ! data ) {
		return <PageLoading />;
	}

	if ( data.guide?.hasEssentials ) {
		return (
			<GuidePageOuter canonicalPath={canonicalPath}>
				<TabbedGuide />
			</GuidePageOuter>
		);
	}

	return (
		<GuidePageOuter canonicalPath={canonicalPath}>
			<GuideLatestArticles />
		</GuidePageOuter>
	);
}

export default Guide;
