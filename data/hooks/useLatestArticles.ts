import { useLatestArticlesQuery, EditionName, ArticleTeaserPartsFragment } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

export default function useLatestArticles ( props?: { edition?: EditionName, postsPerPage?: number } ) {
	const { data, fetchMore, loading } = useLatestArticlesQuery( {
		// variables: { edition: props?.edition, postsPerPage: props?.postsPerPage || 20 },
		variables: { edition: props?.edition, postsPerPage: 30 },
		notifyOnNetworkStatusChange: true,
	}  );

	const posts: ArticleTeaserPartsFragment[] | undefined = data?.posts?.nodes?.filter( notUndefinedOrNull );

	return {
		posts,
		loading,
		endCursor: data?.posts?.pageInfo?.endCursor,
		hasNextPage: data?.posts?.pageInfo?.hasNextPage,
		fetchMore,
	};
}
