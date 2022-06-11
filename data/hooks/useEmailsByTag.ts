import getUpdateQuery from 'data/apollo/getUpdateQuery';
import {useEmailsByTagQuery as emailsByTagQuery} from '@quartz/content';
import {getArticleOrEmailProps} from 'helpers/data/email';

export default function useEmailsByTagQuery(slug: Array<string> | string, perPage = 10, ssr = true) {
    const slugArray = Array.isArray(slug) ? slug : [slug];

    const queryOptions = {
        notifyOnNetworkStatusChange: true, // needed to get an accurate loading prop on fetchMore
        ssr,
        variables: {
            perPage,
            slug: slugArray,
        },
    };

    const {data, error, fetchMore, loading} = emailsByTagQuery(queryOptions);

    if (error) {
        throw error;
    }

    const emails = data?.emails?.nodes?.map(email => getArticleOrEmailProps(email));

    return {
        emails,
        fetchMore: () => fetchMore({
            variables: {
                after: data?.emails?.pageInfo?.endCursor,
            },
            // @ts-ignore
            updateQuery: getUpdateQuery('emails.nodes'),
        }),
        hasNextPage: data?.emails?.pageInfo?.hasNextPage,
        loading,
    };
}
