import {useArticlesBySeriesQuery} from '@quartz/content';
import {getArticleProps} from 'helpers/data/article';
import {ResourceNotFoundError} from 'helpers/errors';
import getUpdateQuery from 'data/apollo/getUpdateQuery';

export default function useArticlesBySeries(slug: string, perPage = 10, ssr = true) {
    const {data, fetchMore, loading} = useArticlesBySeriesQuery({
        variables: {perPage, slug: [slug]},
        ssr,
        notifyOnNetworkStatusChange: true,
    });
    const series = data?.serieses?.nodes?.[0];
    if (!loading && !series) {
        throw new ResourceNotFoundError();
    }
    const hasMore = !!series?.posts?.pageInfo?.hasNextPage;
    const articles = data?.serieses?.nodes?.[0]?.posts?.nodes?.map(getArticleProps);
    if (articles?.length && series?.postOrder?.length) {
        articles.sort(
            (a, b) => (series.postOrder?.indexOf(a.postId) ?? 0) - (series.postOrder?.indexOf(b.postId) ?? 0)
        );
    }
    const fetch = () => fetchMore({
        variables: {after: series?.posts?.pageInfo?.endCursor},
        // @ts-ignore
        updateQuery: getUpdateQuery('serieses.nodes[0].posts.nodes'),
    });
    return {articles, fetchMore: fetch, loading, hasMore, series};
}
