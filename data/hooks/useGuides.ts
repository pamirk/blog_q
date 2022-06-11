import { useGuidesQuery } from '@quartz/content';
import { getArticleProps } from 'helpers/data/article';
import { notUndefinedOrNull } from 'helpers/typeHelpers';
import { ResourceNotFoundError } from 'helpers/errors';

export default function useGuides(
	props: {
		perPage?: number,
		postsPerGuide?: number,
		search?: string | null
	}
) {
	const { perPage = 10, postsPerGuide = 1, search } = props;
	const { data, fetchMore, loading } = useGuidesQuery( {
		notifyOnNetworkStatusChange: true,
		variables: {
			// Over query so we can remove guides with no published posts.
			perPage: perPage + 2,
			postsPerGuide,
			search,
		},
	} );

	if ( ! data?.guides && ! loading ) {
		console.info()
		throw new ResourceNotFoundError();
	}

	return {
		guides: data?.guides?.nodes
			?.filter( guide => guide?.posts?.nodes?.length )
			?.filter( notUndefinedOrNull )
			.map( guide => ( {
				...guide,
				posts: guide?.posts?.nodes?.map( getArticleProps ),
			} ) ),
		loading,
		startCursor: data?.guides?.pageInfo?.startCursor,
		hasPreviousPage: data?.guides?.pageInfo?.hasPreviousPage,
		fetchMore,
	};
}
