import getUpdateQuery from 'data/apollo/getUpdateQuery';
import { useContentByTagQuery } from '@quartz/content';
import { getArticleOrEmailProps } from 'helpers/data/email';
import { ResourceNotFoundError } from 'helpers/errors';

export default function useContentByTagContent( slug: string, postsPerPage?: number ) {
	const { data, fetchMore, loading } = useContentByTagQuery( {
		variables: { perPage: postsPerPage || 10, slug: slug },
		notifyOnNetworkStatusChange: true,
	} );

	const tag = data?.tags?.nodes?.[0];
	const tagContent = data?.tagContent?.nodes?.map( getArticleOrEmailProps );

	if ( ! loading && ! tag ) {
		throw new ResourceNotFoundError();
	}

	const fetch = () => fetchMore( {
		variables: {
			perPage: postsPerPage || 10,
			after: data?.tagContent?.pageInfo?.endCursor,
		},
		// @ts-ignore
		updateQuery: getUpdateQuery( 'tagContent.nodes' ),
	} );

	return {
		endCursor: data?.tagContent?.pageInfo?.endCursor,
		fetchMore: fetch,
		loading,
		hasMore: !!data?.tagContent?.pageInfo?.hasNextPage,
		tag,
		tagContent,
	};
}
