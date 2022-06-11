import {useArticlesByTopicQuery} from '@quartz/content';
import {getArticleProps} from 'helpers/data/article';
import {ResourceNotFoundError} from 'helpers/errors';
import getUpdateQuery from 'data/apollo/getUpdateQuery';

export default function useArticlesByTopic(slug: string, perPage = 10, ssr = true) {
    const {data, fetchMore, loading} = useArticlesByTopicQuery({
        variables: {perPage, slug: [slug]},
        ssr,
        notifyOnNetworkStatusChange: true,
    });
    const topic = data?.topics?.nodes?.[0];
    if (!loading && !topic) {
        throw new ResourceNotFoundError();
    }
    const hasMore = !!topic?.posts?.pageInfo?.hasNextPage;
    const articles = data?.topics?.nodes?.[0]?.posts?.nodes?.map(getArticleProps);

    const fetch = () => fetchMore({
        variables: {after: topic?.posts?.pageInfo?.endCursor},
        // @ts-ignore
        updateQuery: getUpdateQuery('topics.nodes[0].posts.nodes'),
    });
    return {articles, fetchMore: fetch, loading, hasMore, topic};
}
