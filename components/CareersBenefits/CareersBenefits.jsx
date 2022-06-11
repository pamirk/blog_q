import React, { Fragment } from 'react';
import classnames from 'classnames/bind';
import styles from './CareersBenefits.module.scss';

const cx = classnames.bind( styles );

const CareersBenefits = () => (
	<Fragment>
		<h4 className={cx( 'title' )}>Our benefits include</h4>
		<ul className={cx( 'list' )}>
			<li>Unlimited vacation time</li>
			<li>16 weeks of parental leave for all new parents</li>
			<li>Commuter Pre-Tax programs</li>
			<li>401(k) with employer match</li>
			<li>Flexible Spending Accounts for medical and dependent care</li>
			<li>Short- and long-term disability plans</li>
			<li>Life insurance</li>
			<li>Multiple health insurance plans</li>
			<li>Prescription drug coverage</li>
			<li>Dental and vision insurance</li>
			<li>Coverage for domestic partners and dependents</li>
		</ul>
	</Fragment>
);

export default CareersBenefits;
