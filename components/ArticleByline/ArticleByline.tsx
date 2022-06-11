import React from 'react';
import { AuthorPartsFragment } from '@quartz/content';
import Byline from 'components/Byline/Byline';
import Dateline from 'components/Dateline/Dateline';
import DateWarning from 'components/DateWarning/DateWarning';
import styles from './ArticleByline.module.scss';

export default function ArticleByline( props: {
	authorLocation?: string | null,
	authors?: AuthorPartsFragment[],
	dateGmt?: string | null,
	modifiedGmt?: string | null,
	isBulletin?: boolean,
} ) {
	const { authorLocation, authors, dateGmt, modifiedGmt, isBulletin = false } = props;

	return (
		<div className={styles.container}>
			{
				!! authors?.length &&
				<Byline
					authors={authors}
					isBulletin={isBulletin}
				/>
			}
			<div className={styles.date}>
				{
					authorLocation &&
						<span className={styles.dotAfter}>{authorLocation}</span>
				}

				{dateGmt && (
					<>
						<Dateline className={styles.dotBefore} dateGmt={dateGmt} modifiedGmt={modifiedGmt} />
						<DateWarning className={styles.dotBefore} dateGmt={dateGmt} />
					</>
				)}
			</div>
		</div>
	);
}
