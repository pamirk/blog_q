import React, {useEffect} from 'react';
import {useRouter,} from 'next/router';
import {PageHeader} from '@quartz/interface';
import Page, {PageLoading} from 'components/Page/Page';
import PageContent from 'components/PageContent/PageContent';
import {usePageByUriQuery} from '@quartz/content';

export default function StaticPage() {
    const router = useRouter();
    // router.query.uri = '/about/' + router.query.uri
    let {uri} = router.query;
    uri = '/about/' + uri
    const page = usePageByUriQuery({variables: {slug: uri}}).data?.pageBy;
    let hash = '';

    useEffect(() => {
        // hash support for /about/privacy-policy/#do-not-sell; see `OneTrustDoNotSellLink`
        hash = window.location.hash

        if (hash.includes('do-not-sell')) {
            window.setTimeout(() => {
                document?.getElementById('ot-sdk-btn')?.click();
            }, 500);
        }
    }, [router.events]);

    if (!page?.title || !page?.content) {
        return <PageLoading/>;
    }

    const {content, title} = page;

    return (
        <Page
            canonicalPath={`${uri}/`}
            pageTitle={title}
            pageType="static"
        >
            <PageHeader title={title}/>
            <PageContent html={content}/>
        </Page>
    );
}
