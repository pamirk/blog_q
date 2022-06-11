import React from 'react';
import {Spinner} from '@quartz/interface';
import TopicSection from 'components/TopicSection/TopicSection';
import FeatureSection from 'components/FeatureSection/FeatureSection';
import ExploreCarousel from 'components/ExploreCarousel/ExploreCarousel';
import ListWithAds from 'components/List/ListWithAds';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import styles from './DiscoverTabs.module.scss';
import useGuides from 'data/hooks/useGuides';
import useArticlesByPopularity from 'data/hooks/useArticlesByPopularity';
import useLatestFeedContent from 'data/hooks/useLatestFeedContent';
import useEmailsByTag from 'data/hooks/useEmailsByTag';
import {useTopicsQuery} from '@quartz/content';

function ListContainer(props: {
    children: React.ReactNode,
}) {
    return (
        <div className={styles.listContainer}>
            {props.children}
        </div>
    );
}

function PageContainer(props: {
    children: React.ReactNode,
}) {
    return (
        <div className={styles.pageContainer}>
            {props.children}
        </div>
    );
}

function Placeholder() {
    return (
        <div className={styles.spinner}>
            <Spinner/>
        </div>
    );
}

export function DiscoverGuidesTab() {
    const {fetchMore, guides, startCursor, loading} = useGuides({postsPerGuide: 3});

    if (!guides) {
        return <Placeholder/>;
    }

    return (
        <PageContainer>
            {
                guides.map(guide => {
                    if (!guide) {
                        return null;
                    }
                    return (
                        <FeatureSection
                            key={guide.slug}
                            description={guide.shortDescription ?? ''}
                            featuredImage={guide.featuredImage}
                            name={guide.name ?? ''}
                            posts={guide.posts}
                            link={`/guide/${guide.slug}/`}
                        />
                    );
                })
            }
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={!!startCursor}
                loadMore={() => fetchMore({variables: {before: startCursor}})}
            />
        </PageContainer>
    );
}

export function DiscoverLatestTab() {
    const {endCursor, fetchMore, loading, posts} = useLatestFeedContent();

    if (!posts) {
        return <Placeholder/>;
    }

    return (
        <ListContainer>
            <ListWithAds
                ad={{
                    path: 'list',
                    targeting: {
                        page: 'latest',
                    },
                }}
                collection={posts}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={!!endCursor}
                loadMore={fetchMore}
            />
        </ListContainer>
    );
}

export function DiscoverTopicsTab() {
    const topics = useTopicsQuery(undefined)?.data?.topics?.nodes;

    if (!topics) {
        return <Placeholder/>;
    }

    return (
        <PageContainer>
            {
                topics.map(topic => topic && <TopicSection key={topic.slug} slug={topic.slug ?? ''}/>)
            }
        </PageContainer>
    );
}

export function DiscoverTrendingTab() {
    const {articles} = useArticlesByPopularity('QUARTZ');

    if (!articles) {
        return <Placeholder/>;
    }

    return (
        <ListContainer>
            <ListWithAds
                ad={{
                    path: 'list',
                    targeting: {
                        page: 'trending',
                    },
                }}
                collection={articles}
            />
        </ListContainer>
    );
}

export function DiscoverEmailsTab() {
    const {emails, hasNextPage, loading, fetchMore} = useEmailsByTag('show-email-in-feeds');

    if (!emails) {
        return <Placeholder/>;
    }

    return (
        <ListContainer>
            <ListWithAds
                ad={{
                    path: 'list',
                    targeting: {
                        page: 'latest',
                    },
                }}
                collection={emails}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={!!hasNextPage}
                loadMore={fetchMore}
            />
        </ListContainer>
    );
}

export function DiscoverAllTab() {
    const guidesData = useGuides({perPage: 3, postsPerGuide: 3});
    const {posts} = useLatestFeedContent({postsPerPage: 3});
    const {articles: popularArticles} = useArticlesByPopularity('QUARTZ');

    if (!guidesData?.guides || !posts || !popularArticles) {
        return <Placeholder/>;
    }

    return (
        <div className={styles.sections}>
            <ExploreCarousel
                link="/discover/latest/"
                name="Latest"
            >
                <FeatureSection posts={posts}/>
            </ExploreCarousel>
            <ExploreCarousel
                link="/discover/trending/"
                name="Trending"
                moreText="More trending stories"
            >
                <FeatureSection posts={popularArticles}/>
            </ExploreCarousel>
            <ExploreCarousel
                link="/discover/topics/"
                name="Topics"
                moreText="More topics"
            >
                <TopicSection slug="emerging-industries"/>
                <TopicSection slug="tech-and-communications"/>
                <TopicSection slug="work-and-management"/>
            </ExploreCarousel>
            <ExploreCarousel
                link="/guides/"
                name="Field Guides"
                moreText="More field guides"
            >
                {
                    guidesData.guides.slice(0, 3).map(({shortDescription, featuredImage, name, posts, slug}) => (
                        <FeatureSection
                            key={slug}
                            featuredImage={featuredImage}
                            link={`/guide/${slug}/`}
                            name={name ?? ''}
                            posts={posts || []}
                            shortDescription={shortDescription ?? ''}
                        />
                    ))
                }
            </ExploreCarousel>
        </div>
    );
}
