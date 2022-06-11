import React, { Fragment } from 'react';
import EmojiList from 'components/EmojiList/EmojiList';
import classnames from 'classnames/bind';
import SubscribeCTAs from 'components/SubscribeCTAs/SubscribeCTAs';
import styles from './MembershipCTA.module.scss';
import getLocalization from 'helpers/localization';
import { offerCodeCtaText, SUBSCRIBE_EMAIL_STEP } from 'config/membership';

const cx = classnames.bind( styles );

export const MembershipHeader = ( props: { description: JSX.Element | string, title: string } ) => (
	<Fragment>
		<h2 className={cx( 'title' )}>{props.title}</h2>
		<p className={cx( 'description' )}>{props.description}</p>
	</Fragment>
);

const MembershipText = ( props: { type: string } ) => {
	if ( 'paid' === props.type ) {
		// currently quartz-japan is our only paid type of email
		// we may want to use localize to translate once there are more types of paid emails
		return (
			<MembershipHeader
				description={
					<Fragment>
						米国発の経済メディア「Quartz」の日本版では、いまビジネスパーソンが知るべき最新グローバルニュースを平日毎日、メールボックスにお届けしています。
						<EmojiList bullets={[ '📬', '✍️', '🔓' ]}>
							<li className={styles.listItem}>毎朝グローバルニュースが届く・読む新習慣</li>
							<li className={styles.listItem}>夕方・週末は世界のビジネストレンドを深堀り</li>
							<li className={styles.listItem}>英語版を含むウェブ上の全記事が読み放題</li>
						</EmojiList>
					</Fragment>
				}
				title="こちらはQuartz Japan会員限定の有料ニュースレターコンテンツです"
			/>
		);
	}

	return (
		<MembershipHeader
			description="Your membership supports a team of global Quartz journalists reporting on the forces shaping our world. We make sense of accelerating change and help you get ahead of it with business news for the next era, not just the next hour. Subscribe to Quartz today."
			title="Enrich your perspective. Embolden your work. Become a Quartz member."
		/>
	);
};

const dictionary = {
	ja: {
		'Log in': 'ログインして読む',
		[ offerCodeCtaText ]: '7日間無料で体験する',
	},
};

const MembershipCTA = ( props: {
	isLoggedIn: boolean,
	language?: string,
	showText?: boolean,
	trackingContext: string,
	type: string,
} ) => {
	const {
		isLoggedIn,
		language = 'en',
		showText = true,
		trackingContext,
		type,
	} = props;
	const localize = getLocalization( { dictionary, language } );
	return (
		<div></div>
		/*<div className={cx( 'container', type, { unpadded: !showText } )}>
			{showText && <MembershipText type={type} />}
			<div className={cx( 'cta-container', { left: !showText } )}>
				<SubscribeCTAs
					isLoggedIn={isLoggedIn}
					loginLabel={localize( 'Log in' )}
					subscribeLabel={localize( offerCodeCtaText )}
					subscribeUrl={language === 'ja' ? '/japan/subscribe/email/' : SUBSCRIBE_EMAIL_STEP}
					trackingContext={trackingContext}
					style="guide-cta"
				/>
			</div>
		</div>*/
	);
};

export default MembershipCTA;
