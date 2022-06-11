import React, { Fragment } from 'react';
import Link from '../../components/Link/Link';
import styles from './PromoFormHeader.module.scss';
import classnames from 'classnames/bind';
import { freeTrialLength, SUBSCRIBE_EMAIL_STEP } from '../../config/membership';

const cx = classnames.bind( styles );

const PromoFormHeader = () => (
	<div className={cx( 'container' )}>
		<h1 className={cx( 'title' )}>Become a <Link to={SUBSCRIBE_EMAIL_STEP}>member</Link> and turn change into your competitive advantage</h1>

		<ul className={cx( 'promo-blocks' )}>
			<li className={cx( 'promo-block' )}>
				<h3 className={cx( 'promo-title' )}>What do members receive?</h3>
				<p className={cx( 'promo-description' )}>
					As a <Link to={SUBSCRIBE_EMAIL_STEP}>member</Link>, you’ll receive weekly field guides, profiles and Q&As, direct access to the Quartz community and journalists, and more.

				</p>
			</li>

			<li className={cx( 'promo-block' )}>
				<h3 className={cx( 'promo-title' )}>What type of stories will I get?</h3>
				<p className={cx( 'promo-description' )}>
					Each day you’ll receive exclusive content curated by our experts, designed for you to master your understanding of the global economy. Take a <Link to="/guides/">sneak peak</Link>.

				</p>
			</li>

			<li className={cx( 'promo-block' )}>
				<h3 className={cx( 'promo-title' )}>Anything else?</h3>
				<p className={cx( 'promo-description' )}>
					Enjoy a <Fragment>{freeTrialLength}</Fragment>-day free trial, on us. Feel free to <Link to="/contact/">contact</Link> us with any additional questions you have.
				</p>
			</li>
		</ul>
	</div>
);

export default PromoFormHeader;
