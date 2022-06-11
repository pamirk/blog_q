import React, {useState} from 'react';
import {BadgeGroup, Button, Spinner, TabNav, TabNavItem} from '@quartz/interface';
import Link from 'components/Link/Link';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import PageSection from 'components/Page/PageSection/PageSection';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';
import useEmailsByList from 'data/hooks/useEmailsByList';
import {stylizedTimestamp} from '@quartz/js-utils';
import emails, {japanConfig} from 'config/emails';
import styles from './EmailFeed.module.scss';

/**
 * Removes the title within the subject by triming everything before the colon.
 * This is more reliable than looking for the title within the subject because
 * they could show up differently, i.e. the title could be 'Monosodium glutamate'
 * while the subject was 'MSG: Magic in a bottle'.
 */
function trimHeadline(subject: string) {
    if (subject.indexOf(': ') > -1) {
        return subject.slice(subject.indexOf(': ') + 2);
    }

    return subject;
}

const emailConfigs = Object.assign({}, emails, japanConfig);

function EmailFeed(props: {
    slug: string,
    isBlock?: boolean,
    sectionBackground?: 'alt' | 'default' | 'dark-overlay' | 'medium-dark-overlay' | 'none',
    sectionHideTopPadding?: boolean,
    showLoadMore?: boolean,
    constrain?: boolean,
    perPage?: number,
}) {
    const {
        slug,
        isBlock,
        sectionBackground,
        sectionHideTopPadding,
        showLoadMore = true,
        constrain = true,
        perPage,
    } = props;
    // segments users can filter by, set by the email config
    const activeSegments = emailConfigs[slug]?.filterableSegments;

    // use the canonical segment if it exists; otherwise, empty array []
    const defaultSegment = emailConfigs[slug]?.canonicalSegment;

    const [currentSegment, setSegment] = useState<string | null>(defaultSegment);

    // tag names are the list slug + the segment slug
    const tags = currentSegment ? [`${slug}-${currentSegment}`] : [];

    const data = useEmailsByList(slug, tags, true, perPage);

    const {emailList, emails, fetchMore, hasMore, loading} = data;

    if (!data.emailList && !loading) {
        return null;
    }

    return (
        <>
            <PageSection
                constrain={constrain}
                hideBottomPadding={!!activeSegments}
                hideTopPadding={sectionHideTopPadding}
                hideTopBorder={slug === 'quartz-japan'}
                background={sectionBackground}
            >
                <div className={isBlock ? styles.block : ''}>
                    <PageSectionHeader
                        isBlock={isBlock}
                        fullWidth={isBlock}
                        title="Inbox"
                        description={emailList?.summary}
                    />
                    {
                        activeSegments && (
                            <TabNav alignLeft>
                                <TabNavItem
                                    isActive={currentSegment === defaultSegment}
                                >
                                    <Button
                                        inline
                                        onClick={() => setSegment(defaultSegment)}
                                    >
                                        <span className={styles.tabName}>All</span>
                                    </Button>
                                </TabNavItem>
                                {activeSegments.map(segment => (
                                    <TabNavItem
                                        key={segment}
                                        isActive={currentSegment === segment}
                                    >
                                        <Button
                                            inline
                                            onClick={() => setSegment(segment)}
                                        >
                                            <span className={styles.tabName}>{segment}</span>
                                        </Button>
                                    </TabNavItem>
                                ))}
                            </TabNav>
                        )
                    }
                </div>
            </PageSection>
            <div>
                {
                    emails?.map(({dateGmt, emailId, featuredImage, subject, title}) => {
                        const tagline = emailList.slug === 'quartz-obsession' ? trimHeadline(subject) : stylizedTimestamp(dateGmt);
                        return (
                            <div
                                className={`${styles.container} ${isBlock ? styles.block : ''}`}
                                key={emailId}
                            >
                                <Link
                                    className={`${styles.email} ${!isBlock ? styles.constrain : ''}`}
                                    to={`/emails/${slug}/${emailId}/`}
                                >
                                    <BadgeGroup
                                        imageUrl={featuredImage?.sourceUrl}
                                        size={isBlock ? 'medium' : 'large'}
                                        tagline={tagline}
                                        title={title}
                                    />
                                </Link>
                            </div>
                        );
                    })
                }
                {
                    !emails && loading && (
                        <div className={styles.spinnerContainer}>
                            <Spinner/>
                        </div>
                    )
                }
            </div>
            {
                showLoadMore && hasMore &&
                <LoadMoreButton
                    fetching={loading}
                    hasMorePosts={hasMore}
                    loadMore={fetchMore}
                />

            }
        </>
    );
}

export default EmailFeed;
