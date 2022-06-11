import React, {Fragment} from 'react';
import compose from '../../../helpers/compose';
import PropTypes from 'prop-types';
import styles from '../Forms.module.scss';
import classnames from 'classnames/bind';
import {EmailField, PasswordField} from '../../Input/Input';
import FormActions from '../../../components/FormActions/FormActions';
import Form from '../../../components/Form/Form';
import Link from '../../../components/Link/Link';
import SocialLogin from '../../../components/SocialLogin/SocialLogin';
import {blurFields, getFieldErrors, validateField, validateFields, validateForm} from '../../../helpers/forms';
import {validateEmail, validatePassword} from '../../../helpers/user';
import {withUserApi} from '../../../helpers/wrappers';
import {SubscribeLink} from '../../AccountLink/AccountLink';

const cx = classnames.bind(styles);

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formError: null,
            email: {
                value: '',
                errors: [],
                validator: validateEmail,
            },
            password: {
                value: '',
                errors: [],
                validator: validatePassword,
            },
        };

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const fieldNames = ['email', 'password'];
        this.setState(validateFields(fieldNames, this.state));
    }

    handleFieldChange(name, fieldState = {}) {
        const oldFieldState = this.state[name];
        const newFieldState = validateField({...oldFieldState, ...fieldState});

        this.setState({
            formError: null,
            [name]: newFieldState,
        });
    }

    handleSubmit(event) {
        if (event) {
            event.preventDefault();
        }

        const {loginUser} = this.props;
        const fieldNames = ['email', 'password'];

        // Validate the fields in case the user hits submit without touching anything.
        const newFormState = validateFields(fieldNames, this.state);

        // Gather field errors, if there are any.
        const fieldErrors = getFieldErrors(fieldNames, newFormState);

        if (fieldErrors?.length) {
            this.setState(blurFields(fieldNames, newFormState));
            return;
        }

        const {email, password} = newFormState;

        loginUser({email: email.value, password: password.value});
    }

    render() {
        const {email, password, formError} = this.state;
        const {pendingRequestId, userError} = this.props;

        const hasFieldErrors = !validateForm(['email', 'password'], this.state);

        return (
            <div className={cx('container')}>
                <header className={cx('header')}>
                    <h1 className={cx('title')}>Log in</h1>
                    <p className={cx('description')}>Don’t have an account? <SubscribeLink trackingContext="login">Become
                        a member</SubscribeLink>.</p>
                </header>

                <Form
                    onSubmit={this.handleSubmit}
                >
                    <div className={cx('field')}>
                        <EmailField
                            id="login-email"
                            fieldName="email"
                            handleFieldChange={this.handleFieldChange}
                            fieldState={email}
                            label="Email"
                            autoComplete="username"
                        />
                    </div>
                    <div className={cx('field')}>
                        <PasswordField
                            id="login-password"
                            fieldName="password"
                            handleFieldChange={this.handleFieldChange}
                            fieldState={password}
                            label="Password"
                            placeholder="Enter password"
                            autoComplete="current-password"
                            subtext={<Fragment>or email yourself a <Link
                                to={{pathname: '/login/by-email/', state: {email: email.value}}}>login
                                link</Link> instead</Fragment>}
                        />
                    </div>
                    <FormActions
                        submitText="Log in"
                        loading={!!pendingRequestId}
                        inactive={hasFieldErrors}
                        error={formError || userError}
                    />
                </Form>
                <div className={cx('social-login')}>
                    <p className={cx('social-login-label')}>or log in with social</p>
                    <SocialLogin/>
                </div>
                <div className={cx('login-help')}>
                    <Link to="/reset-password/" className={cx('forgot-password')}>
                        I forgot my password
                    </Link>
                    <p>Need help? Email <Link to="mailto:join@qz.com">join@qz.com</Link> for support.</p>
                </div>
            </div>
        );
    }
}

LoginForm.propTypes = {
    loginUser: PropTypes.func.isRequired,
    pendingRequestId: PropTypes.string,
    userError: PropTypes.string,
};

export default compose(
    withUserApi()
)(LoginForm);
