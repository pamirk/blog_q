import React, { Fragment } from 'react';
import Link from '../../components/Link/Link';
import PropTypes from 'prop-types';
import styles from './BillingExplainer.module.scss';

const BillingExplainer = ( { freeTrialLength, product, selectedPlan: { price, renewalPrice, interval } } ) => {
	switch ( product ) {
		case 'membership-jp':
			const trialLanguage1Ja = freeTrialLength
				? `無料体験期間は${freeTrialLength}日間。その後、${price}円の${interval}額プランへと自動的に移行されます。`
				: `初${interval}の会費は${price}円、`;

			const trialLanguage2Ja = freeTrialLength
				? '無料体験に申し込むことで、'
				: '本ページでの申し込みをもって購読がスタートし、';

			return (
				<Fragment>
					<p className={styles.disclaimer}>{trialLanguage1Ja}お支払い後5日以内であれば返金が可能です。なお、お客様の登録は毎{interval}自動更新されます。</p>
					<p className={styles.disclaimer}>{trialLanguage2Ja}<Link to="/japan/about/terms-conditions/">利用規約</Link>と<Link to="/japan/about/privacy-policy/">プライバシーポリシー</Link>に同意したことになります。登録は自動的に更新されますが、いつでも解約することができます。</p>
					<p className={styles.disclaimer}><Link to="/japan/about/act-on-specified-commercial-transactions/">特定商取引法に基づく表記</Link></p>
				</Fragment>
			);

		case 'membership-us':
			const freeTrialLanguage = freeTrialLength
				? `Your free trial will last ${freeTrialLength} days. If you do not cancel during the ${freeTrialLength}-day free trial, we’ll charge you ${price} for your first ${interval} of membership.`
				: `We’ll charge you ${price} for your first ${interval} of membership.`;

			return (
				<Fragment>
					<p className={styles.disclaimer}>{freeTrialLanguage} Refund requests within five days of payment will be honored. Your subscription will auto-renew each {interval} after your first {interval} at {renewalPrice ? renewalPrice : price} until you cancel.</p>
					<p className={styles.disclaimer}>By supporting our journalism, you agree to the <Link to="/about/terms-conditions/">Terms and Conditions</Link> and <Link to="/about/privacy-policy/">Privacy Policy</Link>. Subscriptions will renew automatically. Learn more about our payment policies <Link to="https://help.qz.com/en/articles/4516254-quartz-payment-terms">here</Link>. Members will also receive the complimentary <Link to="/emails/daily-brief/">Quartz Daily Brief</Link> email.</p>
					<ul className={styles.perks}>
						<li className={styles.disclaimer}>
							🎁 Gift Quartz: Show your friends and family you have great taste. <Link to="/gift/">Learn</Link> about our various gift offers.
						</li>
						<li className={styles.disclaimer}>
							💼 Corporate or group: Keep your team smarter and informed. <Link to="mailto:support@qz.com">Email</Link> us for our business subscription rates.
						</li>
						<li className={styles.disclaimer}>
							🎓 Academic: Recommended reading for the classroom. <Link to="mailto:support@qz.com">Email</Link> us for our special discount rates.
						</li>
					</ul>
				</Fragment>
			);

		default:
			return null;
	}
};

BillingExplainer.propTypes = {
	freeTrialLength: PropTypes.number,
	product: PropTypes.string.isRequired,
	selectedPlan: PropTypes.object.isRequired,
};

BillingExplainer.defaultProps = {
	selectedPlan: {},
};

export default BillingExplainer;
