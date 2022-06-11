import React, {Fragment, useRef, useState} from 'react';
import classnames from 'classnames/bind';
import {PASSWORD_LENGTH_ERROR} from 'helpers/user';
import FormWithValidation from 'components/FormWithValidation/FormWithValidation';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import {Button} from '@quartz/interface';
import Link from 'components/Link/Link';
import styles from './ChangePasswordForm.module.scss';
import {PasswordInput} from 'components/Input/Input';
import useUpdatePassword from 'helpers/hooks/useUpdatePassword';
import useNotifications from 'helpers/hooks/useNotifications';

const cx = classnames.bind(styles);

export default function ChangePasswordForm(props: { handleClose: () => void }) {
    const currentPasswordRef = useRef<any>();
    const newPasswordRef = useRef<any>();

    const [error, setError] = useState<React.ReactNode>(null);

    const {notifySuccess} = useNotifications();
    const {updatePassword, loading} = useUpdatePassword();

    function onFormSubmit() {
        const currentPassword = currentPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;

        setError(null);

        updatePassword({password: currentPassword, newPassword})
            .then(() => {
                props.handleClose();
                notifySuccess('Your password was changed successfully.');
            })
            .catch((message: React.ReactNode) => setError(message));
    }

    return (
        <Fragment>
            <FormHeader title="Change your password"/>
            <div className={cx('form-container')}>
                <FormWithValidation
                    error={error}
                    onSubmit={onFormSubmit}
                    loading={loading}
                >
                    <div className={cx('field-container')}>
                        <PasswordInput
                            id="change-password-form-current"
                            label="Current password"
                            placeholder="Current password"
                            inputRef={currentPasswordRef}
                            required={true}
                        />
                    </div>
                    <div className={cx('field-container')}>
                        <PasswordInput
                            id="change-password-form-new"
                            label="New password"
                            pattern=".{6,20}" // Minimum of 6 characters, maximum of 20
                            placeholder="New password"
                            inputRef={newPasswordRef}
                            required={true}
                            subtext={PASSWORD_LENGTH_ERROR}
                        />
                    </div>
                </FormWithValidation>
                <div className={cx('cancel-button-container')}>
                    <Button onClick={props.handleClose} variant="secondary">Cancel</Button>
                </div>
                <Link
                    className={cx('reset-password-link')}
                    to="/reset-password/"
                >
                    I forgot my password
                </Link>
            </div>
        </Fragment>
    );
}
