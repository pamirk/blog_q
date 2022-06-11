import React from 'react';
import { useRouter } from 'next/router';
import EmailListForm from 'components/EmailListForm/EmailListForm';
import Page, { PageLoading } from 'components/Page/Page';
import useEmailsByList from 'data/hooks/useEmailsByList';
import { getRelativeLink } from 'helpers/urls';
import NotFound from '../NotFound/NotFound';

export default function EmailList () {
	const { slug } = useRouter().query;
	const data = useEmailsByList( slug as string, [], true );

	if ( ! data.emailList ) {
		return <PageLoading />;
	}

	const { emailList, emails } = data;
	const { description, featuredImage, isPrivate, name } = emailList;
	let { link } = emailList;

	// Quartz Japan's canonical path is the Japan subscribe page, but we want to unhide
	// the Quartz Japan email page as a landing page for the email archive
	if ( 'quartz-japan' === slug ) {
		link = '/emails/quartz-japan/';
	}

	if ( isPrivate && 'quartz-japan' !== slug ) {
		return <NotFound />;
	}

	return (
		<Page
			canonicalPath={getRelativeLink( link ) || ''}
			pageDescription={description}
			pageTitle={name}
			pageType="email-list"
			socialImage={featuredImage?.sourceUrl}
		>
			<EmailListForm
				email={emails[0]}
				list={emailList}
			/>
		</Page>
	);
}
