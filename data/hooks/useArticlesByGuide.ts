import {useArticlesByGuideQuery} from '@quartz/content';
import {getArticleProps} from 'helpers/data/article';
import {ResourceNotFoundError} from 'helpers/errors';
import getUpdateQuery from 'data/apollo/getUpdateQuery';

export default function useArticlesByGuide(slug: string, perPage = 10, ssr = true) {
    const {data, fetchMore, loading} = useArticlesByGuideQuery({
        variables: {perPage, slug: [slug]},
        ssr,
        notifyOnNetworkStatusChange: true,
    });
    const guide = data?.guides?.nodes?.[0];
    if (!loading && !guide) {
        throw new ResourceNotFoundError();
    }
    const hasMore = !!guide?.posts?.pageInfo?.hasNextPage;
    const articles = data?.guides?.nodes?.[0]?.posts?.nodes?.map(getArticleProps);

    const fetch = () => fetchMore({
        variables: {after: guide?.posts?.pageInfo?.endCursor},
        // @ts-ignore
        updateQuery: getUpdateQuery('guides.nodes[0].posts.nodes'),
    });
    return {articles, fetchMore: fetch, loading, hasMore, guide};
}
