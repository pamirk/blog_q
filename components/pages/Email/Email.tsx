import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import styles from './Email.module.scss';
import {formatDate, oneDayInMilliseconds, parseDateGmt,} from 'helpers/dates';
import EmailIframe from 'components/EmailIframe/EmailIframe';
import Link, {LinkWhen} from 'components/Link/Link';
import Page, {PageLoading} from 'components/Page/Page';
import SignupModule from 'components/SignupModule/SignupModule';
import useEmailById from 'data/hooks/useEmailById';
import useUserRole from 'helpers/hooks/useUserRole';
import EmailPreview from 'components/EmailPreview/EmailPreview';
import {SUBSCRIBE_EMAIL_STEP} from 'config/membership';
import {MEMBER_ONLY_EMAILS} from 'config/emails';
import Redirect from 'components/Redirect/Redirect';
// import NotFound from 'pages/NotFound/NotFound';

// optimize copy for SEO
function EmailHeaderCopy(props: {
    slug: string,
    dateGmt: string,
    formattedDate: string,
    title: string,
    seoTitle: string,
    name: string,
    isPrivate: boolean,
}) {
    const emailDate = parseDateGmt(props.dateGmt);
    const dateTime = emailDate.toISOString();

    const dayBeforeEmailDate = new Date(emailDate.getTime() - oneDayInMilliseconds);
    const formattedDayBefore = formatDate(dayBeforeEmailDate, {human: false, shortMonth: false});

    const currentDate = new Date();
    const elapsedTime = currentDate.getTime() - emailDate.getTime();

    if ('daily-brief' === props.slug) {
        if (props.formattedDate && elapsedTime <= oneDayInMilliseconds) {
            return (
                <>
                    <h1 className={styles.title}>
                        Today’s news: <time dateTime={dateTime}>{props.formattedDate}</time>
                    </h1>
                    <h2 className={styles.info}><Link to="/emails/daily-brief/">Quartz Daily
                        Brief:</Link>{` ${props.title}`}</h2>
                    <p className={styles.archiveLink}><Link to={`/emails/${props.slug}/archive/`}>View archive</Link>
                    </p>
                </>
            );
        }

        return (
            <>
                <h1 className={styles.title}>
                    What happened on <time dateTime={dateTime}>{formattedDayBefore}</time>
                </h1>
                <h2 className={styles.info}><Link to="/emails/daily-brief/">Quartz Daily
                    Brief:</Link>{` ${props.title}`}</h2>
                <p className={styles.archiveLink}><Link to={`/emails/${props.slug}/archive/`}>View archive</Link></p>
            </>
        );
    }

    return (
        <>
            <h1 className={styles.title}>
                {props.seoTitle || props.title}
            </h1>
            <h2 className={styles.info}>
                You’re reading the <LinkWhen when={!props.isPrivate} to={`/emails/${props.slug}/`}
                                             rel="index">{props.name}</LinkWhen> email from <time
                dateTime={dateTime}>{props.formattedDate}</time>
            </h2>
            <p className={styles.archiveLink}><Link to={`/emails/${props.slug}/archive/`}>{
                props.slug === 'quartz-japan' ? '過去配信ニュースレターはこちら' : 'View archive'
            }</Link></p>
        </>
    );
}

function Email() {
    const router = useRouter()

    let {postId} = router.query;
    postId = postId + ''

    const {isLoggedIn, isMember} = useUserRole();

    const email = useEmailById(parseInt(postId, 10));

    useEffect(() => {
        if (!isMember && slug === 'quartz-membership') {
            router.push(SUBSCRIBE_EMAIL_STEP)
            // return <Redirect status={301} to={SUBSCRIBE_EMAIL_STEP}/>;
        }
    }, [])

    if (!email) {
        return <PageLoading/>;
    }

    // Don't render an email that doesn't belong to a list.
    /* if (!email?.emailLists?.nodes?.[0]) {
         return <NotFound/>;
     }
 */
    const {
        dateGmt,
        disablePaywall,
        emailLists: {
            nodes: [
                {
                    isPrivate,
                    name,
                    slug,
                },
            ],
        },
        html,
        featuredImage,
        seoTitle,
        socialDescription,
        socialTitle,
        subject,
        title,
    } = email;

    /* if (!slug || !name) {
         return <NotFound/>;
     }*/


    // For Quartz Japan emails that are less than 24 hours old, we will disable the
    // paywall to encourage sharing.
    const isQuartzJapan = slug === 'quartz-japan';
    // const showPaywall = !disablePaywall && MEMBER_ONLY_EMAILS.includes(slug) && !isMember;
    const showPaywall = false
    const date = formatDate(dateGmt ?? '', {human: false, shortMonth: false});
    const iframeTitle = `${title} - a preview of the ${name} email from ${date}`;

    return (
        <Page
            canonicalPath={`/emails/${slug}/${postId}/`}
            canonicalUrl={`https://qz.com/emails/${slug}/${postId}/`}
            noIndex={(isPrivate && !MEMBER_ONLY_EMAILS.includes(slug)) ?? false}
            pageDescription={(socialDescription || subject) ?? ''}
            pageTitle={`${seoTitle || title} — ${name}`}
            pageType="email"
            socialImage={featuredImage?.sourceUrl ?? ''}
            socialTitle={socialTitle || seoTitle || title || ''}
        >
            <header className={styles.header}>
                <EmailHeaderCopy
                    slug={slug}
                    dateGmt={dateGmt || ''}
                    formattedDate={date}
                    title={title || ''}
                    seoTitle={seoTitle || ''}
                    name={name}
                    isPrivate={!!isPrivate}
                />
            </header>
            <div className={styles.content}>
                <SignupModule
                    isLoggedIn={isLoggedIn}
                    isMember={isMember}
                    isPrivate={!!isPrivate}
                    isQuartzJapan={isQuartzJapan}
                    name={name}
                    slug={slug}
                />
                {isMember ?
                    <EmailPreview html={html ?? ''}/> :
                    <EmailIframe
                        html={html ?? ''}
                        showPaywall={showPaywall}
                        slug={slug}
                        id={postId}
                        title={iframeTitle}
                    />
                }
            </div>
        </Page>
    );
}

export default Email;
