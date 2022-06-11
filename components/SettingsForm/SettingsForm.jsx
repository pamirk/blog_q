import React, {Component} from 'react';
import compose from '../../helpers/compose';
import PropTypes from 'prop-types';
import {Button, PageHeader, TabNav, TabNavItem} from '../../@quartz/interface';
import {validateField, validateFields} from '../../helpers/forms';
import {allPlans} from '../../config/membership';
import Redirect from '../Redirect/Redirect';
import SettingsTab from '../SettingsTab/SettingsTab';
import styles from './SettingsForm.module.scss';
import useUserLogout from '../../helpers/hooks/useUserLogout';
import {
    PLAN_ID,
    USER_COMPANY,
    USER_EMAIL,
    USER_INDUSTRY_ID,
    USER_JOB_LEVEL_ID,
    USER_NAME,
    USER_TITLE,
} from '../../helpers/types/account';
import {withNotifications, withUserApi} from '../../helpers/wrappers';
import Link from '../Link/Link';

function Logout({children}) {
    const onClick = useUserLogout();

    return (
        <Button
            inline={true}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

Logout.propTypes = {
    children: PropTypes.node.isRequired,
};

export class SettingsForm extends Component {
    constructor(props) {
        super(props);

        this.fieldNames = [
            'firstName',
            'company',
            'title',
        ];

        this.state = validateFields(this.fieldNames, this.getInitialState());

        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {activeTab: prevTab} = prevProps;
        const {activeTab, hasFetchedSettings, resetFormState, getUserAttribute} = this.props;

        if (hasFetchedSettings && !prevProps.hasFetchedSettings) {
            this.setState(validateFields(this.fieldNames, this.getInitialState()));
        }

        if (activeTab !== prevTab) {
            // Resets the form state of withUserApi, not Settings
            resetFormState();
        }

        if (prevProps.getUserAttribute === getUserAttribute) {
            return;
        }
    }

    getInitialState() {
        const {getUserAttribute, userError} = this.props;

        return {
            formError: userError,
            firstName: {
                value: getUserAttribute(USER_NAME),
                errors: [],
            },
            email: {
                value: getUserAttribute(USER_EMAIL),
                errors: [],
                readOnly: true,
            },
            title: {
                value: getUserAttribute(USER_TITLE),
                errors: [],
            },
            company: {
                value: getUserAttribute(USER_COMPANY),
                errors: [],
            },
            jobLevelId: {
                value: getUserAttribute(USER_JOB_LEVEL_ID),
                errors: [],
            },
            industryId: {
                value: getUserAttribute(USER_INDUSTRY_ID),
                errors: [],
            },
        };
    }

    setFieldState(name, newState = {}) {
        this.setState({
            [name]: {
                ...this.state[name],
                ...newState,
            },
        });
    }

    handleFieldChange(name, fieldState = {}) {
        const oldFieldState = this.state[name];
        const newFieldState = validateField({...oldFieldState, ...fieldState});

        this.setState({
            formError: null,
            [name]: newFieldState,
        });
    }

    updateProfile(event) {
        event.preventDefault();

        const {
            company,
            email,
            firstName,
            industryId,
            jobLevelId,
            title,
        } = this.state;

        const {updateProfile, notifySuccess, notifyError} = this.props;

        // No validation to do on names, just send
        updateProfile({
            company: company.value,
            email: email.value,
            firstName: firstName.value,
            industryId: parseInt(industryId.value, 10),
            jobLevelId: parseInt(jobLevelId.value, 10),
            title: title.value,
        })
            .then(() => notifySuccess('Your profile was updated!'))
            .catch(() => notifyError('There was an error updating your profile.'));

    }

    handleDeleteUser() {
        const {localize} = this.props;
        // eslint-disable-next-line no-restricted-globals
        const confirmation = confirm(localize('We’re sorry to see you go. If you’d like to delete your account click OK.'));
        this.props.deleteUser({confirm: confirmation});
    }

    render() {
        const {
            activeTab,
            getUserAttribute,
            getUserSetting,
            hasFetchedSettings,
            isLoggedIn,
            isMember,
            locale,
            localize,
            pendingRequestId,
            tabs,
            userError,
        } = this.props;

        if (!isLoggedIn) {
            return <Redirect to="/login/"/>;
        }

        const planId = getUserSetting(PLAN_ID);
        const {countryCode} = allPlans[planId] || {};

        if ('jp' === countryCode && locale !== 'japan') {
            return <Redirect to={`/japan/settings/${activeTab}/`}/>;
        }

        return (
            <div className={styles.container} lang={locale === 'japan' ? 'ja' : undefined}>
                <PageHeader
                    intro={<Logout>{localize('Sign out of your Quartz account')}</Logout>}
                    showPadding={false}
                    title={localize('Settings')}
                >
                    <TabNav>
                        {
                            tabs.map(tab => (
                                <TabNavItem key={tab.slug} isActive={activeTab === tab.slug}>
                                    <Link
                                        to={`${'japan' === locale ? '/japan' : ''}/settings/${tab.slug}/`}>{localize(tab.label)}</Link>
                                </TabNavItem>
                            ))
                        }
                    </TabNav>
                </PageHeader>
                <div className={styles.content}>
                    <SettingsTab
                        activeTab={activeTab}
                        formError={this.state.formError || userError}
                        formState={this.state}
                        getUserAttribute={getUserAttribute}
                        handleDeleteUser={this.handleDeleteUser}
                        handleFieldChange={this.handleFieldChange}
                        hasFetchedSettings={hasFetchedSettings}
                        handleCancelSubscription={this.handleCancelSubscription}
                        handleReactivateSubscription={this.handleReactivateSubscription}
                        isMember={isMember}
                        loading={!!pendingRequestId}
                        updatePassword={this.updatePassword}
                        updateProfile={this.updateProfile}
                    />
                </div>
            </div>
        );
    }
}

SettingsForm.propTypes = {
    activeTab: PropTypes.string.isRequired,
    deleteUser: PropTypes.func.isRequired,
    getUserAttribute: PropTypes.func.isRequired,
    getUserSetting: PropTypes.func.isRequired,
    hasFetchedSettings: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMember: PropTypes.bool.isRequired,
    locale: PropTypes.string,
    localize: PropTypes.func.isRequired,
    notifyError: PropTypes.func.isRequired,
    notifySuccess: PropTypes.func.isRequired,
    pendingRequestId: PropTypes.string,
    resetFormState: PropTypes.func.isRequired,
    tabs: PropTypes.array.isRequired,
    updateProfile: PropTypes.func.isRequired,
    userError: PropTypes.string,
};

export default compose(
    withUserApi({useSettings: true}),
    withNotifications
)(SettingsForm);
