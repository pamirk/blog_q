import React from 'react';
import { Constrain } from '@quartz/interface';
import styles from './PageContent.module.scss';

export default function PageContent ( props: {
	html: string,
} ) {
	return (
		<Constrain size="medium">
			<div
				className={styles.container}
				dangerouslySetInnerHTML={{ __html: props.html }}
			/>
		</Constrain>
	);
}
