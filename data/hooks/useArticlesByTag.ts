import { useArticlesByTagQuery } from '@quartz/content';
import { getArticleProps } from 'helpers/data/article';
import { ResourceNotFoundError } from 'helpers/errors';
import getUpdateQuery from 'data/apollo/getUpdateQuery';

export default function useArticlesByTag ( slug: string, perPage = 10, ssr = true ) {
	const { data, fetchMore, loading } = useArticlesByTagQuery( {
		variables: { perPage, slug: [ slug ] },
		ssr,
		notifyOnNetworkStatusChange: true,
	} );
	const tag = data?.tags?.nodes?.[0];
	if ( ! loading && ! tag ) {
		throw new ResourceNotFoundError();
	}
	const hasMore = !! tag?.posts?.pageInfo?.hasNextPage;
	const articles = data?.tags?.nodes?.[0]?.posts?.nodes?.map( getArticleProps );

	const fetch = () => fetchMore( {
		variables: { after: tag?.posts?.pageInfo?.endCursor },
		// @ts-ignore
		updateQuery: getUpdateQuery( 'tags.nodes[0].posts.nodes' ),
	} );
	return { articles, fetchMore: fetch, loading, hasMore, tag };
}
