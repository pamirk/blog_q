import React from 'react';
import PropTypes from 'prop-types';
import SecuritySettings from '../SecuritySettings/SecuritySettings';
import {Spinner} from '../../@quartz/interface';
import MembershipSettings from '../MembershipSettings/MembershipSettings';
import NoMembershipSettings from '../NoMembershipSettings/NoMembershipSettings';
import ProfileForm from '../Forms/ProfileForm/ProfileForm';
import {USER_EMAIL} from '../../helpers/types/account';
import styles from '../Forms/Forms.module.scss';

const SettingsTab = ({
                         activeTab,
                         handleDeleteUser,
                         isMember,
                         getUserAttribute,
                         hasFetchedSettings,
                         updateProfile,
                         formState,
                         ...formProps
                     }) => {

    const sharedProps = {
        formState,
        ...formProps,
    };

    if (!hasFetchedSettings) {
        return (
            <div className={styles.spinner}>
                <Spinner/>
            </div>
        );
    }

    switch (activeTab) {
        case 'profile':
            return (
                <ProfileForm
                    handleDelete={handleDeleteUser}
                    handleSubmit={updateProfile}
                    {...sharedProps}
                />
            );

        case 'security':
            return (
                <SecuritySettings
                    userEmail={getUserAttribute(USER_EMAIL)}
                    {...sharedProps}
                />
            );

        case 'membership':
            return isMember ? <MembershipSettings/> : <NoMembershipSettings/>;
    }
};

SettingsTab.propTypes = {
    activeTab: PropTypes.string.isRequired,
    formState: PropTypes.object.isRequired,
    getUserAttribute: PropTypes.func.isRequired,
    handleDeleteUser: PropTypes.func.isRequired,
    hasFetchedSettings: PropTypes.bool.isRequired,
    isMember: PropTypes.bool.isRequired,
    updateProfile: PropTypes.func.isRequired,
};

export default SettingsTab;
