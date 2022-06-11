import React from 'react';
import {useRouter} from 'next/router';
import Page from 'components/Page/Page';
import {Constrain, PageHeader} from '@quartz/interface';
import SearchInput from 'components/SearchInput/SearchInput';
import SearchResults from 'components/SearchResults/SearchResults';
import {decodeSearchPath, encodeSearchPath} from 'helpers/urls';

export default function Search() {
    const {search = ''} = useRouter().query;
    const normalizedTerms = decodeSearchPath(search as string);

    let canonicalPath = '/search/';
    if (normalizedTerms) {
        canonicalPath = `/search/${encodeSearchPath(normalizedTerms)}/`;
    }

    return (
        <Page
            canonicalPath={canonicalPath}
            pageTitle="Search Quartz"
            pageType="search"
        >
            <PageHeader
                title="Search"
            >
                <Constrain size="extra-large">
                    <SearchInput defaultValue={normalizedTerms}/>
                </Constrain>
            </PageHeader>
            {
                normalizedTerms &&
                <SearchResults search={normalizedTerms}/>
            }
        </Page>
    );
}
