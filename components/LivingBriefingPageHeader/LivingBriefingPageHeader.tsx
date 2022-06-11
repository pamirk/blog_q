import React from 'react';
import {CalloutCard, PageHeader, Pill,} from '@quartz/interface';
import Dateline from 'components/Dateline/Dateline';
import emails from 'config/emails';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import styles from './LivingBriefingPageHeader.module.scss';

function Intro(props: {
    isLanding: boolean,
}) {
    // This may seem a little repetitive but is easier than trying to
    // conditionally string clauses together without client/server mismatches.
    if (props.isLanding) {
        return (
            <>
                In this living briefing, we’re looking at how Covid-19 is affecting major
                aspects of the global economy. You can expect something new every business
                day and recent updates since your last visit
                are <span className={styles.unseen}>highlighted</span> for easy skimming.
            </>
        );
    }

    return (
        <>
            In this living briefing, we’re looking at how Covid-19 is affecting major
            aspects of the global economy. Recent updates since your last visit
            are <span className={styles.unseen}>highlighted</span> for easy skimming.
        </>
    );
}

function LivingBriefingPageHeader(props: {
    children?: JSX.Element,
    dateModified: string,
    isLanding: boolean,
    title: string,
    updateCount?: number,
}) {
    const {
        children,
        dateModified,
        isLanding,
        title,
        updateCount,
    } = props;
    const tagline = (
        <>
            {
                !!updateCount &&
                <span className={styles.pill}>
					<Pill>{updateCount} updates</Pill>
				</span>
            }
            Last updated <Dateline dateGmt={dateModified}/>
        </>
    );

    return (
        <>
            <PageHeader
                intro={<Intro isLanding={isLanding}/>}
                tagline={tagline}
                title={title}
            >
                {children}
            </PageHeader>

            <div className={styles.container}>
                <CalloutCard>
                    <EmailSignup
                        slugs={['coronavirus']}
                        location="Living briefing"
                        buttonText="Sign me up"
                        hideEmailOptions
                        title={
                            <>
                                📬 {emails.coronavirus.title}
                            </>
                        }
                    />
                </CalloutCard>
            </div>
        </>
    );
}

export default LivingBriefingPageHeader;
