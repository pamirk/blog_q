import React from 'react';
import PropTypes from 'prop-types';
import HomeLeadImage from '../../../../pages/HomeWork/components/HomeLeadImage/HomeLeadImage';
import BulletinKicker from 'components/BulletinKicker/BulletinKicker';
import { articleTeaserPropTypes } from 'helpers/propTypes';
import styles from './HomeLeadArticle.module.scss';
import classnames from 'classnames/bind';
import Link from 'components/Link/Link';

const cx = classnames.bind( styles );

const HomeLeadArticle = ( {
	article: {
		featuredImage,
		summary,
		title,
		bulletin,
		destination,
		link,
	},
	leadStory,
	topStory,
	onClick,
} ) => (
	<li className={cx( 'container', { leadStory, topStory } )}>
		<Link
			className={cx( 'link' )}
			to={destination || link}
			onClick={onClick}
			rel={bulletin ? 'nofollow' : null}
		>
			{
				featuredImage &&
				<figure className={cx( 'hero', 'work' )}>
					<HomeLeadImage
						featuredImage={featuredImage}
						topStory={topStory}
					/>
				</figure>
			}
			<div className={cx( 'content' )}>
				{
					bulletin &&
					<BulletinKicker sponsor={bulletin.sponsor.name}/>
				}
				<h2 className={cx( 'title' )}>{title}</h2>
				{
					summary &&
					<div className={cx( 'summary' )}>{summary}</div>
				}
			</div>
		</Link>
	</li>
);

HomeLeadArticle.defaultProps = {
	leadStory: false,
	topStory: false,
	onClick: () => {},
};

HomeLeadArticle.propTypes = {
	article: PropTypes.shape( articleTeaserPropTypes ).isRequired,
	leadStory: PropTypes.bool,
	onClick: PropTypes.func,
	topStory: PropTypes.bool,
};

export default HomeLeadArticle;
