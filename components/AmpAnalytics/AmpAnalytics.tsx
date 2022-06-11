import React, { Fragment } from 'react';
import { ArticlePartsFragment, EditionName } from '@quartz/content';
import { getArticleDataLayer } from 'helpers/tracking/processors/gtm/universal';
import { isQzDotCom } from 'helpers/utils';

const ventDomain = isQzDotCom ? 'vent.qz.com' : 'vent.quartz.work';
const ventIcon = `https://${ventDomain}/vent.ico`;

export default function AmpAnalytics ( props: {
	article: ArticlePartsFragment,
	edition: EditionName,
} ) {
	// cant get QueryParams or AdBlocking in AMP
	const globalData = {
		event: 'PageLoad',
		PageType: 'article',
		Edition: props.edition.toLowerCase(),
	};

	// get the article data
	const articleData = getArticleDataLayer( props.article );

	const json = {
		vars: { ...globalData, ...articleData },
	};

	return (
		<Fragment>
			<amp-analytics config="https://www.googletagmanager.com/amp.json?id=GTM-W7T9HM2&gtm.url=SOURCE_URL" data-credentials="include">
				<script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify( json ) }} />
			</amp-analytics>
			<amp-pixel src={ventIcon} layout="nodisplay" />
		</Fragment>
	);
}
