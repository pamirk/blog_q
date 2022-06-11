import React from 'react';
import PropTypes from 'prop-types';
import {BillingModal, ChangeEmailForm, ChangePasswordForm, ChangePlanForm, MembershipCancelationForm,} from './bundles';

const ModalContent = ({handleClose, type, modalContentProps}) => {
    const props = {
        handleClose,
        ...modalContentProps,
    };

    switch (type) {
        case 'billing':
            return <BillingModal {...props} />;

        case 'changePlan':
            return <ChangePlanForm {...props} />;

        case 'changeEmail':
            return <ChangeEmailForm {...props} />;

        case 'changePassword':
            return <ChangePasswordForm {...props} />;

        case 'membershipCancelation':
            return <MembershipCancelationForm {...props} />;

        default:
            return null;
    }
};

ModalContent.propTypes = {
    handleClose: PropTypes.func.isRequired,
    modalContentProps: PropTypes.object.isRequired,
    type: PropTypes.oneOf([
        'billing',
        'changePlan',
        'changeEmail',
        'changePassword',
        'membershipCancelation',
    ]),
};

export default ModalContent;
