import React, {Component} from 'react';
import PropTypes from 'prop-types';
import compose from '../../../../helpers/compose';
import {withAuth0, withClientSideUserData, withNotifications, withProps, withUserApi,} from '../../../../helpers/wrappers';
import {SettingsField} from '../../../../components/SettingsSection/SettingsSection';

export const getRequestId = providerName => `delete_${providerName}_connection_request_id`;

/*
	A wrapper to encapsulate the functionality of authorizing with
	Auth0 and passing the resulting token to the Newspicks API. This
	allows us to reuse the same functionality elsewhere, e.g. in the
	comment form.
*/
export const withAuth0Connection = () => WrappedComponent => {
    class ComponentWithAuth0Connection extends Component {
        connectAccount() {
            const {
                authorize,
                createSocialConnection,
                provider,
            } = this.props;

            authorize(provider.name)
                .then(({idToken}) => createSocialConnection({
                    idToken,
                    requestId: getRequestId(provider.name),
                    displayName: provider.displayName
                }));
        }

        disconnectAccount() {
            const {deleteSocialConnection, provider} = this.props;
            const {displayName, name} = provider;

            deleteSocialConnection({
                provider: name,
                // eslint-disable-next-line no-restricted-globals
                confirm: confirm(`If you disconnect your ${displayName} account you will no longer be able to use it to log in to your Quartz account. Would you like to continue?`),
                requestId: getRequestId(name),
                displayName,
            });
        }

        toggleAccountConnection() {
            const {connected} = this.props;

            if (connected) {
                this.disconnectAccount();
            } else {
                this.connectAccount();
            }
        }

        render() {
            return (
                <WrappedComponent
                    connectAccount={this.connectAccount.bind(this)}
                    disconnectAccount={this.disconnectAccount.bind(this)}
                    toggleAccountConnection={this.toggleAccountConnection.bind(this)}
                    {...this.props}
                />
            );
        }
    }

    ComponentWithAuth0Connection.propTypes = {
        authorize: PropTypes.func.isRequired,
        connected: PropTypes.bool.isRequired,
        createSocialConnection: PropTypes.func.isRequired,
        deleteSocialConnection: PropTypes.func.isRequired,
        notifyError: PropTypes.func.isRequired,
        notifySuccess: PropTypes.func.isRequired,
        pendingRequestId: PropTypes.string,
        provider: PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            Icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
            name: PropTypes.string.isRequired,
        }),
        requestPending: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            socialStatus: PropTypes.shape({
                hasApple: PropTypes.bool.isRequired,
                hasFacebook: PropTypes.bool.isRequired,
                hasLinkedIn: PropTypes.bool.isRequired,
                hasTwitter: PropTypes.bool.isRequired,
            }),
        }),
        userError: PropTypes.string,
    };

    const withConnectionStatus = props => {
        const {provider, userHasSocialConnection} = props;

        return {
            connected: userHasSocialConnection(provider.name),
        };
    };

    const withPendingRequestStatus = props => ({
        requestPending: props.pendingRequestId === getRequestId(props.provider.name),
    });

    return compose(
        withNotifications,
        withUserApi(),
        withClientSideUserData(),
        withProps(withConnectionStatus),
        withProps(withPendingRequestStatus),
        withAuth0()
    )(ComponentWithAuth0Connection);
};

export const SocialConnection = ({
                                     auth0Ready,
                                     connected,
                                     provider,
                                     requestPending,
                                     toggleAccountConnection,
                                 }) => {
    const {displayName, name, Icon} = provider;
    const disabled = !auth0Ready || requestPending;

    return (
        <SettingsField
            buttonCTA={connected ? 'Disconnect' : 'Connect'}
            disabled={disabled}
            fieldDescription={displayName}
            key={name}
            Icon={(props) => <Icon {...props} />}
            onClick={toggleAccountConnection}
        />
    );
};

SocialConnection.propTypes = {
    auth0Ready: PropTypes.bool.isRequired,
    connected: PropTypes.bool.isRequired,
    provider: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        Icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        name: PropTypes.string.isRequired,
    }),
    requestPending: PropTypes.bool.isRequired,
    toggleAccountConnection: PropTypes.func.isRequired,
};

export default withAuth0Connection()(SocialConnection);
