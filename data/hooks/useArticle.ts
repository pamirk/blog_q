import { ArticlePartsFragment, useArticleQuery } from '@quartz/content';

interface ArticleQueryResults {
	article?: ArticlePartsFragment,
	loading: boolean,
	refetch: () => void,
}

export default function useArticle ( props: {
	postId: number,
	previewTime?: number,
	previewToken?: string
} ): ArticleQueryResults {
	const { postId: id, previewTime, previewToken } = props;

	const { data, error, loading, refetch } = useArticleQuery( {
		variables: {
			id,
			previewTime,
			previewToken,
		},
	} );

	// If the query returns an error, throw it.
	if ( error ) {
		throw error;
	}

	return {
		article: data?.posts?.nodes?.[0] ?? undefined,
		loading,
		refetch,
	};
}
