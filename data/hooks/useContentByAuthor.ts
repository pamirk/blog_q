import { useContentByAuthorQuery } from '@quartz/content';
import { getArticleOrEmailProps } from 'helpers/data/email';
import { ResourceNotFoundError } from 'helpers/errors';
import getUpdateQuery from 'data/apollo/getUpdateQuery';

export default function useContentByAuthor ( slug: string, perPage = 10, ssr = true ) {
	const { data, fetchMore, loading } = useContentByAuthorQuery( {
		variables: { perPage, slug },
		ssr,
		notifyOnNetworkStatusChange: true,
	} );

	const authorContent = data?.authorContent;
	const author = data?.authors?.nodes?.[0];

	if ( ! loading && ( ! authorContent || ! author ) ) {
		throw new ResourceNotFoundError();
	}
	const hasMore = !! authorContent?.pageInfo?.hasNextPage;
	const content = authorContent?.nodes?.map( getArticleOrEmailProps );

    const fetch = () => fetchMore( {
		variables: { after: authorContent?.pageInfo?.endCursor },
        // @ts-ignore
		updateQuery: getUpdateQuery( 'authorContent.nodes' ),
	} );
	return { author, content, fetchMore: fetch, loading, hasMore };
}
