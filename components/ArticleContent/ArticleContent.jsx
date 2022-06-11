import React from 'react';
import PropTypes from 'prop-types';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import compose from '../../helpers/compose';
import styles from './ArticleContent.module.scss';
import classnames from 'classnames/bind';
import { BadgeGroup } from '../../@quartz/interface';
import Link from '../../components/Link/Link';
import ArticleByline from '../../components/ArticleByline/ArticleByline';
import ArticlePaywall from '../../components/ArticlePaywall/ArticlePaywall';
import ArticleContentBlocks from '../../components/ArticleContentBlocks/ArticleContentBlocks';
import withConfigurations from './helpers/withConfigurations';
import emails from '../../config/emails';
import EmailSignup, { EmailSignupContainer } from '../../components/EmailSignup/EmailSignup';

const cx = classnames.bind( styles );

export const ArticleContent = ( {
	ad,
	article,
	article: {
		authorLocation,
		authors,
		dateGmt,
		id,
		modifiedGmt,
		promotedTaxonomy,
		series,
		suppressAds,
	},
	footnoteTracker,
	isAmp,
	isBulletin,
	isGuide,
	isInApp,
	isInteractive,
	isMember,
	isPaywalled,
	isPremium,
	isSeries,
	isVideo,
	isWorkGuide,
	paywallType,
	setContentRef,
	setFootnoteRef,
} ) => (
	<div className={cx( 'container', { app: isInApp } )}>
		<div
			className={cx( 'content', {
				paywalled: !!paywallType,
				premium: isPremium,
				video: isVideo,
			} )}
			ref={el => setContentRef( el )}
		>
			<div className={cx( 'blocks', { guide: isWorkGuide } )}>
				{
					! isBulletin &&
					! isInteractive &&
					promotedTaxonomy &&
					<div className={styles.taxonomy}>
						<Link className={styles['taxonomy-link']} to={promotedTaxonomy.link}>
							<BadgeGroup
								kicker={promotedTaxonomy.kicker}
								tagline={promotedTaxonomy.shortDescription || promotedTaxonomy.subtitle}
								title={promotedTaxonomy.name}
							/>
						</Link>
					</div>
				}
				{
					! isInteractive &&
					<div className={styles.byline}>
						<ArticleByline
							authorLocation={authorLocation}
							authors={authors}
							dateGmt={dateGmt}
							modifiedGmt={modifiedGmt}
							isBulletin={isBulletin}
						/>
					</div>
				}
				<ArticleContentBlocks
					ad={ad}
					article={article}
					cx={cx}
					footnoteTracker={footnoteTracker}
					isAmp={false}
					isGuide={isGuide}
					isPaywalled={false}
					isPremium={false}
					isSeries={isSeries}
					isWorkGuide={isWorkGuide}
					paywallType={paywallType}
					series={series}
					setFootnoteRef={setFootnoteRef}
					suppressAds={suppressAds}
				/>
			{/*	{
					!isAmp && !paywallType && !isPremium && !isMember &&
						<EmailSignupContainer>
							<EmailSignup
								location="Article"
								slugs={[ 'daily-brief' ]}
								title={
									<>
										📬 {emails['daily-brief'].title}
									</>
								}
							/>
						</EmailSignupContainer>
				}*/}
			</div>
		</div>
		{/*{
			paywallType &&
			<ArticlePaywall
				id={id}
				paywallType={paywallType}
			/>
		}*/}
	</div>
);

ArticleContent.propTypes = {
	ad: articlePropTypes.ad,
	article: PropTypes.shape( articlePropTypes ).isRequired,
	footnoteTracker: PropTypes.arrayOf( PropTypes.bool ),
	isAmp: PropTypes.bool.isRequired,
	isBulletin: PropTypes.bool.isRequired,
	isGuide: PropTypes.bool.isRequired,
	isInApp: PropTypes.bool.isRequired,
	isInteractive: PropTypes.bool.isRequired,
	isMember: PropTypes.bool.isRequired,
	isPaywalled: PropTypes.bool.isRequired,
	isPremium: PropTypes.bool.isRequired,
	isSeries: PropTypes.bool.isRequired,
	isVideo: PropTypes.bool.isRequired,
	isWorkGuide: PropTypes.bool.isRequired,
	paywallType: PropTypes.string,
	setContentRef: PropTypes.func,
	setFootnoteRef: PropTypes.func,
};

export default compose(
	withConfigurations
)( ArticleContent );
