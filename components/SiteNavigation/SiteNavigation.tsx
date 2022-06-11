import React, {Fragment, useEffect, useState} from 'react';
import classnames from 'classnames/bind';
import styles from './SiteNavigation.module.scss';
import useGuides from 'data/hooks/useGuides';
import useLatestFeedContent from 'data/hooks/useLatestFeedContent';
import useMenuItems from 'data/hooks/useMenuItems';
import useObsessions from 'data/hooks/useObsessions';
import useUserRole from 'helpers/hooks/useUserRole';
import {useRouter} from 'next/router'
import AnimatedHamburgerIcon from 'svgs/hamburger-animated';
import AvatarLoggedInIcon from 'svgs/default-avatar';
import AvatarLoggedOutIcon from 'svgs/avatar-logged-out';
import HamburgerIcon from 'svgs/hamburger';
import Link from 'components/Link/Link';
import {EditionName} from '@quartz/content';
import {ArticleStrip} from '@quartz/interface';
import {PlaceholderImage, PlaceholderParagraph} from 'components/Placeholder/Placeholder';
import SiteMenu from 'components/SiteMenu/SiteMenu';
import Switchboard from 'components/Switchboard/Switchboard';
import emails from 'config/emails';
import getMeta from 'config/meta';
import {SUBSCRIBE_EMAIL_STEP} from 'config/membership';
import {trackNavClick} from 'helpers/tracking/actions';
import {withTracking} from 'helpers/wrappers';
import trackSegmentMembershipCTAClick from 'helpers/tracking/segment/trackMembershipCTAClicked';
import Icon from "../../@quartz/interface/Icon/Icon";

const cx = classnames.bind(styles);

const TrackedLink = withTracking({onClick: trackNavClick})(Link);
const TrackedButton = withTracking({trackNavClick})(({onClick, trackNavClick, ...props}) => (
    <button
        {...props}
        onClick={() => {
            trackNavClick();
            onClick();
        }}
    />
));

function NavLinkWithFlyout(props: {
    FlyoutContents: () => JSX.Element,
    align: 'left' | 'right',
    children: React.ReactNode,
    description?: string,
    url: string,
}) {
    const {
        FlyoutContents,
        align,
        children,
        description,
        url,
    } = props;

    // Use state to only render the potentially expensive flyout contents
    // when the flyout is made visible for the first [time].
    // Show/hide functionality of the container is done using CSS.
    const [flyoutOpenedOnce, setFlyoutOpenedOnce] = useState(false);

    return (
        <Fragment>
            <TrackedLink
                ariaExpanded={false}
                className={cx('link', 'flyout-trigger', {'with-hover': flyoutOpenedOnce})}
                onMouseEnter={() => setFlyoutOpenedOnce(true)}
                to={url}
            >{children}</TrackedLink>
            <div className={cx('flyout-container', align)}>
                {
                    description && <p className={cx('flyout-description')}>{description}</p>
                }
                {
                    flyoutOpenedOnce && <FlyoutContents/>
                }
            </div>
        </Fragment>
    );
}

function SwitchboardPlaceholder(props: { rows: number }) {
    return (
        <Fragment>
            {
                new Array(props.rows)
                    .fill(null)
                    .map((_, index) => (
                        <div
                            aria-label="Loading"
                            className={styles['placeholder-row']}
                            key={index}
                        >
                            <div className={styles['placeholder-image']}>
                                <PlaceholderImage aspectRatio={1}/>
                            </div>
                            <div className={styles['placeholder-text']}>
                                <PlaceholderParagraph lines={2}/>
                            </div>
                        </div>
                    ))
            }
        </Fragment>
    );
}

function FieldGuides() {
    const data = useGuides({perPage: 10});

    if (!data?.guides) {
        return <SwitchboardPlaceholder rows={10}/>;
    }

    return (
        <Switchboard
            items={data.guides.map(feature => ({
                ...feature,
                badgeUrl: feature.featuredImage?.sourceUrl,
                title: feature.name,
            }))}
            size="small"
        />
    );
}

function Emails() {
    // Display emails from our config object that have a menuOrder
    // property and sort the emails by those values.
    const filteredEmails = Object.values(emails)
        .filter(email => email.menuOrder)
        .sort((a, b) => (a?.menuOrder || 0) - (b?.menuOrder || 0));

    return (
        <Switchboard
            items={filteredEmails.map(email => ({
                ...email,
                description: email.shortDescription,
                link: email.link,
                title: email.name,
            }))}
            size="small"
        />
    );
}

function Featured() {
    const features = useMenuItems('featured_quartz', 6);

    if (!features) {
        return <SwitchboardPlaceholder rows={6}/>;
    }

    return (
        <Switchboard
            items={features.map(feature => ({
                ...feature,
                badgeUrl: feature.featuredImage?.sourceUrl,
                link: feature.link,
            }))}
            size="small"
        />
    );
}

function Obsessions() {
    const obsessions = useObsessions();

    if (!obsessions) {
        return <SwitchboardPlaceholder rows={10}/>;
    }

    return (
        <Switchboard
            items={obsessions.map(obsession => ({
                ...obsession,
                badgeUrl: obsession.featuredImage?.sourceUrl,
                description: obsession.shortDescription,
                title: obsession.name,
            }))}
            size="small"
        />
    );
}

function LatestArticles() {
    const {posts} = useLatestFeedContent();

    if (!posts) {
        return <SwitchboardPlaceholder rows={10}/>;
    }

    return (
        <ul className={styles['latest-articles']}>
            {
                posts.map(post => {
                    const {
                        dateGmt,
                        edition,
                        featuredImage,
                        kicker,
                        link,
                        sponsor,
                        title,
                    } = post;

                    return (
                        <li className={styles['latest-article-item']} key={post.id}>
                            <Link to={link} className={styles['latest-article-link']}>
                                <ArticleStrip
                                    dateGmt={dateGmt}
                                    edition={edition.name}
                                    kicker={kicker}
                                    size="small"
                                    sponsor={sponsor}
                                    thumbnailUrl={featuredImage?.sourceUrl}
                                    title={title}
                                />
                            </Link>
                        </li>
                    );
                })
            }
        </ul>
    );
}

function WordMark(props: { edition: EditionName }) {
    const {link, logo: Logo, title} = getMeta(props.edition);

    return (
        <TrackedLink className={styles['logo-link']} to={link} label={`${title} home`}>
            <Logo className={cx('logo', props.edition.toLowerCase())}/>
        </TrackedLink>
    );
}

function SiteMenuToggle() {
    const [togglesMenu, setTogglesMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const handleKeydown = e => {
        if (e.keyCode === 27) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        // Once the client-side application is available we can use a
        // button to toggle the menu. Until then we'll display a link to
        // the /menu/ page
        setTogglesMenu(true);
        // Close menu on esc key press
        document.addEventListener('keydown', handleKeydown);

        // Unbind key handler on cleanup
        return () => document.removeEventListener('keydown', handleKeydown);
    }, []);

    if (togglesMenu) {
        return (
            <Fragment>
                <TrackedButton
                    aria-expanded={showMenu}
                    className={cx('link', 'toggle-menu')}
                    onClick={() => setShowMenu(!showMenu)}
                    title="Toggle menu"
                >
                    <AnimatedHamburgerIcon className={cx({open: showMenu})}/>
                </TrackedButton>

                <SiteMenu
                    closeDropdown={() => setShowMenu(false)}
                    inView={showMenu}
                />
            </Fragment>
        );
    }

    return (
        <TrackedLink
            to="/menu/"
            className={styles.link}
            title="Menu"
        >
            <HamburgerIcon/>
        </TrackedLink>
    );
}

function LogInOrProfileLink() {
    const {isLoggedIn} = useUserRole();

    if (isLoggedIn) {
        return (
            <TrackedLink
                className={styles.link}
                title="My profile"
                to="/settings/profile/"
            >
                <AvatarLoggedInIcon/>
            </TrackedLink>
        );
    }

    return (
        <TrackedLink
            className={styles.link}
            title="Log in"
            to="/login/"
        >
            <AvatarLoggedOutIcon/>
        </TrackedLink>
    );
}

function FieldGuidesOrMemberCTA() {
    const {isMember} = useUserRole();
    const router = useRouter()

    const locale = router.locale;

    if (isMember) {
        return (
            <NavLinkWithFlyout
                FlyoutContents={FieldGuides}
                align="right"
                description="Inside the companies, people, and phenomena defining the global economy."
                url="/guides/"
            >Field guides</NavLinkWithFlyout>
        );
    }

    return (
        <TrackedLink
            className={styles.link}
            onClick={() => trackSegmentMembershipCTAClick({siteLocation: 'site nav'})}
            to={locale === 'japan' ? '/japan/subscribe/email/' : SUBSCRIBE_EMAIL_STEP}
        >
            <span className={styles['subscribe-cta']}>Become a member</span>
        </TrackedLink>
    );
}

export default function SiteNavigation(props: { edition: EditionName }) {
    return (
        <Fragment>
            <div className={cx('scroll-border')} aria-hidden={true}/>
            <nav className={styles.container} aria-label="Site navigation" id="site-navigation">
                <ul className={styles['nav-items']}>
                    {/*<li className={cx('nav-item')}>*/}
                    {/*    <SiteMenuToggle/>*/}
                    {/*</li>*/}

                    <li className={cx('nav-item')}>
                        <TrackedLink className={styles.link} to="/search/"> <Icon name="search" size={12} className={styles.searchIcon}/></TrackedLink>
                    </li>
                    <li className={cx('nav-item', 'hide-on-mobile')}>
                        <TrackedLink className={styles.link} to="/discover/">Discover</TrackedLink>
                    </li>
                    <li className={cx('nav-item', 'hide-on-mobile')}>
                        <NavLinkWithFlyout
                            FlyoutContents={LatestArticles}
                            align="left"
                            url="/latest/"
                        >Latest</NavLinkWithFlyout>
                    </li>
                    <li className={cx('nav-item', 'hide-on-mobile')}>
                        <NavLinkWithFlyout
                            FlyoutContents={Obsessions}
                            align="left"
                            description="These are the core obsessions that drive our newsroom—defining topics of seismic importance to the global economy."
                            url="/obsessions/"
                        >Obsessions</NavLinkWithFlyout>
                    </li>
                    <li className={styles['logo-container']}>
                        <WordMark edition={props.edition}/>
                    </li>
                    <li className={cx('nav-item', 'hide-on-mobile')}>
                        <NavLinkWithFlyout
                            FlyoutContents={Featured}
                            align="right"
                            description="These are some of our most ambitious editorial projects. Enjoy!"
                            url="/featured/"
                        >Featured</NavLinkWithFlyout>
                    </li>
                    <li className={cx('nav-item', 'hide-on-mobile')}>
                        <NavLinkWithFlyout
                            FlyoutContents={Emails}
                            align="right"
                            description="Our emails are made to shine in your inbox, with something fresh every morning, afternoon, and weekend."
                            url="/emails/"
                        >Emails</NavLinkWithFlyout>
                    </li>
                  {/*  <li className={cx('nav-item', 'hide-on-mobile')}>
                        <FieldGuidesOrMemberCTA/>
                    </li>
                    <li className={cx('nav-item')}>
                        <LogInOrProfileLink/>
                    </li>*/}
                </ul>
            </nav>
        </Fragment>
    );
}
