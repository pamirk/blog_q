import React, {Fragment} from 'react';
import {useRouter} from 'next/router';
import {PageHeader, ResponsiveImage, Spinner, TabNav, TabNavItem,} from '@quartz/interface';
import BulletinKicker from 'components/BulletinKicker/BulletinKicker';
import Link from 'components/Link/Link';
import ListWithAds from 'components/List/ListWithAds';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import Page, {PageLoading} from 'components/Page/Page';
import useArticlesByObsession from 'data/hooks/useArticlesByObsession';
import useEssentialsByObsession from 'data/hooks/useEssentialsByObsession';
import Essentials from 'components/Essentials/Essentials';
import styles from './Obsession.module.scss';
import usePageVariant from 'helpers/hooks/usePageVariant';

export function transformSponsorObsessionArticles(articles, sponsor) {
    return articles.map(article => {
        // If the obsession is sponsored, transfer the sponsor info to
        // promotions that belong to this obsession.
        if (sponsor && 'Promotion' === article.__typename) {
            return {
                ...article,
                bulletin: {
                    sponsor: {
                        name: sponsor.name,
                    },
                    campaign: sponsor.campaign,
                    clientTracking: {
                        elsewhere: [],
                    },
                },
                link: article.destination || '',
            };
        }

        return article;
    });
}

function ObsessionLatestArticles(props: {
    data?: ReturnType<typeof useArticlesByObsession>,
    slug: string,
}) {
    const {
        articles,
        fetchMore,
        hasMore,
        loading,
    } = props.data ?? {};

    return (
        <Fragment>
            <ListWithAds
                ad={{
                    path: 'list',
                    targeting: {
                        page: 'obsession',
                        term: props.slug,
                        taxonomy: 'obsession',
                    },
                }}
                collection={articles}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={hasMore}
                loadMore={fetchMore}
            />
        </Fragment>
    );
}

function ObsessionEssentials(props: { slug: string }) {
    const {essentials} = useEssentialsByObsession(props.slug);

    if (!essentials) {
        return (
            <div className={styles.spinner}>
                <Spinner/>
            </div>
        );
    }

    return (
        <div className={styles.essentials}>
            <Essentials
                ad={{
                    path: 'list',
                    targeting: {
                        page: 'obsession',
                        taxonomy: 'essential',
                    },
                }}
                collectionId={essentials?.collectionId}
                collectionTitle={essentials?.title ?? undefined}
                blocks={essentials?.blocks}
                trackingContext="obsession-landing"
            />
        </div>
    );
}

export default function Obsession() {
    const {edition} = usePageVariant();
    const {slug, tab} = useRouter().query;
    const data = useArticlesByObsession(slug as string);

    if (!data?.obsession) {
        return <PageLoading/>;
    }

    let isLatest = 'latest' === tab;

    let canonicalPath = `/on/${slug}/`;
    if ('WORK' === edition) {
        canonicalPath = `/work${canonicalPath}`;
    }
    if (isLatest) {
        canonicalPath = `${canonicalPath}latest/`;
    }

    const {
        description,
        featuredImage,
        hasEssentials,
        headerImage,
        name,
        sponsor,
    } = data.obsession;

    const metaDescription = description ? description : `In-depth coverage and articles about ${name} from Quartz`;

    const uniqueName = name && isLatest ? `${name} — Latest` : name;
    const uniqueDescription = metaDescription && isLatest ? `${metaDescription} Read our latest.` : metaDescription;

    isLatest = isLatest || !hasEssentials;

    return (
        <Page
            canonicalPath={canonicalPath}
            feedLink={`/obsession/${slug}/`}
            pageDescription={uniqueDescription ?? ''}
            pageTitle={uniqueName ?? ''}
            pageType="obsession"
            pageViewData={{obsession: data.obsession}}
            socialImage={featuredImage?.sourceUrl ?? headerImage?.sourceUrl ?? ''}
        >
            {
                headerImage &&
                <div className={styles.headerImageContainer}>
                    <ResponsiveImage
                        alt=""
                        amp={false}
                        className={styles.headerImage}
                        fallbackHeight={280}
                        fallbackWidth={620}
                        quality={35}
                        sizes="(max-width: 768px) 620px, 886px"
                        src={headerImage.sourceUrl ?? ''}
                        widthRange={[620, 886]}
                    />
                </div>
            }
            <PageHeader
                title={name ?? ''}
                intro={description}
                showPadding={false}
                border={!!hasEssentials}
            >
                {
                    headerImage?.credit &&
                    <p className={styles.credit}>{headerImage.credit}</p>
                }
                {
                    sponsor?.name &&
                    <div className={styles.sponsor}>
                        <BulletinKicker
                            image={sponsor.campaign?.logo}
                            link={sponsor.campaign?.logoLink}
                            sponsor={sponsor.name}
                        />
                    </div>
                }
                {
                    !!hasEssentials &&
                    <TabNav>
                        <TabNavItem isActive={!isLatest}>
                            <Link to={`/on/${slug}/`}>Quartz Essentials</Link>
                        </TabNavItem>
                        <TabNavItem isActive={isLatest}>
                            <Link to={`/on/${slug}/latest/`}>All stories</Link>
                        </TabNavItem>
                    </TabNav>
                }
            </PageHeader>
            {
                isLatest &&
                <ObsessionLatestArticles data={data} slug={slug as string}/>
            }
            {
                !isLatest &&
                <ObsessionEssentials slug={slug as string}/>
            }
        </Page>
    );
}
