import React, {ElementType, useCallback, useEffect, useRef, useState,} from 'react';
import Link from 'components/Link/Link';
import {CollectionPartsFragment} from '@quartz/content';
import styles from './CardDeck.module.scss';
import {EssentialsContentBlock} from 'components/Essentials/EssentialsContentBlock';
import {BadgeGroup} from '@quartz/interface';
import classnames from 'classnames/bind';
import {makeTabbableOnceAndFocus} from 'helpers/dom';
import useTracking from 'helpers/hooks/useTracking';
import {trackEssentialsShowMoreClick} from 'helpers/tracking/actions/interaction';
import useClientSideUserData from 'helpers/hooks/useClientSideUserData';
import usePromotionsByTag from 'data/hooks/usePromotionsByTag';
import {notUndefinedOrNull} from 'helpers/typeHelpers';
import {getBlockPromotions} from 'helpers/data/blockPromotions';
import {logImpression} from 'helpers/utils';
import emails from 'config/emails';
import {blockTypesSet} from 'helpers/tracking/segment/trackEssentials';
import {useEssentialsCardViewTracking} from 'helpers/tracking/segment/hooks/useEssentialsViewTracking';

const cx = classnames.bind(styles);

function ProgressIndicator(props: {
    current: number,
    total: number,
}) {
    return (
        <>
            <progress
                className={styles.progressBar}
                max={props.total}
                value={props.current}
            />
            <div aria-hidden={true} className={styles.progressNotches}>
                {
                    new Array(props.total)
                        .fill(null)
                        .map((_, i) => <div className={cx('progress-notch', {current: props.current === i + 1})}
                                            key={i}/>)
                }
            </div>
        </>
    );
}

/**
 * Special card treatment for an email signup prompt following a nug.
 * The parent nug’s blocks and title are replaced with the email title and artwork.
 */
function getEmailPromoBlock(args: {
    slug?: string | null;
    parent: ElementType<CollectionPartsFragment[ 'blocks' ]>;
}): ElementType<CollectionPartsFragment[ 'blocks' ]> {
    const {slug, parent} = args;
    if (!slug || !parent) {
        // @ts-ignore
        return null;
    }
    const email = emails[slug];
    if (!email) {
        // @ts-ignore
        return null;
    }
    // @ts-ignore
    const id = `${parent?.id}EmailPromoCard`;
    const title = `Sign up for ${email.definiteArticle ? 'the' : ''} ${email.name}`;
    const sourceUrl = 'https://cms.qz.com/wp-content/uploads/2021/03/essentials-cta-email.png';
    return {
        // @ts-ignore
        ...parent, id, connections: [
            {
                // @ts-ignore
                ...parent.connections?.[0], __typename: 'Nug', id, nugId: -1, title, blocks: [
                    {
                        type: 'CORE_IMAGE', id, connections: [
                            {__typename: 'MediaItem', id, sourceUrl, mediaDetails: {width: 2566, height: 778}},
                        ]
                    },
                ]
            },
        ]
    };
}

/**
 * Special card treatment for a membership signup CTA.
 * Renders the blocks from a Promotion post with the tag `essentials-membership-promo`.
 */
function getMembershipPromoCard(args: {
    promotions: ReturnType<typeof usePromotionsByTag>;
}): ElementType<CollectionPartsFragment[ 'blocks' ]> {
    const {promotions} = args;
    const [promo] = promotions;
    // @ts-ignore
    if (!promo || !parent) {return null;}
    const title = promo?.title ?? 'Become a Quartz member';
    const blocks = promo.blocks ?? [];
    return {
        // @ts-ignore
        attributes: [{name: 'memberPromoText', value: ''}], id: title, type: 'QZ_POST_TOUT', connections: [
            {__typename: 'Nug', id: title, nugId: -1, title, blocks},
        ]
    };
}

function SponsorHeader(props: {
    sponsor?: string | null,
    sponsorLink?: string | null,
    sponsorClickThroughUrl?: string,
}) {
    if (!props.sponsor) {
        return null;
    }
    const content = (
        <div className={styles.sponsorHeading}>
            {`Sponsor content by ${props.sponsor}`}
        </div>
    );
    return props.sponsorLink ? (
        <a href={props.sponsorLink} onClick={() => logImpression(props.sponsorClickThroughUrl)}>
            {content}
        </a>
    ) : content;
}

function CardDeck(props: {
    badgeUrl?: string,
    cards: CollectionPartsFragment[ 'blocks' ],
    collectionId: number,
    headerLink: string,
    isInApp: boolean,
    sponsor?: string | null,
    sponsorLink?: string | null,
    sponsorClickThroughUrl?: string,
    showHint?: boolean,
    stackPosition?: number,
    tagline?: string,
    title: string,
    trackingContext: string,
}) {
    // Only render nugs (ignore solo blocks).
    // Add cards for email signup and membership CTAs based on the nug’s attributes.
    // @ts-ignore
    const nugBlocks = props.cards
        ?.filter(block => block?.type && 'Nug' === block?.connections?.[0]?.__typename)
        ?.filter(notUndefinedOrNull)
        ?.reduce<NonNullable<CollectionPartsFragment[ 'blocks' ]>>((nugBlocks, block) => {
            const {emailPromo} = getBlockPromotions(block) ?? {};
            const emailPromoBlock = getEmailPromoBlock({slug: emailPromo?.slug, parent: block});
            if (emailPromoBlock) {
                // append an email signup CTA card after the current nug,
                // and remove the attributes from the current nug so an inline CTA isn’t rendered on that card
                const blockWithoutPromoAttributes = {...block, attributes: []};
                nugBlocks.push(blockWithoutPromoAttributes);
                nugBlocks.push(emailPromoBlock);
                return nugBlocks;
            }
            nugBlocks.push(block);
            return nugBlocks;
        }, [])?.filter(notUndefinedOrNull) ?? [];
    const isSingleCard = nugBlocks.length === 1;
    // Add a membership promotion card to the end of the stack for non-members
    const {isMember} = useClientSideUserData();
    const promotions = usePromotionsByTag('essentials-membership-promo', 1, false, !!isMember);
    if (!isMember && !props.sponsor && !isSingleCard) {
        const membershipPromoCard = getMembershipPromoCard({promotions});
        if (membershipPromoCard) {
            nugBlocks.push(membershipPromoCard);
        }
    }
    // Keep track of the currently active card
    const [activeIndex, setActiveIndex] = useState<null | number>(null);
    // Store a ref to the active card's HTML container so we can manage focus and scroll position
    const activeCardRef = useRef<HTMLDivElement>(null);
    // Store a ref to the container so we can listen for keyboard-based navigation
    const containerRef = useRef<HTMLDivElement>(null);
    // Store a ref to the header so we can offset its height when scrolling the active card into view
    const headerRef = useRef<HTMLDivElement>(null);

    const atLastCard = nugBlocks.length - 1 === activeIndex;

    const onClickPrevious = useCallback(() => {
        if (activeIndex) {
            // Not at the first card, go back one
            setActiveIndex(activeIndex - 1);
        }
    }, [activeIndex]);
    const onClickNext = useCallback(() => {
        if (isSingleCard) {
            return;
        }
        if (activeIndex === null) {
            // First click. Advance to second card
            setActiveIndex(1);
        } else if (atLastCard) {
            // User has reached the end, start over
            setActiveIndex(0);
        } else {
            // Advance by one
            setActiveIndex(activeIndex + 1);
        }
    }, [activeIndex, atLastCard, isSingleCard]);

    // Add/remove keydown handlers for navigation on mount/unmount
    useEffect(() => {
        const onKeyDown = e => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    onClickPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    onClickNext();
            }
        };
        const {current} = containerRef;
        current?.addEventListener('keydown', onKeyDown);

        return () => current?.removeEventListener('keydown', onKeyDown);
    }, [onClickPrevious, onClickNext]);

    // Focus the new card when it changes and scroll it into view if necessary
    useEffect(() => {
        if (activeIndex !== null) {
            makeTabbableOnceAndFocus(activeCardRef.current, true);
            const headerOffset = headerRef.current?.getBoundingClientRect().height || 0;
            const cardOffset = activeCardRef.current?.getBoundingClientRect().top || 0;
            const scrollDepth = document.documentElement.scrollTop;
            const visibleY = headerOffset + 45;

            if (cardOffset < visibleY) {
                document.documentElement.scrollTo({
                    top: scrollDepth + cardOffset - visibleY,
                    behavior: 'smooth', // does not work on Sadfari
                });
            }
        }
    }, [activeIndex]);
    // Send a GA tracking event when the card changes
    const trackCardChange = useTracking(trackEssentialsShowMoreClick, {});

    const currentCard = nugBlocks.length > 0 ? nugBlocks[activeIndex ?? 0] : null;

    // Send a more comprehensive event to Segment
    const segmentEventProps = {
        card_id: currentCard?.id || undefined,
        card_index: activeIndex ? activeIndex + 1 : 1,
        card_title: currentCard?.connections?.[0]?.__typename === 'Nug' ?
            currentCard?.connections?.[0]?.title || undefined : undefined,
        collection_id: props.collectionId,
        collection_title: props.title,
        sponsor_name: props.sponsor || undefined,
        stack_index: props.stackPosition,
        stack_size: nugBlocks.length,
    };
    const visibilityRef = useEssentialsCardViewTracking({
        block_types: blockTypesSet({collection: [currentCard]}),
        ...segmentEventProps,
    });

    useEffect(() => {
        if (activeIndex !== null) {
            trackCardChange({eventLabel: `${props.collectionId}|${props.trackingContext}|${activeIndex + 1}/${nugBlocks.length}`});
        }
        // We only want to trigger a tracking action when the card index changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex]);

    return (
        <div ref={containerRef} className={styles.container}>
            <div ref={headerRef} className={props.isInApp ? styles.appHeader : styles.header}>
                <SponsorHeader {...props} />
                <Link to={props.headerLink}>
                    <BadgeGroup
                        imageUrl={props.badgeUrl}
                        size="small"
                        title={props.title}
                        tagline={props.tagline}
                    />
                </Link>
                {
                    !isSingleCard &&
                    <ProgressIndicator current={activeIndex ? activeIndex + 1 : 1} total={nugBlocks.length}/>
                }
            </div>
            <div className={styles.cards} ref={visibilityRef}>
                {
                    activeIndex === null && props.showHint && !isSingleCard &&
                    <span className={styles.hint}>
						<span>Tip: tap card to advance</span>
						<span role="img" aria-label="finger pointing right">👉</span>
					</span>
                }
                {
                    !isSingleCard &&
                    <button
                        aria-hidden={true}
                        className={styles.overlayButton}
                        onClick={onClickNext}
                        tabIndex={-1} // Remove from tabindex in favor of standard buttons below
                    >Next</button>
                }

                {
                    nugBlocks.map((block, index) => {
                        const isActiveCard = activeIndex === index || index === 0 && activeIndex === null;

                        return (
                            <div
                                key={block.id}
                                className={cx('card', {active: isActiveCard})}
                                ref={isActiveCard ? activeCardRef : undefined}
                            >
                                <EssentialsContentBlock
                                    attributes={block.attributes}
                                    connections={block.connections}
                                    id={block.id}
                                    innerHtml={block.innerHtml}
                                    tagName={block.tagName}
                                    type={block.type}
                                    location="essentials"
                                    {...segmentEventProps}
                                />
                            </div>
                        );
                    })
                }
            </div>
            {
                !isSingleCard &&
                <div className={styles.controls}>
                    <button
                        aria-label="Back"
                        className={styles.control}
                        disabled={!activeIndex}
                        onClick={onClickPrevious}
                    >←
                    </button>
                    <p className={styles.counter}>{`${activeIndex ? activeIndex + 1 : 1} of ${nugBlocks.length}`}</p>
                    <button
                        aria-label={atLastCard ? 'Start over' : 'Next'}
                        className={styles.control}
                        onClick={onClickNext}
                    >{atLastCard ? '↻' : '→'}</button>
                </div>
            }
        </div>
    );
}

CardDeck.defaultProps = {showHint: true};

export default CardDeck;
