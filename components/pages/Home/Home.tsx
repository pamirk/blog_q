import React, {Fragment} from 'react';
import {useRouter} from 'next/router';
import styles from './Home.module.scss';
import useHomeCollection from 'data/hooks/useHomeCollection';
import {ButtonLabel} from '@quartz/interface';
import {ContentBlock} from 'components/ContentBlocks/ContentBlocks';
import {HomeFeedInline} from 'components/Ad/Ad';
import Figure from 'components/Figure/Figure';
import HomepagePromo from 'components/HomepagePromo/HomepagePromo';
import LatestArticleFeed from 'components/LatestArticleFeed/LatestArticleFeed';
import LatestGuidePromo from 'components/LatestGuidePromo/LatestGuidePromo';
import {MarqueeUnit} from 'components/Ad/Marquee/Marquee';
import Page, {PageLoading} from 'components/Page/Page';
import UserGreeting from 'components/UserGreeting/UserGreeting';
import {uppercaseFirstLetter} from 'helpers/text';
import Link from 'components/Link/Link';
import {CollectionPartsFragment} from '@quartz/content';
import usePageVariant from 'helpers/hooks/usePageVariant';
import SponsoredEssentialStack from 'components/Essentials/SponsoredEssential/SponsoredEssential';
import getMeta from 'config/meta';

const NUGS_PER_AD = 2;

export function HomeFeedBlocks(props: {
    blocks: CollectionPartsFragment[ 'blocks' ],
}) {
    if (!props.blocks?.length) {
        return null;
    }

    let nugIndex = 0;
    let adCounter = 0;

    const {
        hasSponsoredEssential,
        sponsoredEssential,
    } = SponsoredEssentialStack({
        ad: {
            path: 'home',
            targeting: {
                page: 'home',
                region: 'global',
                taxonomy: 'essential',
            },
        },
    });

    return (
        <Fragment>
            {
                props.blocks.map((block, index) => {
                    if (!block?.type) {
                        return null;
                    }

                    // Logic to determine whether we should show an ad after this
                    // block. Namely, is the block a nug and have we already
                    // shown [NUGS_PER_AD] nugs without an ad?
                    let showAd = false;
                    const isNug = block.type === 'QZ_POST_TOUT' && block.connections?.[0]?.__typename === 'Nug';

                    if (isNug) {
                        nugIndex++;

                        if (0 === nugIndex % NUGS_PER_AD) {
                            adCounter++;
                            showAd = true;
                        }
                    }

                    return (
                        <Fragment key={index}>
                            <ContentBlock
                                attributes={block.attributes}
                                connections={block.connections}
                                id={block.id}
                                innerHtml={block.innerHtml}
                                location="home"
                                tagName={block.tagName}
                                type={block.type}
                            />
                            {
                                showAd &&
                                <HomeFeedInline
                                    id={`ad-${adCounter}`}
                                    path="home"
                                    targeting={{
                                        region: 'global',
                                        tile: adCounter,
                                    }}
                                />
                            }
                            {
                                index === 0 &&
                                <>
                                    {
                                        hasSponsoredEssential &&
                                        <hr className="hr"/>
                                    }
                                    {sponsoredEssential}
                                </>
                            }
                        </Fragment>

                    );
                })
            }
        </Fragment>
    );
}

export default function Home() {
    const collection = useHomeCollection();
    const router = useRouter();
    const {pathname} = router;
    const {edition} = usePageVariant();
    const {postId} = router.query;

    if (!collection) {
        return <PageLoading/>;
    }

    const {
        altText,
        caption,
        credit,
        mediaDetails,
        sourceUrl,
    } = collection.featuredImage ?? {};

    const meta = getMeta(edition);

    // Vary behavior based on edition.
    let canonicalPath = '/';
    let feedLink = '/';
    let latestLink = '/latest/';
    let pageTitle = 'Quartz';

    if (['AFRICA', 'INDIA'].includes(edition)) {
        const editionSlug = edition.toLowerCase();
        canonicalPath = `/${editionSlug}/`;
        feedLink = `/edition/${editionSlug}`;
        latestLink = `/${editionSlug}${latestLink}`;
        pageTitle = `${pageTitle} ${uppercaseFirstLetter(editionSlug)}`;
    }

    // If this is a preview, accept the current path as canonical.
    if (postId) {
        canonicalPath = pathname;
    }

    return (
        <Page
            canonicalPath={canonicalPath}
            feedLink={feedLink}
            pageDescription={meta.description}
            pageTitle={pageTitle}
            pageType="home"
            showMarquee={false}
        >
            <div className={styles.container}>
                <div className={styles.columns}>
                    <h1 className={styles['page-heading']}>{pageTitle}</h1>
                    <MarqueeUnit path="home" targeting={{region: 'global'}}/>
                    <aside className={styles['left-rail-container']}>
                        <h2 className={styles['rail-heading']}>This week’s guide</h2>
                        <div className={styles['guide-promo-container']}>
                            <LatestGuidePromo/>
                        </div>
                        <Link to="/guides/">
                            <ButtonLabel variant="secondary">More guides</ButtonLabel>
                        </Link>
                    </aside>
                    <div className={styles['center-well-container']}>
                        <HomepagePromo/>
                        <UserGreeting/>
                        {
                            sourceUrl &&
                            <div className={styles['center-well-container']}>
                                <Figure
                                    alt={altText ?? ''}
                                    aspectRatio={(mediaDetails?.width ?? 1) / (mediaDetails?.height ?? 1)}
                                    caption={caption}
                                    credit={credit}
                                    src={sourceUrl}
                                    preload
                                />
                            </div>
                        }
                        <HomeFeedBlocks blocks={collection.blocks || []}/>
                    </div>
                    <aside className={styles['right-rail-container']}>
                        <h2 className={styles['rail-heading']}>{`Latest ${pageTitle} stories`}</h2>
                        <LatestArticleFeed edition={edition}/>
                        <Link to={latestLink}>
                            <ButtonLabel variant="secondary">More news</ButtonLabel>
                        </Link>
                    </aside>
                </div>
            </div>
        </Page>
    );
}
