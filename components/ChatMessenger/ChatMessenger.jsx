import React from 'react';
import PropTypes from 'prop-types';
import compose from '../../helpers/compose';
import {loadScriptOnce} from '../../helpers/utils';
import {USER_EMAIL, USER_ID, USER_NAME} from '../../helpers/types/account';
import {withClientSideUserData, withConditionalRendering} from '../../helpers/wrappers';
import './ChatMessenger.module.scss';

const intercomAppId = 'rkgd96uj';

class ChatMessenger extends React.Component {

    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        let intercomOptions = {
            app_id: intercomAppId,
            is_member: false,
        };

        const {isMember, getUserAttribute} = this.props;

        const userId = getUserAttribute(USER_ID);
        const userEmail = getUserAttribute(USER_EMAIL);
        const userName = getUserAttribute(USER_NAME);

        if (userId) {

            const userOptions = {
                email: userEmail,
                user_id: userId,
                name: userName,
                is_member: isMember,
            };

            intercomOptions = {...intercomOptions, ...userOptions};
        }

        window.intercomSettings = intercomOptions;

        loadScriptOnce('https://widget.intercom.io/widget/rkgd96uj')
            .then(() => {
                // noinspection JSUnresolvedVariable
                if (window.Intercom) {
                    window.Intercom('boot', intercomOptions);
                }
            });

    }

    componentWillUnmount() {
        // noinspection JSUnresolvedVariable
        if (window.Intercom) {
            window.Intercom('shutdown');
        }
    }

    render() {
        return null;
    }
}

ChatMessenger.propTypes = {
    getUserAttribute: PropTypes.func.isRequired,
    isMember: PropTypes.bool.isRequired,
};

export default compose(
    withClientSideUserData(),
    withConditionalRendering(({getUserAttribute}) => getUserAttribute(USER_NAME))
)(ChatMessenger);
