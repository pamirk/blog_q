import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import compose from '../../../helpers/compose';
import styles from './MembershipCancelationForm.module.scss';
import Link from '../../Link/Link';
import { ButtonLabel } from '../../../@quartz/interface';
import FeedbackForm from './components/FeedbackForm/FeedbackForm';
import { withUserApi, withVisibilityTracking } from '../../../helpers/wrappers';
import { SUBSCRIPTION_WILL_CANCEL, PLAN_DISCOUNTED_DISPLAY_PRICE } from '../../../helpers/types/account';
import { makeTrackingAction } from './tracking';
import OfferStep from './components/OfferStep/OfferStep';
import Image from '../../Image/Image';
import usePageVariant from '../../../helpers/hooks/usePageVariant';
import getLocalization from '../../../helpers/localization';

import { DECLINE_TO_ANSWER } from './config';

const cx = classnames.bind( styles );

const dictionary = {
	ja: {
		'Before you go ...': '退会理由をお聞かせ下さい',
		'We’re looking to improve our membership experience and your feedback is valuable to us. Have any questions about your membership? Feel free to reach out at ': 'Quartz Japanのサービス向上のため、以下のアンケートにご協力いただけますと幸いです。また、ご質問やご要望などございましたら、お気軽に ',
		' if you need support.': ' までご連絡下さい。',
		'*high five* We’re so glad you’re remaining a Quartz member!': '*high five* ありがとうございます。引き続き、Quartz Japanをお楽しみ下さい！',
		'We’re always trying to get better, and appreciate the second chance.': 'ご購読を継続いただきありがとうございます。Quartz Japanでは引き続きサービス向上に努めてまいります。',
		'Take me to qz.com': 'トップページに移動する',
		'We’re sorry you’re leaving and hope you’ll consider becoming a Quartz member again in the future.': 'また機会がございましたら、ぜひQuartz Japanでお待ちしています。',
		'We’ve cancelled your membership. You will continue to have access to your membership until the end of your current billing cycle.': 'キャンセル手続きが完了しました。なお、購読期間終了までは、Quartzのすべてのコンテンツをご利用いただけます。',
	},
};

export const MembershipCancelationForm = ( { getUserSetting } ) => {

	const [ feedbackSubmitted, setFeedbackSubmitted ] = useState( null );
	const { language } = usePageVariant();
	const localize = getLocalization( { dictionary, language } );

	// First step: ask for feedback! We'll send this to tracking,
	// but also use it to personalize their discount offer.
	if ( !feedbackSubmitted ) {
		return (
			<div className={cx( 'container' )}>
				<h1 className={cx( 'title' )}>{localize( 'Before you go ...' )}</h1>
				<p className={cx( 'description' )}>{localize( 'We’re looking to improve our membership experience and your feedback is valuable to us. Have any questions about your membership? Feel free to reach out at ' )}<Link to="mailto:members@qz.com">members@qz.com</Link>{localize( ' if you need support.' )}</p>
				<FeedbackForm
					onSubmit={setFeedbackSubmitted}
					onCancel={()=> setFeedbackSubmitted( DECLINE_TO_ANSWER )}
				/>
			</div>
		);
	}

	// Potential last step: user accepted the discount
	if ( getUserSetting( PLAN_DISCOUNTED_DISPLAY_PRICE ) ) {
		return (
			<div className={cx( 'container' )}>
				<h1 className={cx( 'title' )}>{localize( '*high five* We’re so glad you’re remaining a Quartz member!' )}</h1>
				<p className={cx( 'description' )}> {localize( 'We’re always trying to get better, and appreciate the second chance.' )}</p>
				<div className={cx( 'meme-container' )}>
					<Image
						alt="GIF of nodding bearded man"
						className={cx( 'meme' )}
						src="https://cms.qz.com/wp-content/uploads/2020/07/200-1.gif"
						height={200}
						width={484}
					/>
				</div>

				<div className={cx( 'buttons' )}>
					<Link to="/">
						<ButtonLabel>{localize( 'Take me to qz.com' )}</ButtonLabel>
					</Link>
				</div>
			</div>
		);
	}

	// Other potential last step: user accepted cancelation
	if ( getUserSetting( SUBSCRIPTION_WILL_CANCEL ) ) {
		return (
			<div className={cx( 'container' )}>
				<h1 className={cx( 'title' )}>{localize( 'We’re sorry you’re leaving and hope you’ll consider becoming a Quartz member again in the future.' )}</h1>
				<p className={cx( 'description' )}>{localize( 'We’ve cancelled your membership. You will continue to have access to your membership until the end of your current billing cycle.' )}</p>
				<div className={cx( 'buttons' )}>
					<Link to="/">
						<ButtonLabel to="/">{localize( 'Take me to qz.com' )}</ButtonLabel>
					</Link>
				</div>
			</div>
		);
	}

	// Second step: Make the member a customized offer as an alternative
	// to canceling.
	return (
		<OfferStep
			feedbackReason={feedbackSubmitted}
		/>
	);
};

const onMount = makeTrackingAction( { eventAction: 'View cancelation discount form' } );

MembershipCancelationForm.propTypes = {
	getUserSetting: PropTypes.func,
};

export default compose(
	withVisibilityTracking( { onMount } ),
	withUserApi( { useSettings: true } )
)( MembershipCancelationForm );
