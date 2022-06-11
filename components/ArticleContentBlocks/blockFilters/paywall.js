import {SUBSCRIBE_EMAIL_STEP} from '../../../config/membership';

const notice = {
    innerHtml: `<em>You’re reading a Quartz member-exclusive story, available to all readers for a limited time.
		To unlock access to all of Quartz <a href="${SUBSCRIBE_EMAIL_STEP}">become a member</a>.</em>`,
    type: 'P',
};

const paywall = (blocks, {isPaywalled, isPremium, isMember}) => {
    if (!isPremium || isPaywalled || isMember) {
        return blocks;
    }

    // return [notice, ...blocks];
    return [ ...blocks];
};
export default paywall;