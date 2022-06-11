import React, { useRef } from 'react';
import styles from './EmailForm.module.scss';
import useNotifications from 'helpers/hooks/useNotifications';
import { TextInput, Button } from '@quartz/interface';

function EmailForm () {
	const firstNameRef = useRef<HTMLInputElement>( null );
	const lastNameRef = useRef<HTMLInputElement>( null );
	const emailRef = useRef<HTMLInputElement>( null );

	const { notifySuccess } = useNotifications();

	function onSubmit( event: React.SyntheticEvent ) {
		event.preventDefault();

		const body = {
			email: emailRef.current?.value,
			list_names: [ 'the-mantle' ],
			profile: {
				first_name: firstNameRef.current?.value,
				last_name: lastNameRef.current?.value,
			},
		};

		const formPostVars = {
			method: 'POST',
			body: JSON.stringify( body ),
			headers: { 'Content-Type': 'application/json' },
		};

		return fetch( '/api/email/subscribe', formPostVars )
			.then( () => notifySuccess( 'Thanks for signing up!' ) );
	}

	return (
		<form onSubmit={onSubmit}>
			<div className={styles.field}>
				<TextInput
					inputRef={firstNameRef}
					autoComplete="given_name"
					id="firstName"
					label="First name"
					placeholder="Jane"
					required
					type="text"
				/>
			</div>

			<div className={styles.field}>
				<TextInput
					inputRef={lastNameRef}
					autoComplete="family_name"
					id="lastName"
					label="Last name"
					placeholder="Smith"
					required
					type="text"
				/>
			</div>

			<div className={styles.field}>
				<TextInput
					inputRef={emailRef}
					autoComplete="email"
					id="email"
					label="Email"
					placeholder="example@qz.com"
					required
					type="email"
				/>
			</div>

			<div className={styles.button}>
				<Button type="submit">Sign up</Button>
			</div>
		</form>
	);
}

export default EmailForm;
