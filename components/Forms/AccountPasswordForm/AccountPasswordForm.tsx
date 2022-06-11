import React, { useRef, useState } from 'react';
import { PasswordInput } from 'components/Input/Input';
import FormActions from 'components/FormActions/FormActions';
import Form from 'components/Form/Form';
import { PASSWORD_LENGTH_ERROR } from 'helpers/user';
import getLocalization from 'helpers/localization';
import usePageVariant from 'helpers/hooks/usePageVariant';
import styles from '../Forms.module.scss';
import useUpdatePassword from 'helpers/hooks/useUpdatePassword';
import trackSegmentPasswordSet from 'helpers/tracking/segment/trackPasswordSet';

const dictionary = {
	ja: {
		[ PASSWORD_LENGTH_ERROR ]: 'パスワードは6〜20文字で設定してください',
		Password: 'パスワードを入力',
	},
};

const AccountPasswordForm = ( props: {
	submitText: string,
	trackingData: {
		stageName: string,
		context: string,
		formName: string,
		planId: number,
	},
} ) => {
	const { language } = usePageVariant();
	const localize = getLocalization( { dictionary, language } );

	const passwordRef = useRef<any>();
	const [ error, setError ] = useState<React.ReactNode>( null );

	const { updatePassword, loading } = useUpdatePassword();

	function onSubmit( event: any ): void {
		event.preventDefault();

		if ( !passwordRef.current.value ) {
			return;
		}

		setError( null );

		updatePassword( { newPassword: passwordRef.current.value } )
			.then( () => trackSegmentPasswordSet() )
			.catch( ( message: React.ReactNode ) => setError( message ) );
	}

	return (
		<Form
			onSubmit={onSubmit}
			trackingData={props.trackingData}
		>
			<fieldset className={styles.fieldGroup}>
				<div className={styles.field}>
					<PasswordInput
						id="subscribe-password"
						label={localize( 'Password' )}
						placeholder="Enter password"
						fieldName="password"
						inputRef={passwordRef}
						hint={localize( PASSWORD_LENGTH_ERROR )}
						autoComplete="new-password"
						trackingData={props.trackingData}
						required={true}
					/>
				</div>
			</fieldset>
			<FormActions
				submitText={props.submitText}
				loading={loading}
				error={error}
			/>
		</Form>
	);
};

export default AccountPasswordForm;
