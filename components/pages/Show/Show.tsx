import React from 'react';
import { useRouter } from 'next/router';
import LandingPagePromoModule from 'components/LandingPagePromoModule/LandingPagePromoModule';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import MembershipCTA from 'components/MembershipCTA/MembershipCTA';
import Page, { PageLoading } from 'components/Page/Page';
import SeriesHeader from 'components/SeriesHeader/SeriesHeader';
import useArticlesByShow from 'data/hooks/useArticlesByShow';
import useUserRole from 'helpers/hooks/useUserRole';
import ListWithAds from 'components/List/ListWithAds';

function Show () {
	const { slug } = useRouter().query;
	const { isLoggedIn, isMember } = useUserRole();

	const data = useArticlesByShow( slug as string );
	const { articles, fetchMore, hasMore, loading, show } = data;

	if ( ! show || ! articles ) {
		return <PageLoading />;
	}

	// Are more than half the posts paywalled?
	const isPaywalled = articles.filter( article => article.paywalled ).length > articles.length / 2;

	// Custom colors may be defined.
	let colorSchemes;
	if ( show.colors && show.colors.length >= 3 ) {
		const [
			typography,
			background1,
			accent,
		] = show.colors;

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
			canonicalPath={`/show/${slug}/`}
			colorSchemes={colorSchemes}
			feedLink={`/show/${slug}/`}
			pageDescription={show.description ?? ''}
			pageTitle={show.name ?? ''}
			pageType="show"
			socialImage={show.socialImage?.sourceUrl ?? ''}
		>
			<LandingPagePromoModule />
			<SeriesHeader
				{...show}
				taxonomy="show"
			/>
			{
				!isMember && isPaywalled &&
					<MembershipCTA isLoggedIn={isLoggedIn} trackingContext="show" type="show" />
			}
			<ListWithAds
				ad={{
					path: 'list',
					targeting: {
						page: 'show',
						taxonomy: 'show',
						term: slug,
					},
				}}
				collection={articles}
			/>
			<LoadMoreButton
				fetching={loading}
				hasMorePosts={hasMore}
				loadMore={fetchMore}
			/>
		</Page>
	);
}

export default Show;
