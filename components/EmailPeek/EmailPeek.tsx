import React from 'react';
import Link from 'components/Link/Link';
import EmailListFeaturedImage from 'components/EmailListFeaturedImage/EmailListFeaturedImage';
import EmailListPreview from 'components/EmailListPreview/EmailListPreview';
import getLocalization from 'helpers/localization';

import styles from './EmailPeek.module.scss';

const dictionary = {
	ja: {
		'Tap here to preview': 'タップしてサンプルを見る',
		'Scroll over image to preview': 'スクロールしてサンプルを見る',
	},
};

const EmailPeek = (
	props: {
		email: { emailId?: number | null, dateGmt?: string | null, html?: string | null, title?: string | null },
		featuredImage: { sourceUrl: string, altText: string },
		language?: string,
		name: string,
		slug: string,
	}
) => {
	const localize = getLocalization( { dictionary, language: props.language || 'en' } );
	return (
		<div className={styles.container}>
			<div className={styles.tapHere}>
				<Link to={`/emails/${props.slug}/${props.email.emailId}/`}>
					{localize( 'Tap here to preview' )}
				</Link>
			</div>
			<div className={styles.staticPreview}>
				<Link to={`/emails/${props.slug}/${props.email.emailId}/`}>
					<EmailListFeaturedImage image={props.featuredImage} />
				</Link>
			</div>
			<div className={styles.scrollablePreview}>
				<EmailListPreview email={props.email} name={props.name} />
				<div className={styles.scrollToPreview}>
					{localize( 'Scroll over image to preview' )}
				</div>
			</div>
		</div>
	);
};

export default EmailPeek;
