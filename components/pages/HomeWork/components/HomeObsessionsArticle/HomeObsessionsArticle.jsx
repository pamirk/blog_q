import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link/Link';
import { articleTeaserPropTypes } from 'helpers/propTypes';
import styles from './HomeObsessionsArticle.module.scss';

const HomeObsessionsArticle = ( { article, obsession } ) => (
	<div className={styles.container}>
		<Link
			className={styles.kicker}
			to={`/on/${obsession.slug}`}
		>
			{obsession.name}
		</Link>
		<Link
			className={styles.article}
			to={article.link}
		>
			<h2 className={styles.title}>{article.title}</h2>
			<div className={styles.summary}>{article.summary}</div>
		</Link>
	</div>
);

HomeObsessionsArticle.propTypes = {
	article: PropTypes.shape( articleTeaserPropTypes ).isRequired,
	obsession: PropTypes.shape( {
		name: PropTypes.string,
		slug: PropTypes.string,
	} ).isRequired,
};

export default HomeObsessionsArticle;
