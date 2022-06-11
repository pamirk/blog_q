import React from 'react';
import PropTypes from 'prop-types';
import compose from '../../helpers/compose';
import styles from './SubscribeBar.module.scss';
import classnames from 'classnames/bind';
import { SubscribeBarLink } from '../../components/AccountLink/AccountLink';
import BottomBar from '../../components/BottomBar/BottomBar';
import {
	withAmp,
	withQueryParamData,
} from '../../helpers/wrappers';
import { offerCode, offerCodeDiscount } from '../../config/membership';

const cx = classnames.bind( styles );

// NOTE: the leading and trailing spaces around text are intentional in order
// to separate the sentences.

export const copyVariants = {
	1: `Get ${offerCodeDiscount} off 1 year with code: ${offerCode}`,
	2: `${offerCode}: One year for $5 a month`,
};

export const SubscribeBarContent = ( { children } ) => (
	<BottomBar dismissible={true} visible={true}>
		<SubscribeBarLink
			trackingContext="metered paywall" // matching case of ArticlePaywall
		>
			{children}
			<span className={cx( 'cta-text' )}>See my options</span>
		</SubscribeBarLink>
	</BottomBar>
);

SubscribeBarContent.propTypes = {
	children: PropTypes.node.isRequired,
};

export const SubscribeBar = ( {
	showSubscribeBarPromotion,
	subscribeBarPromotionCopyVariant,
} ) => {
	if ( showSubscribeBarPromotion && copyVariants[subscribeBarPromotionCopyVariant] ) {
		return (
			<SubscribeBarContent>
				{copyVariants[subscribeBarPromotionCopyVariant]}
			</SubscribeBarContent>
		);
	}

	return null;
};

SubscribeBar.propTypes = {
	showSubscribeBarPromotion: PropTypes.bool.isRequired,
	subscribeBarPromotionCopyVariant: PropTypes.number,
};

export default compose(
	withAmp(), // AMP? No SubscribeBar for you!
	withQueryParamData()
)( SubscribeBar );
