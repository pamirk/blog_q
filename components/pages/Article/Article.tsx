import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { ArticlePartsFragment } from '@quartz/content';
import ArticleMeta from 'components/ArticleMeta/ArticleMeta';
import ArticleSchema from 'components/Schema/ArticleSchema';
import ArticleHeader from 'components/ArticleHeader/ArticleHeader';
import ArticleVideo from 'components/ArticleVideo/ArticleVideo';
import ArticleContent from 'components/ArticleContent/ArticleContent';
import ArticleShareTools from 'components/ArticleShareTools/ArticleShareTools';
import BulletinKicker from 'components/BulletinKicker/BulletinKicker';
import Interactive from 'components/Interactive/Interactive';
import Page, { PageLoading } from 'components/Page/Page';
import Recirculation from 'components/Recirculation/Recirculation';
import SubscribeBar from 'components/SubscribeBar/SubscribeBar';
import AmpAnalytics from 'components/AmpAnalytics/AmpAnalytics';
import ArticleReadSuggestions from 'components/ArticleReadSuggestions/ArticleReadSuggestions';
import { schemes } from '@quartz/interface';
import { isAmpSafe } from 'helpers/amp';
import { getRelativeLink } from 'helpers/urls';
import { logImpression } from 'helpers/utils';
import { getArticleProps } from 'helpers/data/article';
import getArticleQualifiers from 'helpers/data/articleQualifiers';
import useArticlePaywallState from 'helpers/hooks/useArticlePaywallState';
import usePageVariant from 'helpers/hooks/usePageVariant';
import useUserRole from 'helpers/hooks/useUserRole';
import useArticle from 'data/hooks/useArticle';
import useScrollDepth from 'helpers/hooks/useScrollDepth';
import useElapsedTime from 'helpers/hooks/useElapsedTime';
import styles from './Article.module.scss';
import { MarqueeUnit } from 'components/Ad/Marquee/Marquee';
import Spotlight from 'components/Ad/Spotlight/Spotlight';
import ArticleEssentials from 'components/ArticleEssentials/ArticleEssentials';
import NotFound from 'components/pages/NotFound/NotFound';
import ClientOnly from 'components/ClientOnly/ClientOnly';
import segmentTrackArticleConsumed from 'helpers/tracking/segment/trackArticleConsumed';
import segmentTrackPaywallFired from 'helpers/tracking/segment/trackPaywallFired';
import usePiano from 'helpers/hooks/usePiano';

// Map our article qualifiers to Piano tags.
// we'll use these to control the algorithmic paywall
const qualifiersToTags = {
    isBulletin: 'bulletin',
    isInteractive: 'interactive',
    isPaywalled: 'paywalled',
    isPremium: 'premium',
    isVideo: 'video',
};

function getCanonicalPath ( {
                                article,
                                isAmp,
                                isInApp,
                                isPreview,
                                pathname,
                            } ) {
    if ( isPreview ) {
        return pathname;
    }

    const canonicalPath = decodeURIComponent( getRelativeLink( article.link ) || '' );

    if ( isInApp ) {
        return `${canonicalPath}app`;
    }

    if ( isAmp && isAmpSafe( article ) ) {
        return `${canonicalPath}amp/`;
    }

    return canonicalPath;
}

// Log tracking URLs on mount.
export function useLogging ( trackingUrls: string[] ) {
    useEffect( () => {
        if ( trackingUrls ) {
            trackingUrls.forEach( logImpression );
        }
    }, [ trackingUrls ] );
}

// Refetch if the article has not changed but showPaywall has changed. Or, if
// the user was redirected from the Login page, a flag to refetch may be set.
export function useRefetch ( refetch: () => void, id: string, needsRefetch: boolean, showPaywall: boolean ) {
    const refetchRef = useRef( { id, showPaywall } );

    useEffect( () => {
        const prev = refetchRef.current;

        if ( needsRefetch || id === prev.id && showPaywall !== prev.showPaywall ) {
            refetch();
        }

        refetchRef.current = { id, showPaywall };
    }, [ id, needsRefetch, refetch, showPaywall ] );
}

export function Article ( props: {
    article: ArticlePartsFragment,
    refetch: () => void,
    disablePaywall?: boolean,
    time?: number,
    token?: string,
} ) {
    const router = useRouter()
    const {  pathname } = router;
    const needsRefetch = !router.isReady
    const { edition, isAmp, isInApp, isPreview } = usePageVariant();
    const { isMember } = useUserRole();

    const article = getArticleProps( props.article );
    const qualifiers = getArticleQualifiers( article );

    const {
        ad,
        authors,
        id,
        interactive,
        link,
        obsession,
        postId,
        series,
        show,
        seoTitle,
        socialDescription,
        socialImage,
        socialTitle,
        summary,
        title,
        suppressAds,
        topic,
        trackingUrls,
        trailerVideo,
        video,
    } = article;
    const {
        darkModeDisabled,
        hasTOC,
        isBulletin,
        isInteractive,
        isPaywalled,
        isVideo,
        showHeader,
    } = qualifiers;

    const [ paywallType ] = useArticlePaywallState( article, qualifiers );
    const [ hasTrackedArticleConsumed, setHasTrackedArticleConsumed ] = useState<boolean>( false );

    const showPaywall = !! paywallType && props.disablePaywall !== true;

    useLogging( trackingUrls );
    useRefetch( props.refetch, id, needsRefetch, showPaywall );

    const { pianoConfigured, tp } = usePiano();

    useEffect( () => {
        if ( !pianoConfigured ) {
            return;
        }

        const tags = Object.keys( qualifiers ).map( qualifier => {
            if ( qualifiers[ qualifier ] && qualifiersToTags[ qualifier ] ) {
                return qualifiersToTags[ qualifier ];
            }
        } ).filter( i => !!i );

        tp.push( [ 'setTags', tags ] );
        tp.experience.execute();

    }, [ qualifiers, tp, pianoConfigured ] );

    // track article depth and elapsed [time] to determine whether the article has been engaged with
    const [ ref, milestone ] = useScrollDepth();
    const getElapsedTime = useElapsedTime();

    const showShareTools = ! showPaywall && ! isInApp;
    const showRecirculation = ! showPaywall;
    const showReadNext = ! showPaywall;

    /**
     * Set theme colors and determine whether or not to allow dark-mode theming.
     * Interactive bulletins and interactives should never respect dark mode. If
     * it's anything else, use the info we get from the CMS to determine whether or
     * not we allow dark-mode.
     */
    let colorSchemes;
    const taxonomyColors = show?.colors || series?.colors;
    if ( taxonomyColors?.length >= 3 ) {
        const [
            typography,
            background1,
            accent,
        ] = taxonomyColors;

        colorSchemes = [
            {
                accent,
                background1,
                type: 'default',
                typography,
            },
        ];
    }

    if ( isBulletin || darkModeDisabled ) {
        colorSchemes = [
            {
                ...schemes.LIGHT,
                type: 'default',
            },
        ];
    }

    // we want to extract these properties before using them because as objects, their signatures change
    // but we only want to fire the tracking event once
    useEffect( () => {
        const elapsedTime = getElapsedTime();

        // track Article Consumed if there's no paywall, we haven't already tracked it, the user has
        // made it halfway through the article, and has spent at least 5 seconds on the page
        if ( !showPaywall && !hasTrackedArticleConsumed && ( milestone ?? 0 ) >= 0.5 && elapsedTime >= 5000 ) {
            segmentTrackArticleConsumed( {
                authors: authors.map( author => author.name ),
                edition,
                isMember,
                obsession: obsession?.name,
                title,
                topic: topic?.name,
            } );
            setHasTrackedArticleConsumed( true );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ milestone ] );

    useEffect( () => {
        if ( showPaywall && typeof paywallType === 'string' ) {
            segmentTrackPaywallFired( { paywallType } );
        }
    }, [ showPaywall, paywallType, title ] );

    const canonicalPath = getCanonicalPath( {
        article,
        isAmp,
        isInApp,
        isPreview,
        pathname,
    } );

    const description = socialDescription || summary;

    const showMarquee = ! isBulletin && ! suppressAds && ! isPaywalled;

    return (
        <Page
            canonicalUrl={link}
            canonicalPath={canonicalPath}
            colorSchemes={colorSchemes}
            pageDescription={description.length > 50 && description}
            pageTitle={seoTitle || title}
            pageType={isBulletin ? 'bulletin' : 'article'}
            pageViewData={{ article }}
            redirectCanonical={true}
            showMarquee={showMarquee}
            socialImage={socialImage}
            socialTitle={socialTitle || title}
        >
            <ArticleMeta article={article} isAmp={isAmp} />

            {
                showMarquee &&
                <MarqueeUnit
                    path={ad.path}
                    targeting={ad.targeting}
                />
            }

            <article>

                {showHeader && <ArticleHeader isAmp={isAmp} {...article} {...qualifiers} />}

                {
                    !showHeader && isBulletin &&
                    <div className={styles[ 'bulletin-kicker-container' ]}>
                        <BulletinKicker
                            image={article.bulletin.campaign.logo}
                            link={article.bulletin.clientTracking.logo}
                            sponsor={article.bulletin.sponsor.name}
                        />
                    </div>
                }

                {
                    isVideo &&
                    <div className={styles[ 'video-container' ]}>
                        <ArticleVideo
                            featuredImage={article.featuredImage}
                            showPaywall={showPaywall}
                            trailerVideo={trailerVideo}
                            video={video}
                        />
                    </div>
                }

                {isInteractive && <Interactive {...interactive} />}

                <div ref={ref}>
                    <ArticleContent
                        ad={ad}
                        article={article}
                        hasTOC={hasTOC}
                        isAmp={isAmp}
                        isInApp={isInApp}
                        isMember={isMember}
                        paywallType={showPaywall ? paywallType : null}
                        {...qualifiers}
                    />
                </div>

                {
                    showShareTools &&
                    <ArticleShareTools
                        authorName={article.authors[0]?.name}
                        link={article.link}
                        summary={article.summary}
                        title={article.title}
                    />
                }

            </article>

            {
                showReadNext &&
                <ArticleReadSuggestions
                    hasTOC={hasTOC}
                    {...article}
                    {...qualifiers}
                />
            }

            {
                !!postId &&
                <ClientOnly>
                    <ArticleEssentials postId={postId} isInApp={isInApp} ad={ad} time={props.time} token={props.token} />
                </ClientOnly>
            }

            {
                showRecirculation &&
                <>
                    {
                        ! suppressAds && ! isPaywalled &&
                        <Spotlight
                            path={ad.path}
                            id="spotlight-1"
                            targeting={{ ...ad.targeting, tile: 1 }}
                        />
                    }
                    <Recirculation
                        ad={ad}
                        edition={edition}
                        postId={postId}
                        showBulletin={!suppressAds}
                        showEngage={! suppressAds && ! isPaywalled}
                        ssr={isAmp}
                    />
                </>
            }

            {
                isAmp &&
                <AmpAnalytics
                    article={article}
                    edition={edition}
                />
            }

            <ArticleSchema article={article} />

            <SubscribeBar />
        </Page>
    );
}

// This component encapsulates just the query hook because we need to return
// early when loading. The "rule of hooks" means we can’t have hooks after the
// early return that run conditionally.
export default function ArticleWithQuery( props: { disablePaywall?: boolean } ) {
    const router = useRouter()
    const { postId, time, token } = router.query;

    const { article, loading, refetch } = useArticle( {
        postId: (postId && parseInt( postId as string, 10 )) as number,
        previewTime: (time && parseInt( time as string, 10 )) as number,
        previewToken: token as string,
    } );

    if ( ! article ) {
        // Not loading? 404.
        if ( ! loading ) {
            return <NotFound />;
        }

        return <PageLoading />;
    }

    return (
        <Article
            article={article}
            refetch={refetch}
            time={parseInt( time as string, 10 )}
            token={token as string}
            {...props}
        />
    );
}
