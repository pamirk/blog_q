import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link/Link';
import Byline from 'components/Byline/Byline';
import {articleTeaserPropTypes} from 'helpers/propTypes';
import styles from './HomeContributorArticle.module.scss';

const HomeContributorArticle = ({article}) => (
    <div className={styles.container}>
        <div className={styles.header}>
            <Byline authors={article.authors} prefix=""/>
        </div>
        <div className={styles.title}>
            <Link
                className={styles.articleTitle}
                to={article.link}
            >
                {article.title}
            </Link>
        </div>
    </div>
);

HomeContributorArticle.propTypes = {
    article: PropTypes.shape(articleTeaserPropTypes).isRequired,
};

export default HomeContributorArticle;
