import React from 'react';
import { Button } from '@quartz/interface';
import styles from './LoadMoreButton.module.scss';

export default function LoadMoreButton( props: { fetching?: boolean, hasMorePosts?: boolean, loadMore?: () => void } ) {
	if ( !props.hasMorePosts ) {
		return null;
	}

	return (
		<div className={styles.container}>
			<Button loading={props.fetching} onClick={props.loadMore}>Load more</Button>
		</div>
	);
}
