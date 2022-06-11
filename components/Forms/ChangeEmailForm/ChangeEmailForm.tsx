import React, {Fragment, useRef, useState} from 'react';
import classnames from 'classnames/bind';
import FormWithValidation from 'components/FormWithValidation/FormWithValidation';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import {Button} from '@quartz/interface';
import styles from './ChangeEmailForm.module.scss';
import {EmailInput, PasswordInput} from 'components/Input/Input';
import {USER_COMPANY, USER_NAME, USER_TITLE} from 'helpers/types/account';
import useVerifiedUserEmailUpdate from 'helpers/hooks/useVerifiedUserEmailUpdate';
import useNotifications from 'helpers/hooks/useNotifications';
import {useClientSideUserData} from 'helpers/hooks';

const cx = classnames.bind(styles);

export default function ChangeEmailForm(props: { handleClose: () => void }) {
    const newEmailRef = useRef<any>();
    const currentPasswordRef = useRef<any>();
    const {notifySuccess, notifyError} = useNotifications();
    const [error, setError] = useState<React.ReactNode>(null);

    const {getUserAttribute}: any = useClientSideUserData();

    const {updateEmailWithVerification, loading} = useVerifiedUserEmailUpdate();

    function onFormSubmit() {
        setError(null);

        updateEmailWithVerification({
            email: newEmailRef.current.value,
            password: currentPasswordRef.current.value,
            firstName: getUserAttribute(USER_NAME),
            company: getUserAttribute(USER_COMPANY),
            title: getUserAttribute(USER_TITLE),
        })
            .then(() => {
                notifySuccess('Your email was changed successfully.');
                props.handleClose();
            })
            .catch((message: React.ReactNode) => {
                setError(message);
                notifyError('An error was encountered while changing your email.');
            });
    }

    return (
        <Fragment>
            <FormHeader title="Change your email"/>
            <div className={cx('form-container')}>
                <FormWithValidation
                    error={error}
                    onSubmit={onFormSubmit}
                    loading={loading}
                >
                    <div className={cx('field-container')}>
                        <EmailInput
                            id="change-email"
                            label="New email"
                            placeholder="New email"
                            inputRef={newEmailRef}
                            required={true}
                        />
                    </div>
                    <div className={cx('field-container')}>
                        <PasswordInput
                            id="current-password"
                            label="Current password"
                            placeholder="Current password"
                            inputRef={currentPasswordRef}
                            required={true}
                        />
                    </div>
                </FormWithValidation>
                <div className={cx('cancel-button-container')}>
                    <Button onClick={props.handleClose} variant="secondary">Cancel</Button>
                </div>
            </div>
        </Fragment>
    );
}
