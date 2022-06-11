import React from 'react';
import styles from './SearchResults.module.scss';

export default function NoResults() {
	return (
		<div className={styles.noResults}>
			<span className={styles.emoji}>
				😳
			</span>
			No results found
		</div>
	);
}
