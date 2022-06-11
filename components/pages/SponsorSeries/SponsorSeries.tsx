import React from 'react';
import { useRouter } from 'next/router';
import LandingPagePromoModule from 'components/LandingPagePromoModule/LandingPagePromoModule';
import { MarqueeUnit } from 'components/Ad/Marquee/Marquee';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import ListWithAds from 'components/List/ListWithAds';
import Page, { PageLoading } from 'components/Page/Page';
import SeriesHeader from 'components/SeriesHeader/SeriesHeader';
import useBulletinsBySeries from 'data/hooks/useBulletinsBySeries';

function SponsorSeries () {
	const { slug } = useRouter().query;

	const { articles, fetchMore, hasMore, loading, series } = useBulletinsBySeries( slug as string );

	if ( ! series || !series.name || !series.slug ) {
		return <PageLoading />;
	}

	// Custom colors may be defined.
	let colorSchemes;
	if ( series.colors?.length && series.colors.length >= 3 ) {
		const [
			typography,
			background1,
			accent,
		] = series.colors;

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
			canonicalPath={`/se/${slug}/`}
			colorSchemes={colorSchemes}
			feedLink={`/series/${slug}/`}
			pageDescription={series.description ?? ''}
			pageTitle={series.name}
			pageType="series"
			socialImage={series.socialImage?.sourceUrl ?? ''}
		>
			<MarqueeUnit
				path="list"
				targeting={{
					taxonomy: 'series',
					term: slug,
				}}
			/>
			<LandingPagePromoModule />
			<SeriesHeader
				{...series}
				taxonomy="series"
			/>
			<ListWithAds
				ad={{
					path: 'list',
					targeting: {
						page: 'series',
						taxonomy: 'series',
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
		</Page>
	);
}

export default SponsorSeries;
