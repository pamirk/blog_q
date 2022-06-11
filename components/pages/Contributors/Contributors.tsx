import React from 'react';
import Page, {PageLoading} from 'components/Page/Page';
import useContributors from 'data/hooks/useContributors';
import {PageHeader} from '@quartz/interface';
import List from 'components/List/List';

const pageDescription = 'These are some of our favorite recent contributions from experts on management and other workplace issues.';

export default function Contributors() {
    const {articles} = useContributors(25);

    if (!articles) {
        return <PageLoading/>;
    }

    return (
        <Page
            canonicalPath="/work/contributors/"
            pageDescription={pageDescription}
            pageTitle="Contributors"
            pageType="tag"
        >
            <PageHeader
                intro={pageDescription}
                title="Contributors"
            />
            <List collection={articles}/>
        </Page>
    );
}
