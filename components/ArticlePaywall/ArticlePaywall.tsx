import React from 'react';
import ArticlePaywallEmailExchange from 'components/ArticlePaywallEmailExchange/ArticlePaywallEmailExchange';
import ArticlePaywallMembership from 'components/ArticlePaywallMembership/ArticlePaywallMembership';
import {PAYWALL_DYNAMIC, PAYWALL_EMAIL_EXCHANGE, PAYWALL_HARD, PAYWALL_MEMBER_UNLOCK} from 'config/membership';
import styles from './ArticlePaywall.module.scss';

type PaywallType =
    typeof PAYWALL_DYNAMIC |
    typeof PAYWALL_EMAIL_EXCHANGE |
    typeof PAYWALL_HARD |
    typeof PAYWALL_MEMBER_UNLOCK;

function PaywallContainer(props: {
    children: React.ReactNode,
    description?: string,
    heading: string,
}) {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>{props.heading}</h2>
            {
                props.description &&
                <p className={styles.description}>{props.description}</p>
            }
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    );
}

function DynamicOrHardPaywall(props: {
    trackingContext: string,
}) {
    return (
        <PaywallContainer
            heading="Enrich your perspective. Embolden your work. Become a Quartz member."
            description="Your membership supports a team of global Quartz journalists reporting on the forces shaping our world. We make sense of accelerating change and help you get ahead of it with business news for the next era, not just the next hour. Subscribe to Quartz today."
        >
            <ArticlePaywallMembership trackingContext={props.trackingContext}/>
        </PaywallContainer>
    );
}

function EmailExchangePaywall(props: { id: string }) {
    return (
        <PaywallContainer heading="Sign up for the Quartz Daily Brief to read this story.">
            <ArticlePaywallEmailExchange
                id={props.id}
                source="email-exchange"
            />
        </PaywallContainer>
    );
}

function MemberUnlockPaywall(props: { id: string }) {
    return (
        <PaywallContainer
            heading="A Quartz member has unlocked this story for you. Sign up with your email to read it.">
            <ArticlePaywallEmailExchange
                id={props.id}
                submitText="Read story"
                source="mucp"
            />
        </PaywallContainer>
    );
}

export default function ArticlePaywall(props: {
    id: string,
    paywallType: PaywallType,
}) {
    if (PAYWALL_MEMBER_UNLOCK === props.paywallType) {
        return <MemberUnlockPaywall id={props.id}/>;
    }

    if (PAYWALL_EMAIL_EXCHANGE === props.paywallType) {
        return <EmailExchangePaywall id={props.id}/>;
    }

    const trackingContext = PAYWALL_DYNAMIC === props.paywallType ? 'dynamic paywall' : 'article paywall';

    if (PAYWALL_DYNAMIC === props.paywallType || PAYWALL_HARD === props.paywallType) {
        return <DynamicOrHardPaywall trackingContext={trackingContext}/>;
    }

    return null;
}
