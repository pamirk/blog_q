import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'next/router';
import compose from '../../../helpers/compose';
import {validateEmail, validateRequiredField} from '../../../helpers/user';
import {validateField, validateFields, blurFields, validateForm} from '../../../helpers/forms';
import {withUserApi, withNotifications} from '../../../helpers/wrappers';
import {USER_EMAIL} from '../../../helpers/types/account';
import {giftPlanIds} from '../../../config/membership';
import {CREATE_GIFT_REQUEST_ID} from '../../../helpers/wrappers/withUserApi/config';
import {getPlanOptions} from '../../../helpers/plans';

export const fieldNames = ['senderEmail', 'senderName', 'recipientName', 'recipientEmail', 'plan'];

const defaultRequestId = CREATE_GIFT_REQUEST_ID;

const withGiftFormState = () => FormComponent => {
    class FormComponentWithGiftFormState extends Component {
        constructor(props) {

            super(props);

            const planId = 8;
            const {getUserAttribute} = props;
            const senderEmail = getUserAttribute(USER_EMAIL);

            this.state = {
                formError: null,
                formLoading: false,
                senderName: {
                    value: '',
                    validator: validateRequiredField,
                    errors: [],
                },
                senderEmail: {
                    value: senderEmail || '',
                    validator: senderEmail ? null : validateEmail,
                    errors: [],
                },
                recipientName: {
                    value: '',
                    validator: validateRequiredField,
                    errors: [],
                },
                recipientEmail: {
                    value: '',
                    validator: validateEmail,
                    errors: [],
                },
                message: {
                    value: '',
                },
                plan: {
                    value: `${planId}`,
                    errors: [],
                },
            };

            this.handleFieldChange = this.handleFieldChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleStripeReady = this.handleStripeReady.bind(this);
            this.handleLogout = this.handleLogout.bind(this);
            this.handlePaymentRequestSubmit = this.handlePaymentRequestSubmit.bind(this);
        }

        componentDidMount() {
            this.setState(validateFields(fieldNames, this.state));
        }

        componentDidUpdate(prevProps) {
            const {isLoggedIn, getUserAttribute, resetFormState: resetUserApiFormState} = this.props;
            const {getUserAttribute: getPreviousUserAttribute} = prevProps;

            const email = getUserAttribute(USER_EMAIL);
            const previousEmail = getPreviousUserAttribute(USER_EMAIL);

            if (isLoggedIn && email !== previousEmail) {
                // The login modal uses a different instance of withUserApi, so we have to reset ours manually on login
                resetUserApiFormState();
                this.setState({senderEmail: {...this.state.senderEmail, validator: null, value: email}});
            }
        }

        // Initial Stripe token getter which will be overridden by CreditCard
        // component via handleStripeReady prop, which is passed down.
        getStripeToken() {
            return Promise.reject(new Error('Credit card form is not ready.'));
        }

        handleStripeReady(tokenGetter) {
            this.getStripeToken = tokenGetter;
        }

        handlePaymentRequestSubmit(event, captchaToken) {
            const {createGift} = this.props;
            const {senderName, senderEmail, recipientEmail, recipientName, message, plan} = this.state;

            return createGift({
                captchaToken,
                senderName: senderName.value,
                senderEmail: senderEmail.value,
                recipientName: recipientName.value,
                recipientEmail: recipientEmail.value,
                message: message.value,
                planId: plan.value,
                tokenObject: event.token,
                requestId: 'payment_request_button_id',
            });
        }

        handleSubmit(_event, data = {}) {
            const {createGift} = this.props;
            const {captchaToken} = data;
            const validatedState = validateFields(fieldNames, this.state);
            const newFormState = {...blurFields(fieldNames, validatedState), formError: null};

            if (!validateForm(['senderEmail', 'senderName', 'recipientName', 'recipientEmail'], newFormState)) {
                this.setState(newFormState);
                return;
            }

            this.setState(newFormState);

            const {recipientName, recipientEmail, senderEmail, senderName, message, plan} = newFormState;

            const stripeTokenPromise = this.getStripeToken();

            this.setState({formLoading: true}, () => {
                stripeTokenPromise
                    .then(token => createGift({
                        captchaToken,
                        senderName: senderName.value,
                        senderEmail: senderEmail.value,
                        recipientName: recipientName.value,
                        recipientEmail: recipientEmail.value,
                        message: message.value,
                        planId: plan.value,
                        tokenObject: token,
                    }))
                    .catch(({message}) => this.setState({formError: message}))
                    .finally(() => this.setState({formLoading: false}));
            });
        }

        handleLogout() {
            this.setState({senderEmail: {...this.state.senderEmail, value: '', validator: validateEmail}});
            this.props.logoutUser();
        }

        handleFieldChange(name, fieldState = {}) {
            const oldFieldState = this.state[name];
            const newFieldState = validateField({...oldFieldState, ...fieldState});

            this.setState({
                formError: null,
                [name]: newFieldState,
            });
        }

        render() {
            const {formError, formLoading, ...formState} = this.state;

            const {pendingRequestId, userError} = this.props;

            const planOptions = getPlanOptions();
            const giftPlanOptions = giftPlanIds.map(id => planOptions.find(plan => `${id}` === plan.value));

            return (
                <FormComponent
                    canSubmit={!validateForm(['senderName', 'senderEmail', 'recipientName', 'recipientEmail'], formState)}
                    handleFieldChange={this.handleFieldChange}
                    handleStripeReady={this.handleStripeReady}
                    handleSubmit={this.handleSubmit}
                    handleLogout={this.handleLogout}
                    handlePaymentRequestSubmit={this.handlePaymentRequestSubmit}
                    formState={formState}
                    formError={formError || userError}
                    formLoading={pendingRequestId === defaultRequestId || formLoading}
                    giftPlanOptions={giftPlanOptions}
                    {...this.props}
                />
            );
        }
    }

    FormComponentWithGiftFormState.propTypes = {
        createGift: PropTypes.func.isRequired,
        getUserAttribute: PropTypes.func.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        logoutUser: PropTypes.func.isRequired,
        pendingRequestId: PropTypes.string,
        resetFormState: PropTypes.func.isRequired,
        userError: PropTypes.node,
    };

    return compose(
        withRouter,
        withNotifications,
        withUserApi()
    )(FormComponentWithGiftFormState);
};
export default withGiftFormState;