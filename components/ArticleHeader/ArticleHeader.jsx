// noinspection JSUnresolvedVariable

import React from 'react';
import PropTypes from 'prop-types';
import styles from './ArticleHeader.module.scss';
import classnames from 'classnames/bind';
import ArticleByline from '../../components/ArticleByline/ArticleByline';
import ArticleHero from '../../components/ArticleHero/ArticleHero';
import ArticleKicker from '../../components/ArticleKicker/ArticleKicker';
import BulletinKicker from '../../components/BulletinKicker/BulletinKicker';
import { articlePropTypes } from '../../helpers/propTypes';

const cx = classnames.bind( styles );

const ArticleHeader = ( {
	authorLocation,
	authors,
	bulletin,
	dateGmt,
	featuredImage,
	featuredImageSize,
	isAmp,
	isBulletin,
	isInteractive,
	isPremium,
	isVideo,
	kicker,
	showHero,
	title,
} ) => {
	const isPortraitHero = 'portrait' === featuredImageSize;

	const showHeroImage = showHero && featuredImage;

	// use separate styling if there is no hero image and this is not an interactive or video post
	const noHero = !showHeroImage && !isInteractive && !isVideo;

	return (
		<header className={cx( 'container', {
			isInteractive,
			isPremium,
			noHero,
			portrait: isPortraitHero,
		} )}
		>
			<div className={cx( 'hed-block', {
				isInteractive,
				isPremium,
				noHero,
				portrait: isPortraitHero && !isPremium,
			} )}
			>
				{
					isBulletin
						?
						<BulletinKicker
							image={bulletin.campaign.logo}
							link={bulletin.clientTracking?.logo}
							sponsor={bulletin.sponsor.name}
						/>
						:
						<ArticleKicker kicker={kicker} />
				}
				<h1 className={cx( 'headline', { isPremium } )}>{title}</h1>
				{
					isInteractive &&
						<div className={styles.byline}>
							<ArticleByline
								authorLocation={authorLocation}
								authors={authors}
								dateGmt={dateGmt}
								isBulletin={isBulletin}
							/>
						</div>
				}
			</div>
			{
				showHeroImage &&
				<ArticleHero
					size={featuredImageSize}
					isPremium={isPremium}
					preload={!isAmp}
					{...featuredImage}
				/>
			}
		</header>
	);
};

ArticleHeader.propTypes = {
	authorLocation: articlePropTypes.authorLocation,
	authors: articlePropTypes.authors,
	bulletin: articlePropTypes.bulletin,
	dateGmt: articlePropTypes.dateGmt,
	featuredImage: articlePropTypes.featuredImage,
	featuredImageSize: articlePropTypes.featuredImageSize,
	isAmp: PropTypes.bool.isRequired,
	isBulletin: PropTypes.bool.isRequired,
	isInteractive: PropTypes.bool.isRequired,
	isPremium: PropTypes.bool.isRequired,
	isVideo: PropTypes.bool.isRequired,
	kicker: articlePropTypes.kicker,
	showHero: PropTypes.bool.isRequired,
	title: articlePropTypes.title,
};

ArticleHeader.defaultProps = {
	featuredImage: null,
	isBulletin: false,
	isInteractive: false,
	isPremium: false,
	isVideo: false,
	showHero: false,
};

export default ArticleHeader;
