import React, {Fragment} from 'react';
import Link from '../Link/Link';
import styles from './NoMembershipSettings.module.scss';
import {ELIGIBLE_FOR_FREE_TRIAL} from '../../helpers/types/account';
import {SubscribeLink} from '../../components/AccountLink/AccountLink';
import SignupHints from '../../components/SignupHints/SignupHints';
import {useClientSideUserData} from '../../helpers/hooks';
import {SUBSCRIBE_EMAIL_STEP} from '../../config/membership';

const NoMembershipSettings = () => {
    const {getUserAttribute} = useClientSideUserData();
    const eligibleForFreeTrial = getUserAttribute(ELIGIBLE_FOR_FREE_TRIAL);

    return (
        <div className={styles.container}>
            <p>
                {eligibleForFreeTrial ? (
                    <Fragment>
                        Become a member of Quartz to understand the people and forces that are rewriting the rules of
                        business. <Link to={SUBSCRIBE_EMAIL_STEP}>Click here to learn more</Link>.
                    </Fragment>
                ) : (
                    <Fragment>
                        Restart your membership to unlock full access to Quartz, including all of our premium content
                        and features. <Link to={SUBSCRIBE_EMAIL_STEP}>Learn more about membership here</Link>.
                    </Fragment>
                )}
            </p>
            <div className={styles.button}>
                <SubscribeLink buttonVariant="primary"/>
            </div>
            <SignupHints
                align="left"
                showLogin={false}
                showQuartzJapanContext={false}
                showQuartzJapanLink={true}
            />
        </div>
    );
};

export default NoMembershipSettings;
