import React from 'react';
import {allPlans, subscriptionPlans} from '../../../config/membership';
import {
    CouponDiscount,
    CouponOriginalPrice,
    FeaturedLabel
} from '../../../components/PlanSelect/PlanSelectRadio/PlanSelectRadio';
import {getPlanDataByCountryCode} from '../../../helpers/plans';

const getSubscriptionPlanOption = (id) => {
    const {planName, description, bannerText, price, interval} = allPlans[id];

    return {
        title: planName,
        price,
        interval,
        label: bannerText ? <FeaturedLabel text={`${price} / ${interval}`}/> : `${price} / ${interval}`,
        description,
        value: id,
        bannerText,
    };
};

const getGiftPlanOption = (id) => {
    const {planName, price, bannerText, interval} = allPlans[id];
    // Gift offerings
    return {
        title: planName,
        label: `${price} / ${interval}`,
        value: id,
        bannerText,
        price,
        interval,
    };
};

const defaultPlanOptions = Object.keys(allPlans).map(id => {
    // Subscriptions
    if (subscriptionPlans[id]) {
        return getSubscriptionPlanOption(id);
    }

    return getGiftPlanOption(id);
});

const giftRedeemPlanOptions = (ids) => ids.map(id => ({
    title: 'Your Gift',
    label: 'Free',
    description: allPlans[id].planName,
    value: `${id}`,
}));

const couponPlanOptions = (preview, defaultPlanId, monthlyPlanId, symbol, countryCodeOverride) => {
    const {total, subTotal} = preview;
    const {[defaultPlanId]: {bannerText, interval, priceDec}} = allPlans;

    const monthly = getSubscriptionPlanOption(`${monthlyPlanId}`);

    // If this is a decimal currency (aka US dollars), format prices to two decimal points.
    // Add commas for long numbers
    const formatPrice = (price) => `${symbol}${(priceDec ? price / 100 : price).toLocaleString()}`;
    const originalPrice = formatPrice(subTotal);
    const discountedPrice = formatPrice(total);

    let title = 'Discounted plan (first year)';

    if (countryCodeOverride === 'jp') {
        title = '割引プラン（初年度）';
    }

    return [{
        title,
        price: discountedPrice,
        renewalPrice: originalPrice,
        interval,
        label: <CouponOriginalPrice text={originalPrice}/>,
        description: <CouponDiscount text={`${discountedPrice} / ${interval}`}/>,
        value: `${defaultPlanId}`,
        bannerText,
    }, monthly];
};

// Retrieve template information for plan option display.
const getPlanOptions = ({giftCode, couponCode, planIds, preview, countryCode, countryCodeOverride} = {}) => {
    // Information about your region, and what subscriptions are available to purchase there.
    // (or in the case of /japan, the present region of the site)
    const planDataByRegion = getPlanDataByCountryCode(countryCode, countryCodeOverride);

    // If you're redeeming a gift, the only plan you'll see is the one your gifter bought you.
    if (giftCode) {
        return giftRedeemPlanOptions(planIds);
    }

    // If you have a coupon, you'll have two options like usual; but we apply special styling to
    // the discounted yearly plan, which will be different depending on your region.
    if (couponCode) {
        const {defaultPlanId, monthlyPlanId, symbol} = planDataByRegion;
        return couponPlanOptions(preview, defaultPlanId, monthlyPlanId, symbol, countryCodeOverride);
    }

    // All the plans: gifts, subscriptions, everything. The component that receives this prop
    // will decide which plans to display.
    return defaultPlanOptions;
};

export {getPlanOptions};
