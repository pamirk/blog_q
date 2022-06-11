import React from 'react';
import { PageHeader } from '@quartz/interface';
import Footer from 'components/Footer/Footer';
import Page from 'components/Page/Page';
import { SiteDirectory } from 'components/SiteMenu/SiteMenu';
import useUserRole from 'helpers/hooks/useUserRole';
import styles from './Menu.module.scss';

export default function Menu() {
	const { isMember } = useUserRole();

	return (
		<Page
			canonicalPath="/menu/"
			pageTitle="Menu"
			pageType="index"
		>
			<PageHeader title="Menu" />
			<div className={styles.content}>
				<SiteDirectory isMember={isMember} />
			</div>
			<Footer />
		</Page>
	);
}
