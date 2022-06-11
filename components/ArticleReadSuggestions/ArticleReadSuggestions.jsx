import React from 'react';
import PropTypes from 'prop-types';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import { ArticleGuideTOC, ArticleSeriesTOC } from '../ArticleTOC/ArticleTOC';
import styles from './ArticleReadSuggestions.module.scss';

export const ArticleReadSuggestions = ( {
	guide,
	hasTOC,
	isGuide,
	isSeries,
	postId,
	series,
} ) => {
	if ( hasTOC && isGuide ) {
		return (
			<div className={styles.container}>
				<ArticleGuideTOC
					postId={postId}
					slug={guide.slug}
				/>
			</div>
		);
	}

	if ( hasTOC && isSeries ) {
		return (
			<div className={styles.container}>
				<ArticleSeriesTOC
					postId={postId}
					slug={series.slug}
				/>
			</div>
		);
	}

	return null;
};

ArticleReadSuggestions.propTypes = {
	guide: articlePropTypes.guide,
	hasTOC: PropTypes.bool.isRequired,
	isGuide: PropTypes.bool.isRequired,
	isSeries: PropTypes.bool.isRequired,
	postId: articlePropTypes.postId,
	series: articlePropTypes.series,
};

export default ArticleReadSuggestions;
