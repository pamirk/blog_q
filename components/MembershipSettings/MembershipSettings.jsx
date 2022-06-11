import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Button} from '../../@quartz/interface';
import CreditCardIcon from '../../svgs/credit-card';
import MembershipBadge from '../../svgs/membership-badge-icon';
import SettingsSection, {SettingsField} from '../SettingsSection/SettingsSection';
import {withModal} from '../../helpers/wrappers';
import {
    CANCEL_SUBSCRIPTION,
    CHANGE_PLAN,
    EDIT_BILLING,
    REACTIVATE_SUBSCRIPTION,
} from '../../helpers/types/permissions';
import {MEMBERFUL_URL} from '../../config/membership';
import {
    CREDIT_CARD_SUMMARY,
    MEMBERSHIP_DAYS_LEFT,
    MEMBERSHIP_IS_GIFT,
    MEMBERSHIP_IS_SUBSCRIPTION,
    PLAN_DISCOUNTED_DISPLAY_PRICE,
    PLAN_HAS_DISCOUNT,
    PLAN_INTERVAL,
    PLAN_IS_MEMBERFUL,
    PLAN_NAME,
    PLAN_PLATFORM,
    PLAN_PRICE,
    PLAN_SYMBOL,
    SUBSCRIPTION_STATUS,
} from '../../helpers/types/account';
import {trackPaymentReactivationSuccess} from '../../helpers/tracking/actions';
import getLocalization from '../../helpers/localization';
import usePageVariant from '../../helpers/hooks/usePageVariant';
import styles from './MembershipSettings.module.scss';
import useCancelSubscription from '../../helpers/hooks/useCancelSubscription';
import useUserSettings from '../../helpers/hooks/useUserSettings';
import useReactivateSubscription from '../../helpers/hooks/useReactivateSubscription';
import useTracking from '../../helpers/hooks/useTracking';

const dictionary = {
    ja: {
        'Your subscription has been canceled. Your membership ends in #{daysLeftInWords}.': '購読キャンセルの手続きは完了しています。あと#{daysLeftInWords}自動退会となります。',
        ' days': '日',
        ' day': '日',
        'Your last payment could not be processed. Please update the card on file.': '最新のお支払いに失敗しました。カード情報を変更して下さい。',
        'Your gift is valid for the next #{daysLeftInWords}. Enjoy!': 'ギフトコードは残り#{daysLeftInWords}間有効です。ぜひお楽しみ下さい。',
        'Your subscription auto-renews today.': '今日、自動更新されます。',
        'Your subscription will auto-renew in #{daysLeftInWords}.': 'あと#{daysLeftInWords}で自動更新されます。',
        'Your plan': '購読中のプラン',
        'Manage membership': 'プランを変更する',
        'Your billing': '支払い情報',
        'Manage your payment information': '支払い情報を管理',
        'Manage billing': '支払い方法を変更する',
        'Cancel your membership': '購読をキャンセル',
        'This will turn off auto-renewal of your membership. You’ll still have access to premium content until the end of your free trial or the last period you paid for.': 'キャンセルされると、購読プランの自動更新が停止しますが、購読期間終了まではすべての有料コンテンツにアクセスいただけます。',
        'Reactivate your membership': '購読を再開する',
        Yearly: '年割プラン',
        Monthly: '月額プラン',
        'Monthly (Japan)': '月額プラン',
        'You have previously canceled your membership account. Click here to turn auto-renew back on and reactivate your membership.': '現在の購読期間満了とともに退会となりますが、上記のボタンをクリックいただくと、購読の自動更新を再開します。',
        'You purchased your membership through Apple. To manage your membership, please use your iTunes account settings.': 'Appleからご購読いただいております。ご購読管理はiTunesのアカウント設定から行って下さい。',
        'You purchased your membership through Google. To manage your membership, please use your Google account settings.': 'Googleからご購読いただいております。ご購読管理はGoogleのアカウント設定から行って下さい。',
        'You will be charged a #{planInterval} fee of #{planAmount} in #{daysLeftInWords} after your free trial ends.': '残り#{daysLeftInWords}のフリートライアル終了後、#{planInterval}の料金として#{planAmount}が決済されます。',
        'Gift - ': 'ギフト - ',
        '#{planTerm} billing at #{planPrice}': '#{planTerm}: #{planPrice}',
        'We’re sorry to see you go. If you’d like to end your subscription click OK.': 'OKをクリックすると購読の自動更新を停止します。',
        'To turn your subscription auto-renew back on, click OK.': 'OKをクリックすると購読の自動更新を再開します。',
    },
};

export const MembershipSettings = ({
                                       showModal,
                                   }) => {
    const {getUserSetting, userHasPermission} = useUserSettings();
    const {language} = usePageVariant();
    const localize = getLocalization({dictionary, language});
    const platform = getUserSetting(PLAN_PLATFORM);
    const userIsMemberful = getUserSetting(PLAN_IS_MEMBERFUL);
    const userCanChangePlan = userHasPermission(CHANGE_PLAN);
    const isPlanAlreadyDiscounted = getUserSetting(PLAN_HAS_DISCOUNT);

    // Assemble the plan description
    const userHasGiftMembership = getUserSetting(MEMBERSHIP_IS_GIFT);
    const symbol = getUserSetting(PLAN_SYMBOL);
    const planName = localize(getUserSetting(PLAN_NAME));
    const planInterval = localize(getUserSetting(PLAN_INTERVAL));
    const planPrice = getUserSetting(PLAN_PRICE);
    const planDiscountedPrice = getUserSetting(PLAN_DISCOUNTED_DISPLAY_PRICE);
    const placeholder = userHasGiftMembership ?
        localize('Gift - ') + planName :
        localize(
            '#{planTerm} billing at #{planPrice}',
            {
                planTerm: planInterval ? planInterval : planName,
                planPrice: `${symbol}${planDiscountedPrice || planPrice}`,
            }
        );

    // Assemble the description of the plan's status
    const daysLeft = getUserSetting(MEMBERSHIP_DAYS_LEFT);
    const daysLeftInWords = daysLeft + localize(daysLeft === 1 ? ' day' : ' days');
    const status = getUserSetting(SUBSCRIPTION_STATUS);
    const userHasSubscription = getUserSetting(MEMBERSHIP_IS_SUBSCRIPTION);

    const planStatus = function () {
        if (status === 'trialing') {
            const trial = localize(
                'You will be charged a #{planInterval} fee of #{planAmount} in #{daysLeftInWords} after your free trial ends.',
                {
                    planInterval: localize(planInterval).toLowerCase(),
                    planAmount: `${symbol}${planDiscountedPrice || planPrice}`,
                    daysLeftInWords,
                }
            );
            return trial;
        }

        if (status === 'canceled') {
            return localize('Your subscription has been canceled. Your membership ends in #{daysLeftInWords}.', {daysLeftInWords});
        }

        if (status === 'past_due') {
            return <span
                className={styles.error}>{localize('Your last payment could not be processed. Please update the card on file.')}</span>;
        }

        if (userHasGiftMembership) {
            return localize('Your gift is valid for the next #{daysLeftInWords}. Enjoy!', {daysLeftInWords});
        }

        if (userHasSubscription) {
            if (daysLeft === 0) {
                return localize('Your subscription auto-renews today.');
            }

            return localize('Your subscription will auto-renew in #{daysLeftInWords}.', {daysLeftInWords});
        }

        return null;
    }();

    const {cancelSubscription} = useCancelSubscription();

    function handleCancelSubscription() {
        // eslint-disable-next-line no-restricted-globals
        const confirmation = confirm(localize('We’re sorry to see you go. If you’d like to end your subscription click OK.'));

        if (!confirmation) {
            return;
        }

        const isMemberful = getUserSetting(PLAN_IS_MEMBERFUL);
        isMemberful ? window.location = MEMBERFUL_URL : cancelSubscription();
    }

    const {reactivateSubscription, loading: reactivatingSubscription} = useReactivateSubscription();

    function handleReactivateSubscription() {
        // eslint-disable-next-line no-restricted-globals
        const confirmation = confirm(localize('To turn your subscription auto-renew back on, click OK.'));

        if (!confirmation) {
            return;
        }

        reactivateSubscription();
    }

    const trackedReactivateSubscription = useTracking(trackPaymentReactivationSuccess, {}, handleReactivateSubscription);

    return (
        <div>
            <SettingsSection
                title={localize('Your plan')}
                subtitle={planStatus}
            >
                <SettingsField
                    onClick={() => showModal('changePlan')}
                    disabled={!userCanChangePlan}
                    buttonCTA={localize('Manage membership')}
                    fieldDescription={placeholder}
                    Icon={MembershipBadge}
                />
            </SettingsSection>
            {
                userHasPermission(EDIT_BILLING) &&
                <SettingsSection
                    title={localize('Your billing')}
                    subtitle={localize('Manage your payment information')}
                >
                    <SettingsField
                        buttonCTA={localize('Manage billing')}
                        fieldDescription={getUserSetting(CREDIT_CARD_SUMMARY, language)}
                        Icon={CreditCardIcon}
                        onClick={() => showModal('billing')}
                        id="manage-billing-description"
                    />
                </SettingsSection>
            }
            {
                (userHasPermission(CANCEL_SUBSCRIPTION) || userIsMemberful) &&
                <Fragment>
                    <Button
                        variant="warning"
                        inline={true}
                        onClick={() => {
                            if (!isPlanAlreadyDiscounted && !userIsMemberful) {
                                showModal('membershipCancelation');
                            } else {
                                handleCancelSubscription();
                            }
                        }}
                        describedBy="cancel-account-description"
                    >{localize('Cancel your membership')}</Button>
                    <p className={styles.subscriptionCopy}
                       id="cancel-account-description">{localize('This will turn off auto-renewal of your membership. You’ll still have access to premium content until the end of your free trial or the last period you paid for.')}</p>
                </Fragment>
            }
            {
                userHasPermission(REACTIVATE_SUBSCRIPTION) &&
                <Fragment>
                    <Button
                        onClick={trackedReactivateSubscription}
                        describedBy="reactivate-account-description"
                        loading={reactivatingSubscription}
                    >
                        {localize('Reactivate your membership')}
                    </Button>
                    <p className={styles.subscriptionCopy}
                       id="reactivate-account-description">{localize('You have previously canceled your membership account. Click here to turn auto-renew back on and reactivate your membership.')}</p>
                </Fragment>
            }
            {
                'ios' === platform &&
                <p className={styles.subscriptionCopy}>{localize('You purchased your membership through Apple. To manage your membership, please use your iTunes account settings.')}</p>
            }
            {
                'android' === platform &&
                <p className={styles.subscriptionCopy}>{localize('You purchased your membership through Google. To manage your membership, please use your Google account settings.')}</p>
            }
        </div>
    );
};

MembershipSettings.propTypes = {
    showModal: PropTypes.func.isRequired,
};

export default withModal(MembershipSettings);
