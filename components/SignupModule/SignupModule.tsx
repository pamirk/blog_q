import React, { Fragment } from 'react';
import emails from 'config/emails';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import MembershipCTA from 'components/MembershipCTA/MembershipCTA';
import styles from './SignupModule.module.scss';

export function getTitle ( slug: string, name: string ) {
	let titleFragment = `Sign up for the ${name}`;

	if ( emails[slug]?.title ) {
		titleFragment = emails[slug].title;
	}

	// default
	return <Fragment>{`📬 ${titleFragment}`}</Fragment>;
}

export default function SignupModule ( props: {
	isLoggedIn: boolean,
	isMember: boolean,
	isPrivate: boolean,
	isQuartzJapan: boolean,
	name: string,
	slug: string,
} ) {
	if ( props.isQuartzJapan && ! props.isMember ) {
		return (
			<MembershipCTA
				isLoggedIn={props.isLoggedIn}
				language="ja"
				trackingContext="email"
				type="paid"
			/>
		);
	}

	if ( props.isPrivate || props.isMember ) {
		return null;
	}

	return (
		<div className={styles.container}>
			<EmailSignup
				title={getTitle( props.slug, props.name )}
				slugs={[ props.slug ]}
				location="email-webview"
			/>
		</div>
	);
}
