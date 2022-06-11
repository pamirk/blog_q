import React from 'react';
import PropTypes from 'prop-types';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import { Helmet } from 'react-helmet-async';
import getMeta from '../../config/meta';
import { isAmpSafe } from '../../helpers/amp';
import { parseDateGmt } from '../../helpers/dates';

export const ArticleMeta = ( { article, isAmp } ) => {
	let ampHtml;
	let twitterCreator;

	const {
		authors,
		dateGmt,
		edition,
		keywords,
		link,
		paywalled,
	} = article;

	const { title: siteName, twitterName: siteTwitter = 'qz' } = getMeta( edition.slug );

	if ( authors.length === 1 && authors[0].twitter ) {
		// Users enter full twitter URLs in their profiles. Extracting just the username.
		const twitterName = authors[0].twitter.split( '/' ).pop();
		twitterCreator = <meta name="twitter:creator" content={`@${twitterName}`} />;
	}

	// Making a single string out of author names.
	const authorNames = authors.reduce( ( val, author ) => `${val}, ${author.name}`, '' ).slice( 2 );

	// amphtml meta tag
	if ( ! isAmp && isAmpSafe( article ) ) {
		ampHtml = <link rel="amphtml" href={`${link}amp/`}/>;
	}

	return (
		<Helmet>
			{
				paywalled &&
					<meta name="robots" content="noarchive" />
			}
			<meta name="news_keywords" content={keywords} />
			<meta property="article:publisher" content="https://www.facebook.com/quartznews" />
			<meta name="author" content={authorNames} />
			<meta property="og:type" content="article" />
			<meta property="og:url" content={link} />
			<meta property="og:site_name" content={siteName}/>
			{twitterCreator}
			<meta name="twitter:site" content={`@${siteTwitter}`}/>
			<meta name="twitter:url" content={link}/>
			<meta name="cXenseParse:pageclass" content="article"/>
			<meta name="cXenseParse:author" content={authorNames}/>
			<meta name="cXenseParse:recs:publishtime" content={parseDateGmt( dateGmt ).toISOString()}/>
			{ampHtml}
		</Helmet>
	);
};

ArticleMeta.propTypes = {
	article: PropTypes.shape( articlePropTypes ).isRequired,
	isAmp: PropTypes.bool.isRequired,
};

export default ArticleMeta;
