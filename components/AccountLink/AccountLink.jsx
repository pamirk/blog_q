import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'next/router';
import compose from '../../helpers/compose';
import Link from '../../components/Link/Link';
import {ButtonLabel} from '../../@quartz/interface';
import useTracking, {useTrackingOnView} from '../../helpers/hooks/useTracking';
import {LOGIN_CTA, SUBSCRIBE_BAR, SUBSCRIBE_CTA, trackCtaClick, trackCtaView,} from '../../helpers/tracking/actions';
import {mapProps, withClientSideUserData, withProps, withQueryParamData, withUserRole,} from '../../helpers/wrappers';
import {isAppArticle} from '../../helpers/urls';
import {ELIGIBLE_FOR_FREE_TRIAL} from '../../helpers/types/account';
import getVariants from '../../components/LandingPagePromoModule/LandingPagePromoVariants.js';
import {offerCodeCtaText, SUBSCRIBE_EMAIL_STEP} from '../../config/membership';
import trackSegmentMembershipCTAClick from '../../helpers/tracking/segment/trackMembershipCTAClicked';

export const TrackedLink = ({buttonVariant, children, trackingData, ...props}) => {
    const trackMembershipCTAClick = useTracking(trackCtaClick, trackingData);
    const innerRef = useTrackingOnView(trackCtaView, trackingData);

    if (!buttonVariant) {
        return (
            <Link
                {...props}
                innerRef={innerRef}
                onClick={() => {
                    trackMembershipCTAClick();
                    trackSegmentMembershipCTAClick({siteLocation: trackingData.context});
                }}
            >{children}</Link>
        );
    }

    return (
        <Link
            {...props}
            innerRef={innerRef}
            onClick={() => {
                trackMembershipCTAClick();
                trackSegmentMembershipCTAClick({siteLocation: trackingData.context});
            }}
        >
            <ButtonLabel variant={buttonVariant}>{children}</ButtonLabel>
        </Link>
    );
};

TrackedLink.propTypes = {
    buttonVariant: PropTypes.string,
    children: PropTypes.node.isRequired,
    trackingData: PropTypes.object.isRequired,
};

const withAccountLinkWrapper = compose(
    withRouter,
    withUserRole(),
    withProps(({location,}) => ({
        isApp: isAppArticle(location?.pathname) || false,
    }))
);

const LoginLinkBase = ({trackingContext, isLoggedIn, ...props}) => {
    if (isLoggedIn) {
        return null;
    }

    return (
        <TrackedLink
            to="/login/"
            trackingData={{
                context: trackingContext,
                ctaName: LOGIN_CTA,
            }}
            type="login"
            {...props}
        />
    );
};

LoginLinkBase.propTypes = {
    isApp: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    trackingContext: PropTypes.string.isRequired,
};

LoginLinkBase.defaultProps = {
    children: 'Log in',
};

const LoginLink = withAccountLinkWrapper(LoginLinkBase);
LoginLink.displayName = 'LoginLink';

const SubscribeLinkBase = ({trackingContext, url, ...props}) => (
    <TrackedLink
        to={url}
        trackingData={{
            context: trackingContext,
            ctaName: SUBSCRIBE_CTA,
        }}
        type="subscribe"
        {...props}
    />
);

SubscribeLinkBase.propTypes = {
    trackingContext: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

SubscribeLinkBase.defaultProps = {
    url: SUBSCRIBE_EMAIL_STEP,
};

const getSubscribeLinkText = ({landingPageMembershipPromo}) => {
    if (landingPageMembershipPromo?.contentVariant) {
        const {contentVariant} = landingPageMembershipPromo;
        return getVariants(contentVariant).cta;
    }

    return offerCodeCtaText;
};

export const overrideSubscribeProps = ({children, getUserAttribute, isApp, url, ...props}) => ({
    // provide a default value for children, but let props override
    /* TODO: this logic should be refactored */
    children: children || (
        getUserAttribute(ELIGIBLE_FOR_FREE_TRIAL) ?
            getSubscribeLinkText(props)
            : 'Restart membership'
    ),
    url: isApp ? 'zebroid://subscribe' : url,
    ...props,
});

const SubscribeLink = compose(
    withAccountLinkWrapper,
    withClientSideUserData(),
    withQueryParamData(),
    mapProps(overrideSubscribeProps)
)(SubscribeLinkBase);

SubscribeLink.displayName = 'SubscribeLink';

const SubscribeBarLinkBase = ({isApp, trackingContext, ...props}) => (
    <TrackedLink
        to={isApp ? 'zebroid://subscribe' : SUBSCRIBE_EMAIL_STEP}
        trackingData={{
            context: trackingContext,
            ctaName: SUBSCRIBE_BAR,
        }}
        {...props}
    />
);

SubscribeBarLinkBase.propTypes = {
    isApp: PropTypes.bool.isRequired,
    trackingContext: PropTypes.string.isRequired,
};

const SubscribeBarLink = withAccountLinkWrapper(SubscribeBarLinkBase);
SubscribeBarLink.displayName = 'SubscribeBarLink';

export {
    LoginLink,
    LoginLinkBase,
    SubscribeBarLink,
    SubscribeBarLinkBase,
    SubscribeLink,
    SubscribeLinkBase,
};
