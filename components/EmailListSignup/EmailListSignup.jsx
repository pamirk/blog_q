// noinspection JSNonASCIINames

import React from 'react';
import PropTypes from 'prop-types';
import PageSectionHeader from '../../components/Page/PageSectionHeader/PageSectionHeader';
import EmailSignup from '../../components/EmailSignup/EmailSignup';
import EmailPeek from '../../components/EmailPeek/EmailPeek';
import Link from '../../components/Link/Link';
import MembershipCTA from '../../components/MembershipCTA/MembershipCTA';
import useEmailById from '../../data/hooks/useEmailById';
import getLocalization from '../../helpers/localization';
import useClientSideUserData from '../../helpers/hooks/useUserRole';
import styles from './EmailListSignup.module.scss';
import ClockIcon from '../../svgs/clock';

const dictionary = {
    ja: {
        'A glimpse at the future of the global economy. Keep up—in Japanese—with developments in business, econ, international relations, and consumer culture.': '世界の「今」と「次」の情報が、「探す」必要なく「毎日届く」。Quartz Japanのニュースレターは、次世代のビジネスパーソンがアイデアを生み、実現し、新たな時代を生き抜くために必要不可欠なグローバルニュースを、英語を学びながら効率的かつ最大限にインプットできる、新たな習慣を提供しています。',
        ' Read the latest.': '最新を読む。',
    },
};

function EmailListSignup({
                             description,
                             emailId,
                             emailAddress,
                             featuredImage,
                             header,
                             hideSignup,
                             name,
                             onSignupConfirmed,
                             slug,
                             subtitle,
                         }) {
    const email = useEmailById(emailId);
    const {isLoggedIn} = useClientSideUserData();
    const localize = getLocalization({dictionary, language: 'quartz-japan' === slug ? 'ja' : 'en'});

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <PageSectionHeader
                    title={header ? header.title : name}
                    description={
                        <>
                            {localize(header ? header.description : description)}
                            {email?.link && <Link to={email.link}>{localize(' Read the latest.')}</Link>}
                        </>
                    }
                    titleTagName="h1"
                />
                {
                    !hideSignup &&
                    <div className={styles.signup}>
                        {
                            subtitle && (
                                <div className={styles.subtitle}>
                                    <ClockIcon className={styles.clockIcon} aria-hidden={true}/>
                                    <span>{subtitle}</span>
                                </div>
                            )
                        }
                        <EmailSignup
                            location="signup-page"
                            slugs={[slug]}
                            email={emailAddress}
                            onSignupConfirmed={onSignupConfirmed}
                        />
                    </div>
                }
                {
                    'quartz-japan' === slug && !isLoggedIn &&
                    <MembershipCTA
                        isLoggedIn={false}
                        language="ja"
                        showText={false}
                        trackingContext="email"
                        type="paid"
                    />
                }
            </div>
            {email &&
            <EmailPeek
                email={email}
                featuredImage={featuredImage}
                slug={slug}
                name={name}
                language={'quartz-japan' === slug ? 'ja' : 'en'}
            />
            }
        </div>
    );
}

EmailListSignup.propTypes = {
    description: PropTypes.string,
    emailAddress: PropTypes.string, // initial value
    emailId: PropTypes.number,
    featuredImage: PropTypes.shape({
        altText: PropTypes.string.isRequired,
        sourceUrl: PropTypes.string.isRequired,
    }),
    header: PropTypes.shape({ // to override graphql-served copy
        title: PropTypes.string.isRequired,
        description: PropTypes.node.isRequired,
    }),
    hideSignup: PropTypes.bool,
    name: PropTypes.string,
    onSignupConfirmed: PropTypes.func,
    slug: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
};

EmailListSignup.defaultProps = {
    onSignupConfirmed: () => {
    },
};

export default EmailListSignup;
