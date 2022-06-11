import React from 'react';
import {useRouter} from 'next/router'
import {
    DiscoverAllTab,
    DiscoverEmailsTab,
    DiscoverGuidesTab,
    DiscoverLatestTab,
    DiscoverTopicsTab,
    DiscoverTrendingTab,
} from 'components/DiscoverTabs/DiscoverTabs';
import Link from 'components/Link/Link';
import {PageHeader, TabNav, TabNavItem} from '@quartz/interface';
import Page from 'components/Page/Page';
import styles from './Discover.module.scss';

const subPages = [
    {
        Component: DiscoverAllTab,
        label: 'All',
        slug: '',
        url: '/discover/',
        description: 'discover more from Quartz',
    },
    {
        Component: DiscoverLatestTab,
        label: 'Latest',
        slug: 'latest',
        url: '/discover/latest/',
        description: 'discover the latest from Quartz',
    },
    {
        Component: DiscoverTrendingTab,
        label: 'Trending',
        slug: 'trending',
        url: '/discover/trending/',
        description: 'discover trending articles from Quartz',
    },
    {
        Component: DiscoverTopicsTab,
        label: 'Topics',
        slug: 'topics',
        url: '/discover/topics/',
        description: 'discover more topics from Quartz',
    },
    {
        Component: DiscoverGuidesTab,
        label: 'Field Guides',
        slug: 'guides',
        url: '/discover/guides/',
        description: 'discover new field guides from Quartz',
    },
    {
        Component: DiscoverEmailsTab,
        label: 'Emails',
        slug: 'emails',
        url: '/discover/emails/',
        description: 'discover more emails from Quartz',
    },
];

export default function Discover() {
    const router = useRouter()
    let {tab = ''} = router.query;
    tab = tab ? tab[0] : '';
    const {Component, label, url, description} = subPages.find(({slug}) => slug === tab) || subPages[0];

    return (
        <Page
            canonicalPath={url}
            pageTitle={`Discover ${tab ? label : ''}`.trim()}
            pageDescription={description}
            pageType="discover"
        >
            <PageHeader
                showPadding={false}
                title="Discover"
            >
                <div className={styles.navContainer}>
                    <TabNav>
                        {
                            subPages.map(page => (
                                <TabNavItem isActive={tab === page.slug} key={page.slug}>
                                    <Link to={page.url}>{page.label}</Link>
                                </TabNavItem>
                            ))
                        }
                    </TabNav>
                </div>
            </PageHeader>
            <Component/>
        </Page>
    );
}
