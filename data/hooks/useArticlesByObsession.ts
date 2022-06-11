import { useArticlesByObsessionQuery } from '@quartz/content';
import { getArticleProps } from 'helpers/data/article';
import { ResourceNotFoundError } from 'helpers/errors';
import getUpdateQuery from 'data/apollo/getUpdateQuery';

export default function useArticlesByObsession ( slug: string, perPage = 10, ssr = true ) {
	const { data, fetchMore, loading } = useArticlesByObsessionQuery( {
		variables: { perPage, slug: [ slug ] },
		ssr,
		notifyOnNetworkStatusChange: true,
	} );
	const obsession = data?.obsessions?.nodes?.[0];
	if ( ! loading && ! obsession ) {
		throw new ResourceNotFoundError();
	}
	const hasMore = !! obsession?.posts?.pageInfo?.hasNextPage;
	const articles = data?.obsessions?.nodes?.[0]?.posts?.nodes?.map( getArticleProps );
	const fetch = () => fetchMore( {
		variables: { after: obsession?.posts?.pageInfo?.endCursor },
        //@ts-ignore
		updateQuery: getUpdateQuery( 'obsessions.nodes[0].posts.nodes' ),
	} );
	return { articles, fetchMore: fetch, loading, hasMore, obsession };
}
