import {useEffect, useState} from 'react';
import {useRouter} from 'next/router'
import {EditionName} from '@quartz/content';
import {queryParams} from 'helpers/queryParams';

type PageVariant = {
    edition: EditionName,
    isAmp: boolean,
    isInApp: boolean,
    isPreview: boolean,
    language: 'ja' | 'en',
};

function isEdition(edition: string): edition is EditionName {
    return 'AFRICA' === edition || 'INDIA' === edition || 'QUARTZ' === edition || 'WORK' === edition || 'JAPAN' === edition;
}

type ReactRouterStringParams = any
export default function usePageVariant(): PageVariant {
    const router = useRouter()

    const {edition: lowerCaseEdition = 'quartz', locale, preview, variant} = router.query;
    const [isInAppRequest, setIsInAppRequest] = useState(false);

    // @ts-ignore
    const edition = lowerCaseEdition.toUpperCase();

    useEffect(() => {
        const {client} = queryParams;

        // Our iOS app appends `client=ios` to in-app webviews of qz.com. This
        // allows us to determine if current session is inside an in-app webview.
        // Useful so that we can show the "in-app" page variant as they click around
        // the site, even if they didn't enter on a URL with an app route parameter.
        if ('ios' === client) {
            setIsInAppRequest(true);
        }
    }, []);

    return {
        edition: isEdition(edition) ? edition : 'QUARTZ',
        isAmp: 'amp' === variant,
        isInApp: isInAppRequest || 'app' === variant,
        isPreview: 'preview' === preview,
        language: 'japan' === locale ? 'ja' : 'en',
    };
}
