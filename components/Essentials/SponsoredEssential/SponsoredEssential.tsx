import React, {useState} from 'react';
import {useEssentialsByCollectionQuery} from '@quartz/content';
import {SponsoredEssentialSlot} from 'components/Ad/Ad';
import CardDeck from 'components/CardDeck/CardDeck';
import {useInView, usePageVariant, usePostMessage} from 'helpers/hooks';
import ClientOnly from 'components/ClientOnly/ClientOnly';
import styles from './SponsoredEssential.module.scss';
import {useRouter} from 'next/router';
import Image from 'next/image'

export default function SponsoredEssentialStack(props: {
    ad: {
        path: string,
        targeting: any,
    },
    showHint?: boolean,
    stackPosition?: number,
}) {
    const [eventName] = useState(`sponsored-essential-json-${Date.now()}`);
    const {isInApp} = usePageVariant();
    const {ad, showHint} = props;
    const [collectionId, setCollectionId] = useState(-1);
    const [hasViewed, setHasViewed] = useState(false);
    const [audienceUrl, setAudienceUrl] = useState<string | undefined>(undefined);
    const [viewImpressionUrl, setViewImpressionUrl] = useState<string | undefined>(undefined);
    const [clickThroughUrl, setClickThroughUrl] = useState<string | undefined>(undefined);
    const router = useRouter()

    const {collectionId: sponsoredId} = router.query;
    const {data: sponsorData} = useEssentialsByCollectionQuery({
        skip: collectionId === -1,
        variables: {
            collectionId: collectionId,
        },
    });
    const [ref, isVisible] = useInView();

    // The sponsored essential creative in DFP (Ad Manager) is HTML containing a
    // simple <script> tag that sends a `postMessage` to the window containing the following
    // data. The [postId] references a Collection in the CMS.
    // We are responsible for tracking impressions and clicks via the provided URLs.
    function onAdMessageReceived({data: {postId, viewImpressionUrl, clickThroughUrl, audienceUrl}}) {
        if (postId && postId !== collectionId) {
            setCollectionId(postId);
            setClickThroughUrl(clickThroughUrl);
            setViewImpressionUrl(viewImpressionUrl?.replace(/%%CACHEBUSTER%%/gi, `${new Date().getTime()}`));
            setAudienceUrl(audienceUrl);
        }
    }

    usePostMessage(eventName, onAdMessageReceived, undefined, eventName);

    // Decouple visibility / impression tracking and component render; the essentials slot
    // is rendered non-lazily.
    if (isVisible && viewImpressionUrl && !hasViewed) {
        setHasViewed(true);
    }

    function onSlotRenderEnded() {
        if (sponsoredId) {
            if (typeof sponsoredId === "string") {
                setCollectionId(parseInt(sponsoredId, 10));
            }
        }
    }

    return {
        hasSponsoredEssential: !!sponsorData?.collectionBy?.blocks?.length,
        sponsoredEssential: (
            <ClientOnly>
                <div ref={ref}>
                    <SponsoredEssentialSlot
                        {...ad}
                        targeting={{...ad.targeting, eventName}}
                        onSlotRenderEnded={onSlotRenderEnded}
                    />
                    {!!sponsorData?.collectionBy?.blocks?.length &&
                    <CardDeck
                        badgeUrl={sponsorData.collectionBy.featuredImage?.sourceUrl ?? ''}
                        cards={sponsorData.collectionBy.blocks}
                        collectionId={collectionId ?? -1}
                        headerLink=""
                        isInApp={isInApp}
                        sponsor={sponsorData.collectionBy.bulletin?.sponsor?.name}
                        sponsorLink={sponsorData.collectionBy.bulletin?.campaign?.logoLink}
                        sponsorClickThroughUrl={clickThroughUrl}
                        showHint={!!showHint}
                        stackPosition={props.stackPosition}
                        tagline={sponsorData.collectionBy.excerpt ?? ''}
                        title={(sponsorData.collectionBy.title ?? '').trim()}
                        trackingContext="article-essential-1"
                    />
                    }
                    {hasViewed && !!viewImpressionUrl &&
                    <Image src={viewImpressionUrl} className={styles.pixel} alt=""/>
                    }
                    {hasViewed && !!audienceUrl &&
                    <Image src={audienceUrl} className={styles.pixel} alt=""/>
                    }
                </div>
            </ClientOnly>
        ),
    };
}
