import React from 'react';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import ListWithAds from 'components/List/ListWithAds';
import Page, {PageLoading} from 'components/Page/Page';
import {PageHeader} from '@quartz/interface';
import useArticlesByPopularity from 'data/hooks/useArticlesByPopularity';
import usePageVariant from 'helpers/hooks/usePageVariant';

function Popular() {
    const {edition} = usePageVariant();

    const {articles, fetchMore, hasMore, loading} = useArticlesByPopularity(edition);

    if (!articles) {
        return <PageLoading/>;
    }

    let canonicalPath = '/popular/';
    if ('QUARTZ' !== edition) {
        canonicalPath = `/${edition.toLowerCase()}/popular/`;
    }

    return (
        <Page
            canonicalPath={canonicalPath}
            feedLink="/popular/"
            pageTitle="Popular Stories"
            pageType="popular"
        >
            <PageHeader title="Popular stories"/>
            <ListWithAds
                ad={{
                    path: 'list',
                    targeting: {
                        page: 'popular',
                    },
                }}
                collection={articles}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={hasMore}
                loadMore={fetchMore}
            />
        </Page>
    );
}

export default Popular;
