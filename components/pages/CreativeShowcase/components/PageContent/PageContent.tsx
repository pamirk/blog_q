import React, { ReactNode } from 'react';
import styles from './PageContent.module.scss';
import { Spinner } from '@quartz/interface';

export default function PageContent( props: {
	children: ReactNode,
	loading: boolean,
} ) {
	if ( props.loading ) {
		return (
			<div className={styles.spinner}>
				<Spinner />
			</div>
		);
	}

	return (
		<div className={styles.container}>{props.children}</div>
	);
}
