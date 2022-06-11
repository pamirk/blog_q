import React from 'react';
import styles from './ExploreCarousel.module.scss';
import PageSectionFooter from 'components/Page/PageSectionFooter/PageSectionFooter';
import { Hed } from '@quartz/interface';

// ExploreCarousel wrapper - expected to be used with reused FeatureSection component as children
export default function ExploreCarousel ( props: {
	children: React.ReactNode,
	name: string,
	link: string,
	moreText?: string,
} ) {
	const {
		children,
		link,
		moreText = 'More stories',
		name,
	} = props;

	return (
		<section className={styles.container}>
			<div className={styles.bound}>
				<Hed size="large">
					<h2 className={styles.heading}>{name}</h2>
				</Hed>
				{children}
				<PageSectionFooter url={link} text={moreText} />
			</div>
		</section>
	);
}
