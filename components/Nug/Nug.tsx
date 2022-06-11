import React from 'react';
import ArticlePaywall from 'components/ArticlePaywall/ArticlePaywall';
import classnames from 'classnames/bind';
import { ButtonLabel, Hed, Kicker, Tagline } from '@quartz/interface';
import ContentBlocks from 'components/ContentBlocks/ContentBlocks';
import Dateline from 'components/Dateline/Dateline';
import EmailSignup from 'components/EmailSignup/EmailSignup';
import Link from 'components/Link/Link';
import InlineMembershipPromo from 'components/InlineMembershipPromo/InlineMembershipPromo';
import { PAYWALL_HARD } from 'config/membership';
import styles from './Nug.module.scss';
import { CollectionPartsFragment } from '@quartz/content';
import { BlockPromotion } from 'helpers/data/blockPromotions';

const cx = classnames.bind( styles );

export const Nug = ( props: {
	blocks: NonNullable<CollectionPartsFragment[ 'blocks' ]>,
	lastModified?: string,
	link?: string,
	location?: string,
	postId?: number,
	promotion?: BlockPromotion,
	showPaywall?: boolean,
	title?: string,
} ) => {
	const {
		blocks,
		lastModified,
		link,
		location,
		postId,
		promotion,
		showPaywall = false,
		title,
	} = props;

	return (
		<>
			<div className={cx( 'container', { showPaywall } )}>
				<Kicker>
					<h3 className={styles.heading}>{title}</h3>
				</Kicker>
				{
					lastModified &&
						<Tagline>
							Last updated <Dateline dateGmt={lastModified} />
						</Tagline>
				}
				<ContentBlocks
					blocks={showPaywall ? blocks?.slice( 0, 4 ) : blocks}
					nugId={postId}
				/>
				{
					link &&
						<p><Link to={link}>{`Read more about ${title} →`}</Link></p>
				}
				{
					promotion?.appDownloadPromo &&
						<Link to="/app/" className={styles.appButton}>
							<Hed size="medium">
								<div className={styles.appHead}>
									📲 Download the Quartz iOS app to get a daily haiku pick-me-up.
								</div>
							</Hed>
							<ButtonLabel variant="secondary">Download our app</ButtonLabel>
						</Link>
				}
				{
					promotion?.membershipPromo &&
					<InlineMembershipPromo promoText={promotion.membershipPromo.additionalText} />
				}
				{
					promotion?.emailPromo &&
					<EmailSignup
						slugs={[ promotion.emailPromo.slug ]}
						title={promotion.emailPromo.emailTitle}
						location={location}
					/>
				}
			</div>
			{
				showPaywall &&
				postId &&
					<ArticlePaywall
						id={`coronavirus-living-briefing-${title}`}
						paywallType={PAYWALL_HARD}
					/>
			}
		</>
	);
};

export default Nug;
