import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link/Link';
import HomeLeadImage from '../../../../pages/HomeWork/components/HomeLeadImage/HomeLeadImage';
import BulletinKicker from 'components/BulletinKicker/BulletinKicker';
import { articleTeaserPropTypes } from 'helpers/propTypes';
import styles from './HomeGuideArticle.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const HomeGuideArticle = ( { article, onClick, topStory } ) => (
	<Link
		className={cx( 'container', { topStory } )}
		to={article.link}
		onClick={onClick}
		rel={article.bulletin ? 'nofollow' : null}
	>
		{
			article.featuredImage &&
			<figure className={cx( 'hero' )}>
				<HomeLeadImage
					featuredImage={article.featuredImage}
					topStory={topStory}
				/>
			</figure>
		}
		<div className={cx( 'content' )}>
			{
				article.bulletin &&
				<BulletinKicker sponsor={article.bulletin.sponsor.name}/>
			}
			<h2 className={cx( 'title' )}>{article.title}</h2>
			<div className={cx( 'summary' )}>{article.summary}</div>
		</div>
	</Link>
);

HomeGuideArticle.defaultProps = {
	onClick: () => {},
	topStory: false,
};

HomeGuideArticle.propTypes = {
	article: PropTypes.shape( articleTeaserPropTypes ).isRequired,
	onClick: PropTypes.func.isRequired,
	topStory: PropTypes.bool.isRequired,
};

export default HomeGuideArticle;
