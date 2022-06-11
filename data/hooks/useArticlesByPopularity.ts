import { usePopularArticlesQuery, EditionName } from '@quartz/content';
import { getArticleProps } from 'helpers/data/article';
import { ResourceNotFoundError } from 'helpers/errors';

export default function useArticlesByPopularity ( edition?: EditionName, ssr = true ) {
	const queryOptions = {
		notifyOnNetworkStatusChange: true,
		ssr,
		variables: {
			edition: edition,
			perPage: 10,
		},
	};

	const { data, loading, fetchMore } = usePopularArticlesQuery( queryOptions );

	if ( ! loading && ! data?.posts ) {
		throw new ResourceNotFoundError();
	}

	const hasMore = !! data?.posts?.pageInfo?.hasNextPage;

	const articles = data?.posts?.nodes?.map( getArticleProps );

	return {
		articles,
		loading,
		hasMore,
		fetchMore: () => fetchMore( { variables: { after: data?.posts?.pageInfo?.endCursor } } ),
	};
}
