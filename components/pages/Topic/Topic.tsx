import React from 'react';
import { useRouter } from 'next/router';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import Page, { PageLoading } from 'components/Page/Page';
import TermHeader from 'components/TermHeader/TermHeader';
import useArticlesByTopic from 'data/hooks/useArticlesByTopic';
import ListWithAds from 'components/List/ListWithAds';

function Topic () {
	const { slug } = useRouter().query;

	const data = useArticlesByTopic( slug as string );
	const { articles, fetchMore, hasMore, loading, topic } = data;

	if ( ! topic ) {
		return <PageLoading />;
	}

	return (
		<Page
			canonicalPath={`/topic/${slug}/`}
			feedLink={`/topic/${slug}`}
			pageDescription={topic.description ? topic.description : `In-depth coverage and articles from Quartz about ${topic.name}`}
			pageTitle={topic.name ?? ''}
			pageType="topic"
			socialImage={topic.featuredImage?.sourceUrl ?? ''}
		>
			<TermHeader
				{...topic}
				type="topic"
			/>
			<ListWithAds
				ad={{
					path: 'list',
					targeting: {
						page: 'topic',
						term: slug,
						taxonomy: 'topic',
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

export default Topic;
