import React from 'react';
import FeaturedItem from 'components/FeaturedItem/FeaturedItem';
import { PageHeader } from '@quartz/interface';
import Page, { PageLoading } from 'components/Page/Page';
import useMenuItems from 'data/hooks/useMenuItems';
import styles from './Featured.module.scss';

function Featured () {
	const items = useMenuItems( 'featured_quartz', 50 );

	if ( ! items ) {
		return <PageLoading />;
	}

	return (
		<Page
			canonicalPath="/featured/"
			pageDescription="These are some of our most ambitious editorial projects. Enjoy!"
			pageTitle="Featured"
			pageType="featured"
		>
			<div className={styles.container}>
				<PageHeader
					title="Featured"
					intro="These are some of our most ambitious editorial projects. Enjoy!"
				/>
				<ul className={styles.content}>
					{
						items.map( item => <FeaturedItem {...item} key={item.id} /> )
					}
				</ul>
			</div>
		</Page>
	);
}

export default Featured;
