import type {AppProps} from 'next/app'

import {ApolloProvider, createHttpLink} from "@apollo/client";
import {Provider} from "react-redux";
import {HelmetProvider} from "react-helmet-async";
import configureStore from "../store";
import {updateUserData} from "../helpers/wrappers/actions/auth";
import {getAuthLink} from "../helpers/graphql";
import getApolloClient from "../data/apollo/getClient";
import {createPersistedQueryLink} from "@apollo/client/link/persisted-queries";
import {sha256} from "crypto-hash";
import React, {useEffect, useState} from "react";
import {setInputIntentClasses} from "../helpers/input-intents";
import {defaultRole} from 'config/users';
import {apiFetchOptions} from "../config/http";
import '../components/App.scss'
import {useRouter} from 'next/router'
import Script from 'next/script'

export const PianoContext = React.createContext(false);


let CONTENT_API_URL = "https://content.qz.com/graphql"

// const store = configureStore(window.__INITIAL_STATE__);
const store = configureStore({});

// Attempt to refresh user data and auth tokens.
const refreshUserData = () => {
    // Skip fetch / refresh for unauthenticated users or if the initial state from
    // SSR indicates that we should skip it.
    /* store.dispatch(updateUserData({
         "contentIds": [],
         "tokens": {
             "gql": null,
             "user": "eyJraWQiOiJxNVFSU2twR05wZWJYSGJKIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJodHRwczovL3F6LmNvbSIsInN1YiI6IjIyMjU3MjEiLCJyb2xlIjoibWVtYmVyIiwiaXNzIjoiaHR0cHM6Ly9uZXdzcGlja3MudXMvIiwiZXhwIjoxNjYzMTg2NzU3LCJpYXQiOjE2MzE2NTA2OTd9.CA1HOywP18n9XQxde-DoY_MDkhgkICfrzKu2_laiAJEFVI7NEKOv6sfwUkmwzyn2khgB7ASokx1t6rOr1OYV5f3_n32OZfkuPmuw-uoayRwjl17s9o-TQnltrs_9WazROC64Phx5r8vno6RVYu3LoP0JQ1rzWBYaDleHGSPB8gieU1rvwPl6mIoOa3krcQiVii-q0BexwynRkhHyJ7qU7UKDnqeMeiVKAoYtVC4gvEqgeyRReGHzYEhZAS5GjjJmX80DZmx99EgZ2EH8S6meYEB2sDBc1TuHVB2smtilS4QSJ103DaIgmLk4WFKtsN7NnQGvCSS1ivC98HeTfflF6g"
         },
         "user": {
             "email": "miwokasag@kulmeo.com",
             "userId": 2225721,
             "firstName": "Marie",
             "displayName": "Marie",
             "title": "Student",
             "company": "Student",
             "source": "subscribe",
             "industry": {"id": 4, "name": "Education"},
             "jobLevel": {"id": 12, "name": "Student"},
             "sendGrid": {},
             "geo": {"countryCode": "PK", "continentCode": "AS"},
             "eligibleForFreeTrial": false,
             "role": "user",
             "socialStatus": {"hasTwitter": false, "hasFacebook": false, "hasLinkedIn": false, "hasApple": false}
         },
         "userRole": "user",
         "altIdHash": "8dbf7251d12f25a05ee83892fa45947c0edf8c4c583f216a54a4a53f056b4558"
     }))
     return Promise.resolve();*/

    const {auth} = store.getState();
    const {disableRefresh, userRole} = auth;
    if (disableRefresh || defaultRole === userRole) {
        // Update with existing user data to signal to other processes (e.g.,
        // tracking) that the initial refresh is complete.
        store.dispatch(updateUserData(auth));
        return Promise.resolve();
    }

    return fetch('api/user/profile', apiFetchOptions)
        .then(response => response.json())
        .then((data = {}) => store.dispatch(updateUserData(data)))
        .catch(() => {
        });
};

// Get user data and refresh periodically. Store the promise for the initial
// fetch so that we can make sure we wait for it before dispatching any queries.
const initialRefresh = refreshUserData();
setInterval(refreshUserData, 60 * 10 * 1000);
// Fetch user preferences and update Redux store.

// fetch('https://qz.com/api/site/preferences', apiFetchOptions)
//     .then(response => response.json())
//     .then(data => {
//         store.dispatch(updateUserPreferences(data));
//         log('preferences', data, 'loaded');
//     })
//     .catch(() => {
//         log('preferences', {}, 'error');
//     });

const getTokens = () => initialRefresh.then(() => store.getState().auth.tokens);
const authLink = getAuthLink(getTokens);

// Create default Apollo client.
const apolloClient = getApolloClient(
    [
        authLink,
        createPersistedQueryLink({useGETForHashedQueries: true, sha256}),
        createHttpLink({uri: CONTENT_API_URL}),
    ],
    // window.__APOLLO_STATE__,
    {},
    {connectToDevTools: true}
);

// Allow initial state to be garbage-collected.
// delete window.__APOLLO_STATE__;
// delete window.__INITIAL_STATE__;


//App
declare global {
    interface Window {
        tp: any;
    }
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}
// We can't destructure process.env in production.
/* eslint-disable prefer-destructuring */

/*
const AID = process.env.PIANO_AID;
const CXENSE_SITE_ID = process.env.CXENSE_SITE_ID;
*/

function MyApp({Component, pageProps}: AppProps) {
    useEffect(setInputIntentClasses, []);
    const [pianoConfigured, setPianoConfigured] = useState(false);

    /* function initializePiano(args: { debug: boolean }) {
         const tp = window.tp || [];
         // Initialize Piano with our Application ID
         tp.push(['setAid', AID]);
         tp.push(['setCxenseSiteId', CXENSE_SITE_ID]);

         if (args.debug) {
             tp.push(['setDebug', true]);
         }

         tp.push(['setUseTinypassAccounts', false]);
         tp.push(['init', function () {
             setPianoConfigured(true);
             tp.experience.init();
         }]);
     }*/

    useEffect(() => {
        // loadScriptOnce('//cdn.tinypass.com/api/tinypass.min.js')
        //     .then(() => initializePiano({debug: false}));
    }, []);
    const router = useRouter()
    /*useEffect(() => {
        const handleRouteChange = (url) => {
            gtag.pageview(url)
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])*/

    return (
        <div>
            <Script id="Adsense-id" data-ad-client="ca-pub-2484398083224760"
                    async strategy="afterInteractive"
                    onError={(e) => {
                        console.error('Script failed to load', e)
                    }}
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            />
            <ApolloProvider client={apolloClient}>
                <Provider store={store}>
                    <HelmetProvider context={{}}>
                        {/*<PianoContext.Provider value={pianoConfigured}>
                           <Script
                                strategy="afterInteractive"
                                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
                            />
                            <Script
                                id="gtag-init"
                                strategy="afterInteractive"
                                dangerouslySetInnerHTML={{
                                    __html: `
                                            window.dataLayer = window.dataLayer || [];
                                            function gtag(){dataLayer.push(arguments);}
                                            gtag('js', new Date());
                                            gtag('config', '${gtag.GA_TRACKING_ID}', {
                                              page_path: window.location.pathname,
                                            });
                                          `,
                                }}
                            />
                            <Component {...pageProps} />
                        </PianoContext.Provider>*/}
                        <Component {...pageProps} />
                        {/*<Notifications/>*/}
                        {/*<SessionTrack /> <SegmentTracking />*/}

                    </HelmetProvider>

                </Provider>
            </ApolloProvider>

            {/*<BottomBar
                id="old-browser"
                dismissible={false}
                visible={false}
            >
                <Link href="https://browsehappy.com">
                    <><span className="browser-link">Update your browser</span> for the best experience.</>
                </Link>
            </BottomBar>*/}
        </div>

    )
}

export async function getInitialProps(ctx) {
    return {
        revalidate: 1000000
    }
}

export default MyApp
