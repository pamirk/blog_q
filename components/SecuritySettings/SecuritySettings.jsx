// noinspection JSNonASCIINames

import React, {Fragment} from 'react';
import compose from '../../helpers/compose';
import PropTypes from 'prop-types';
import {Button, Icon} from '../../@quartz/interface';
import {DELETE_ACCOUNT} from '../../helpers/types/permissions';
import PasswordIcon from '../../svgs/password';
import SettingsSection, {SettingsField} from '../SettingsSection/SettingsSection';
import SocialConnection from './components/SocialConnection/SocialConnection';
import styles from './SecuritySettings.module.scss';
import {withModal, withNotifications, withUserApi,} from '../../helpers/wrappers';
import getLocalization from '../../helpers/localization';
import usePageVariant from '../../helpers/hooks/usePageVariant';
import {ssoProviders} from '../../components/SocialLogin/SocialLogin';

const DELETE_ACCOUNT_REQUEST_ID = 'delete_account_request_id';
const deleteAccountConfirmation = 'We’re sorry to see you go. If you’d like to delete your account click OK.';

// noinspection NonAsciiCharacters
const dictionary = {
    ja: {
        Email: 'メールアドレス',
        'Manage your email address': 'メールアドレスを管理',
        'Change email': 'アドレスを変更する',
        Password: 'パスワード',
        'Manage your account password.': 'パスワードを管理',
        'Change password': 'パスワードを変更する',
        'Social accounts': 'ソーシャルアカウント',
        'Connecting social accounts allows you to log in with a click of a button.': '以下の接続をクリックするとソーシャルアカウントを利用してログインが可能になります',
        Connect: '接続',
        'Delete account': 'アカウントを削除',
        'We have to cancel your membership subscription before you can delete your account. Please send an email to #{emailLink} and we’ll help you with this.': '有料購読中にアカウントを削除することはできません。購読中に削除をご希望の場合は#{emailLink}までご連絡下さい。',
        'If you delete your account, your data will be gone forever.': '一度アカウントを削除すると、すべての情報は永遠に消去されます。',
    },
};

export const SecuritySettings = ({
                                     deleteUser,
                                     showModal,
                                     formState,
                                     userEmail,
                                     userHasPermission,
                                 }) => {
    const {language} = usePageVariant();
    const localize = getLocalization({dictionary, language});
    return (
        <div>
            <SettingsSection
                title={localize('Email')}
                subtitle={localize('Manage your email address')}
            >
                <SettingsField
                    buttonCTA={localize('Change email')}
                    fieldDescription={userEmail}
                    Icon={(props) => <Icon name="envelope" {...props} />}
                    onClick={() => showModal('changeEmail', formState)}
                />
            </SettingsSection>
            <SettingsSection
                title={localize('Password')}
                subtitle={localize('Manage your account password.')}
            >
                <SettingsField
                    buttonCTA={localize('Change password')}
                    fieldDescription="•••••••••••••••"
                    Icon={PasswordIcon}
                    onClick={() => showModal('changePassword')}
                />
            </SettingsSection>
            <SettingsSection
                title={localize('Social accounts')}
                subtitle={localize('Connecting social accounts allows you to log in with a click of a button.')}
            >
                {
                    ssoProviders.map(provider => <SocialConnection key={provider.name} provider={provider}/>)
                }
            </SettingsSection>
            <Button
                variant="warning"
                inline={true}
                describedBy="delete-account-description"
                disabled={!userHasPermission(DELETE_ACCOUNT)}
                onClick={() => deleteUser({
                    // eslint-disable-next-line no-restricted-globals
                    confirm: confirm(deleteAccountConfirmation),
                    requestId: DELETE_ACCOUNT_REQUEST_ID,
                })}
            >{localize('Delete account')}</Button>
            <p className={styles.deleteDescription} id="delete-account-description">
                {
                    userHasPermission(DELETE_ACCOUNT) ?
                        localize('If you delete your account, your data will be gone forever.')
                        : <Fragment>{
                            localize('We have to cancel your membership subscription before you can delete your account. Please send an email to #{emailLink} and we’ll help you with this.', {emailLink: 'members@qz.com'})
                        }</Fragment>
                }
            </p>
        </div>
    );
};

SecuritySettings.propTypes = {
    deleteUser: PropTypes.func.isRequired,
    formState: PropTypes.object,
    showModal: PropTypes.func.isRequired,
    userEmail: PropTypes.string,
    userHasPermission: PropTypes.func.isRequired,
};

export default compose(
    withUserApi(),
    withModal,
    withNotifications
)(SecuritySettings);
