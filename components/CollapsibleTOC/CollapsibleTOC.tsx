import React from 'react';
import TOC from 'components/TOC/TOC';
import styles from './CollapsibleTOC.module.scss';

function BriefingTOC( props: { contents: [ { id: string, link: string, title: string } ] } ) {
	return (
		<details className={styles.tocSection}>
			<summary className={styles.summary} />
			<TOC contents={props.contents} isDetails />
		</details>
	);
}

export default BriefingTOC;
