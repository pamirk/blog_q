import React from 'react';
import { Kicker } from '@quartz/interface';
import styles from './ArticleKicker.module.scss';

export default function ArticleKicker ( props: {
	kicker: string,
} ) {
	if ( props.kicker ) {
		return (
			<Kicker>
				<div
					dangerouslySetInnerHTML={{ __html: props.kicker }}
					className={styles.container}
				/>
			</Kicker>
		);
	}

	return null;
}
