import {connect} from 'react-redux';
import {getRoleProperties, getUserAttribute, userHasSocialConnection,} from '../user';

export const mapStateToData = state => {
    const {promotionalContentIds, user, userRole} = state.auth;

    const roleProps = getRoleProperties(userRole);

    return {
        getUserAttribute: getUserAttribute.bind(null, user),
        promotionalContentIds,
        userHasSocialConnection: userHasSocialConnection.bind(null, user),
        ...roleProps,
    };
};

const WC = () => WrappedComponent => connect(mapStateToData)(WrappedComponent);
export default WC