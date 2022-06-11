import { useContributorsQuery } from '@quartz/content';
import { getArticleProps } from 'helpers/data/article';
import { notUndefinedOrNull } from 'helpers/typeHelpers';
import { ResourceNotFoundError } from 'helpers/errors';

export default function useContributors( perPage = 10 ) {
	const { data, loading, fetchMore } = useContributorsQuery( {
		variables: { perPage },
		notifyOnNetworkStatusChange: true,
	} );

	if ( ! loading && ! data ) {
		throw new ResourceNotFoundError();
	}

	const authors = data?.menuItems?.nodes
		?.map( node => {
			if ( node?.connectedObject?.__typename === 'CoAuthor' ) {
				return node.connectedObject; // selecting the connected type we want to help TypeScript narrow down the type
			}
			return null;
		} )
		?.filter( notUndefinedOrNull );

	const articles = authors?.map( node => node?.posts?.nodes?.[0] ).map( getArticleProps );

	return { articles, loading, fetchMore };
}
