import React from 'react';
import { useRouter } from 'next/router';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import Page, { PageLoading } from 'components/Page/Page';
import TermHeader from 'components/TermHeader/TermHeader';
import useContentByTag from 'data/hooks/useContentByTag';
import ListWithAds from 'components/List/ListWithAds';

function Tag () {
	const { slug } = useRouter().query;

	const { fetchMore, hasMore, loading, tag, tagContent } = useContentByTag( slug as string);

	if ( ! tag ) {
		return <PageLoading />;
	}

	// The "Ideas" tag should be redirected to the series.
	let canonicalPath = `/re/${slug}/`;
	if ( 'ideas' === slug ) {
		canonicalPath = '/se/ideas/';
	}

	return (
		<Page
			canonicalPath={canonicalPath}
			feedLink={`/tag/${slug}/`}
			pageDescription={tag.description
				? tag.description
				: `In-depth coverage and articles about ${tag.name} from Quartz` // a little ugly but should work for most tags
			}
			pageTitle={tag.name ?? ''}
			pageType="tag"
			socialImage={tag.featuredImage?.sourceUrl ?? ''}
		>
			<TermHeader
				{...tag}
				type="tag"
			/>
			<ListWithAds
				ad={{
					path: 'list',
					targeting: {
						page: 'tag',
						term: slug,
						taxonomy: 'tag',
					},
				}}
				collection={tagContent}
			/>
			<LoadMoreButton
				fetching={loading}
				hasMorePosts={hasMore}
				loadMore={fetchMore}
			/>
		</Page>
	);
}

export default Tag;
