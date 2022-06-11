import {CollectionPartsFragment} from '@quartz/content';
import {keyBy} from 'helpers/utils';
import {ElementType} from 'react';
// import {getTitle} from 'components/SignupModule/SignupModule';

export type BlockPromotion = {
    emailPromo?: EmailPromotion;
    membershipPromo?: MembershipPromotion;
    appDownloadPromo?: boolean;
};

export type EmailPromotion = {
    slug: string;
    emailTitle: JSX.Element;
}

export type MembershipPromotion = {
    additionalText?: string
}

/**
 * Various promotional content can be attached to a nug via its block attributes.
 * This function parses those promotions and fetches some associated content
 * to make it easier to display them.
 * Promotions are exclusive: only one type will be returned for a given input block.
 */
export function getBlockPromotions(
    block: ElementType<CollectionPartsFragment[ 'blocks' ]> | any
): BlockPromotion | undefined {
    if (!block?.attributes) {
        return;
    }
    const attributeDictionary = block.attributes ? keyBy(block.attributes, o => o.name, o => o.value) : null;

    // These property names are set via the CMS and their presence in the block’s
    // attributes indicates that an editor requested that we display a promotion.
    const {appCta, emailListId, memberPromoText} = attributeDictionary ?? {};

    if (emailListId && block.connections?.[0]?.__typename === 'Nug') {
        const {slug, emailTitle} = getNugEmail(block.connections?.[0]?.emailLists?.nodes?.[0]);
        if (slug && emailTitle) {
            return {emailPromo: {slug, emailTitle}};
        }
    }

    if (memberPromoText !== undefined) {
        return {membershipPromo: {additionalText: memberPromoText}};
    }

    if (appCta) {
        return {appDownloadPromo: true};
    }

    return;
}

function getNugEmail(emailList?: { slug?: string | null, name?: string | null } | null) {
    const {slug, name} = emailList || {};

    if (slug && name) {
        return {
            slug,
            // emailTitle: getTitle(slug, name),
            emailTitle: null,
        };
    }

    return {};
}
