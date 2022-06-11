import React from 'react';
import styles from './EmailListPreview.module.scss';
import Iframe from 'components/Iframe/Iframe';
import { formatDate } from 'helpers/dates';

export default function EmailListPreview (
	props: {
		email: {
			dateGmt?: string | null;
			html?: string | null;
			title?: string | null;
		};
		name?: string | null;
	}
) {
	return (
		<div className={styles.phonePreview}>
			<div className={styles.phoneContents}>
				<Iframe
					srcDoc={props.email.html}
					scrolling="auto"
					title={`${props.email.title} - a preview of the ${props.name} email from ${formatDate( props.email.dateGmt ?? '', { human: false } )}`}
				/>
			</div>
		</div>
	);
}
