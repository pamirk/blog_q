import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Page from 'components/Page/Page';
import {Button, PageHeader, Spinner, TabNav, TabNavItem} from '@quartz/interface';
import Link from 'components/Link/Link';
import ListWithAds from 'components/List/ListWithAds';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import useEmailsByList from 'data/hooks/useEmailsByList';
import useUserRole from 'helpers/hooks/useUserRole';
import getLocalization from 'helpers/localization';
import {allEmails, MEMBER_ONLY_EMAILS} from 'config/emails';
import styles from './EmailArchive.module.scss';
import {ResourceNotFoundError} from 'helpers/errors';

const ad = {
    path: 'list',
    targeting: {
        page: 'latest',
    },
};

const dictionary = {
    ja: {
        Subscribe: '登録はこちらから',
        'A glimpse at the future of the global economy-in Japanese': '世界とつながる、新しいニュース体験',
    },
};

function LatestEmailsByFeed(props: {
    list: string,
    tags?: string[],
}) {
    const {emailList, emails, fetchMore, hasMore, loading} = useEmailsByList(props.list, props.tags);

    if (!emailList && !loading) {
        return null;
    }

    if (!emails) {
        return (
            <div className={styles.loading}>
                <Spinner/>
            </div>
        );
    }

    const emailsWithLink = emails.map(email => ({
        ...email,
        edition: {name: `📬 ${allEmails[props.list].name}`},
        link: `/emails/${props.list}/${email.emailId}/`
    }));

    return (
        <>
            <ListWithAds
                ad={ad}
                collection={emailsWithLink}
            />
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={hasMore}
                loadMore={fetchMore}
            />
        </>
    );
}

function ArchiveHeaderLink(props: { isJapan, slug, localize }) {
    const {isJapan, slug, localize} = props;
    const {isMember} = useUserRole();

    if (isJapan) {
        if (isMember) {
            return null;
        }

        return (
            <Link to="/japan/subscribe/email/">{`${localize('Subscribe')}`}</Link>
        );
    }

    let ctaLink: null | React.ReactElement = null;

    if (!isMember && MEMBER_ONLY_EMAILS.includes(slug)) {
        ctaLink = <Link to="/subscribe/email/">Become a member</Link>;
    }

    return (
        <>
            {
                ctaLink
            }
            <span className={styles.moreEmails}><Link to="/emails/">More emails</Link></span>
        </>
    );
}

function EmailArchive() {
    const router = useRouter();
    let list = router.query.list as string;
    // list = list + ''
    if (list == undefined) {
        list = 'daily-brief'
    }
    if (!allEmails[list]) {
        throw new ResourceNotFoundError();
    }

    const {canonicalSegment, filterableSegments, name, shortDescription} = allEmails[list];

    // use the canonical segment if it exists; otherwise, empty array []
    const defaultSegment = canonicalSegment;

    const [currentSegment, setSegment] = useState<string | null>(defaultSegment);

    // tag names are the list slug + the segment slug
    const tags = currentSegment ? [`${list}-${currentSegment}`] : [];

    const isJapan = list === 'quartz-japan';
    const localize = getLocalization({dictionary, language: isJapan ? 'ja' : 'en'});

    return (
        <Page
            canonicalPath={`/emails/${list}/archive/`}
            pageDescription={`Archived feed of the latest emails for the ${name} email`}
            pageType="email-archive"
            pageTitle={`${name} - Archive`}
        >
            <PageHeader
                title={isJapan ? 'Quartz Japan' : `${name} Archive`}
                showPadding={false}
            >
                <div>
                    <p className={styles.descriptionText}>{localize(shortDescription)}</p>
                    <p className={`${styles.subscribe} ${!filterableSegments ? styles.subscribeBottomPadding : ''}`}>
                        <ArchiveHeaderLink isJapan={isJapan} slug={list} localize={localize}/>
                    </p>
                </div>
                {filterableSegments && (
                    <TabNav>
                        <TabNavItem
                            isActive={currentSegment === defaultSegment}
                        >
                            <Button
                                inline
                                onClick={() => setSegment(defaultSegment)}
                            >
                                <span
                                    className={`${styles.navItem} ${currentSegment === defaultSegment ? styles.active : ''}`}>All</span>
                            </Button>
                        </TabNavItem>
                        {
                            filterableSegments.map(segmentGroup => (
                                <TabNavItem key={segmentGroup} isActive={currentSegment === segmentGroup}>
                                    <Button
                                        inline
                                        onClick={() => setSegment(segmentGroup)}
                                    >
                                        <span
                                            className={`${styles.navItem} ${currentSegment === segmentGroup ? styles.active : ''}`}>{segmentGroup}</span>
                                    </Button>
                                </TabNavItem>
                            ))
                        }
                    </TabNav>
                )}
            </PageHeader>
            <LatestEmailsByFeed list={list} tags={tags}/>
        </Page>
    );
}

export default EmailArchive;
