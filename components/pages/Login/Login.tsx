import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import LoginForm from 'components/Forms/LoginForm/LoginForm';
import Page from 'components/Page/Page';
import useUserRole from 'helpers/hooks/useUserRole';
import styles from './Login.module.scss';
// import Redirect from 'components/Redirect/Redirect';

export default function Login() {
    const {isLoggedIn} = useUserRole();
    const router = useRouter()

    const {pathname, state = {}} = router.query;

    useEffect(() => {
        if (isLoggedIn) {
            // @ts-ignore
            router.push(state.from || '/');
            /*return (
                <Redirect
                    status={302}
                    to={{
                        // @ts-ignore
                        pathname: state?.from || '/',
                        needsRefetch: true,
                    }}
                />
            );*/
        }
    },[])

    return (
        <Page
            canonicalPath={pathname + ""}
            pageDescription="Log in to access your Quartz account."
            pageType="login"
            pageTitle="Log in"
        >
            <div className={styles.container}>
                <LoginForm/>
            </div>
        </Page>
    );
}
