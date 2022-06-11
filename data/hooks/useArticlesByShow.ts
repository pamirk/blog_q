import { useArticlesByShowQuery } from '@quartz/content';
import { getArticleProps } from 'helpers/data/article';
import { ResourceNotFoundError } from 'helpers/errors';
import getUpdateQuery from 'data/apollo/getUpdateQuery';

export default function useArticlesByShow ( slug: string, perPage = 10, ssr = true ) {
	const { data, fetchMore, loading } = useArticlesByShowQuery( {
		variables: { perPage, slug: [ slug ] },
		ssr,
		notifyOnNetworkStatusChange: true,
	} );
	const show = data?.shows?.nodes?.[0];
	if ( ! loading && ! show ) {
		throw new ResourceNotFoundError();
	}
	const hasMore = !! show?.posts?.pageInfo?.hasNextPage;
	const articles = data?.shows?.nodes?.[0]?.posts?.nodes?.map( getArticleProps );
	// @ts-ignore
	const fetch = () => fetchMore( {
		variables: { after: show?.posts?.pageInfo?.endCursor },
		// @ts-ignore
		updateQuery: getUpdateQuery( 'shows.nodes[0].posts.nodes' ),
	} );
	return { articles, fetchMore: fetch, loading, hasMore, show };
}
