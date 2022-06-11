import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import MagicLinkForm from 'components/Forms/MagicLinkForm/MagicLinkForm';
import styles from './MagicLink.module.scss';
import Page from 'components/Page/Page';
import {Spinner} from '@quartz/interface';
import useMagicLinkRedemption from 'helpers/hooks/useMagicLinkRedemption';
import useClientSideUserData from 'helpers/hooks/useClientSideUserData';
import {getQueryParamData} from 'helpers/queryParams';

// import Redirect from 'components/Redirect/Redirect';

function MagicLink() {
    // @ts-ignore
    const {state = {}} = useRouter();

    const router = useRouter()
    let {token} = router.query;
    token = token && token[0];

    // If a token is present, the user is automatically logged in.
    const {error} = useMagicLinkRedemption(token);
    const {isLoggedIn, isMember} = useClientSideUserData();

    useEffect(() => {
        if (isLoggedIn) {
            const {redirectTo} = getQueryParamData({isLoggedIn, isMember});
            // return <Redirect status={302} to={redirectTo ? `/${redirectTo}/` : '/'} />;
            router.push(redirectTo ? `/${redirectTo}/` : '/');
        }

        if (error) {
            // return <Redirect status={302} to="/" />;
            router.push('/');
        }
    }, [])


    if (token) {
        return (
            <Page
                canonicalPath={`/login/by-email/${token}/`}
                pageTitle="Email yourself a login link"
                pageType="magic-link"
            >
                <div className={styles.container}>
                    <div className={styles.spinner}>
                        <Spinner/>
                    </div>
                </div>
            </Page>
        );
    }

    return (
        <Page
            canonicalPath="/login/by-email/"
            pageTitle="Email yourself a login link"
            pageType="magic-link"
        >
            <div className={styles.container}>
                <MagicLinkForm initialEmail={state.email} from={state.from}/>
            </div>
        </Page>
    );
}

export default MagicLink;
