import React from 'react';
import BillingExplainer from 'components/BillingExplainer/BillingExplainer';
import Disclaimer from 'components/Disclaimer/Disclaimer';
import Link from 'components/Link/Link';
import SignupHints from 'components/SignupHints/SignupHints';
import { JAPAN_SIGNUP_INTENT } from 'config/users';
import styles from './PlanSelectFormFooter.module.scss';

export default function PlanSelectFormFooter ( props: { freeTrialLength: number, intent?: string, selectedPlan, showGiftWording: boolean } ) {
	if ( props.showGiftWording ) {
		return (
			<Disclaimer>
				<p>
					By redeeming this gift, you agree to the <Link to="/about/terms-conditions/">Terms and Conditions</Link> and <Link to="/about/privacy-policy/">Privacy Policy</Link>.
				</p>
			</Disclaimer>
		);
	}

	return (
		<div className={styles.footer}>
			<div className={styles.billingCopy}>
				<BillingExplainer
					selectedPlan={props.selectedPlan}
					product={props.intent === JAPAN_SIGNUP_INTENT ? 'membership-jp' : 'membership-us'}
					freeTrialLength={props.freeTrialLength}
				/>
			</div>
			{
				props.intent !== JAPAN_SIGNUP_INTENT &&
					<SignupHints
						align="center"
						showLogin={false}
						showQuartzJapanLink={true}
					/>
			}
		</div>
	);
}
