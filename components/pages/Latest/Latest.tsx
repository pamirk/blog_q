import React from 'react';
import {useRouter} from 'next/router';
import ListWithAds from 'components/List/ListWithAds';
import {EditionName} from '@quartz/content';
import {PageHeader, Spinner, TabNav, TabNavItem} from '@quartz/interface';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import Page from 'components/Page/Page';
import useLatestFeedContent from 'data/hooks/useLatestFeedContent';
import useLatestArticles from 'data/hooks/useLatestArticles';
import useEmailsByTag from 'data/hooks/useEmailsByTag';
import {getArticleOrEmailProps} from 'helpers/data/email';
import usePageVariant from 'helpers/hooks/usePageVariant';
import Link from 'components/Link/Link';
import getMeta from 'config/meta';
import styles from './Latest.module.scss';

const ad = {
    path: 'list',
    targeting: {
        page: 'latest',
    },
};

function LatestEdition(props: { edition: EditionName }) {
    const {posts, loading, endCursor, hasNextPage, fetchMore} = useLatestArticles({edition: props.edition});

    if (!posts) {
        return (
            <div className={styles.loading}>
                <Spinner/>
            </div>
        );
    }

    const articles = posts.map(post => getArticleOrEmailProps(post));

    return (
        <>
            <ListWithAds
                ad={ad}
                collection={articles}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={!!hasNextPage}
                loadMore={() => fetchMore({variables: {after: endCursor}})}
            />
        </>
    );
}

function LatestWithEmails() {
    const {endCursor, fetchMore, loading, posts} = useLatestFeedContent();

    if (!posts) {
        return (
            <div className={styles.loading}>
                <Spinner/>
            </div>
        );
    }

    return (
        <>
            <ListWithAds
                ad={ad}
                collection={posts}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={!!endCursor}
                loadMore={fetchMore}
            />
        </>
    );
}

function LatestEmails() {
    const {emails, hasNextPage, loading, fetchMore} = useEmailsByTag('show-email-in-feeds');

    if (!emails) {
        return (
            <div className={styles.loading}>
                <Spinner/>
            </div>
        );
    }

    return (
        <>
            <ListWithAds
                ad={ad}
                collection={emails}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={!!hasNextPage}
                loadMore={fetchMore}
            />
        </>
    );
}

function Latest() {
    const {edition} = usePageVariant();
    const router = useRouter()

    const {isEmailFeed} = router.query;

    let canonicalPath = !!isEmailFeed ? '/latest/emails/' : '/latest/';
    let feedLink = '/';

    if ('QUARTZ' !== edition) {
        canonicalPath = `/${edition.toLowerCase()}/latest/`;
        feedLink = `/edition/${edition.toLowerCase()}`;
    }

    const QuartzEditionFeed = !!isEmailFeed ? LatestEmails : LatestWithEmails;

    return (
        <Page
            canonicalPath={canonicalPath}
            feedLink={feedLink}
            pageTitle={!!isEmailFeed ? 'Latest newsletters' : 'Latest stories'}
            pageDescription={`The latest ${!!isEmailFeed ? 'newsletters' : 'stories'} from ${getMeta(edition).title}`}
            pageType="latest"
        >
            {/*<PageHeader*/}
            {/*    showPadding={false}*/}
            {/*    title="Latest">*/}
                <TabNav>
                    {/*<TabNavItem isActive={!isEmailFeed && edition === 'QUARTZ'}>
                        <Link to="/latest/">{getMeta('QUARTZ').title}</Link>
                    </TabNavItem>*/}
                    <TabNavItem isActive={edition === 'WORK'}>
                        <Link to="/work/latest/">{getMeta('WORK').title}</Link>
                    </TabNavItem>
                    {/* <TabNavItem isActive={edition === 'AFRICA'}>
                        <Link to="/africa/latest/">{getMeta('AFRICA').title}</Link>
                    </TabNavItem>
                    <TabNavItem isActive={edition === 'INDIA'}>
                        <Link to="/india/latest/">{getMeta('INDIA').title}</Link>
                    </TabNavItem>
                    <TabNavItem isActive={edition === 'JAPAN'}>
                        <Link to="/japan/latest/">{getMeta('JAPAN').title}</Link>
                    </TabNavItem>
                    <TabNavItem isActive={!!isEmailFeed}>
                        <Link to="/latest/emails/">Emails</Link>
                    </TabNavItem>*/}
                </TabNav>
            {/*</PageHeader>*/}
            {
                // 'QUARTZ' !== edition ?
               true ?
                    <LatestEdition edition={edition}/>
                    :
                    <QuartzEditionFeed/>
            }
        </Page>
    );
}

export default Latest;
