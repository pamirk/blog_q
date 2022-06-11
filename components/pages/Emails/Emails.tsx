import React from 'react';
import EmailsForm from 'components/EmailsForm/EmailsForm';
import Page from 'components/Page/Page';

export default function Emails () {
	return (
		<Page
			canonicalPath="/emails/"
			pageDescription="Our emails are made to shine in your inbox, with something fresh every morning, afternoon, and weekend."
			pageTitle="Emails"
			pageType="emails"
			socialTitle="Sign up for our emails"
		>
			<EmailsForm />
		</Page>
	);
}
