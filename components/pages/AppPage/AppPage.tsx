import React from 'react';
import AppBadges from 'components/AppBadges/AppBadges';
import ArtDirection from 'components/ArtDirection/ArtDirection';
import Page from 'components/Page/Page';
import PageSectionHeader from 'components/Page/PageSectionHeader/PageSectionHeader';
import styles from './AppPage.module.scss';
import {appPageMeta, posterSources,} from './content';

const {title, description, socialImage} = appPageMeta;

export default function AppPage() {
    return (
        <Page
            canonicalPath="/app/"
            pageDescription={description}
            pageTitle={title}
            pageType="app"
            showAppLinks={true}
            socialImage={socialImage}
        >
            <div className={styles.header}>
                <div className={styles.intro}>
                    <PageSectionHeader
                        title="Your guide to the global economy"
                        titleTagName="h1"
                    />
                    <div className={styles.description}>
                        {description}
                    </div>
                    <AppBadges/>
                </div>
                <div className={styles.poster}>
                    <ArtDirection
                        alt="Screenshot of Quartz for iOS"
                        sources={posterSources}
                    />
                </div>
            </div>
        </Page>
    );
}
