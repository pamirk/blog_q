import React, { useState } from 'react';
import FormActions from 'components/FormActions/FormActions';
import FormHeader from 'components/Forms/FormHeader/FormHeader';
import PlanSelect from 'components/PlanSelect/PlanSelect';
import { PLAN_ID } from 'helpers/types/account';
import { allPlans } from 'config/membership';
import styles from './ChangePlanForm.module.scss';
import classnames from 'classnames/bind';
import { getPlanDataByCountryCode } from 'helpers/plans';
import useUserSettings from 'helpers/hooks/useUserSettings';
import usePlanChange from 'helpers/hooks/usePlanChange';
import usePlanChangePreview from 'helpers/hooks/usePlanChangePreview';
import { getPlanOptions } from 'helpers/wrappers/withUserApi/planOptions';
import { useTrackingOnMount } from 'helpers/hooks/useTracking';
import { trackFormView } from 'helpers/tracking/actions';

const cx = classnames.bind( styles );

const formattedMoney = ( amount: number, symbol: string ): string => {
	if ( symbol === '$' ) {
		return `${symbol}${( Math.abs( amount ) / 100 ).toFixed( 2 )}`;
	}

	return `${symbol}${amount}`;
};

function getPlanChangeOptions ( currentPlanId: number ) {
	const { countryCode, yearly: currentPlanIsYearly } = allPlans[ currentPlanId ];
	const { defaultPlanId, monthlyPlanId } = getPlanDataByCountryCode( countryCode, countryCode );

	const planOptions = getPlanOptions();
	// Classify both the options and the user's current plan in terms of "monthly"
	// and "yearly", to account for deprecated plans.
	const findPlanOptionById = ( id: number ) => planOptions.find( plan => `${id}` === plan.value );
	const monthly = findPlanOptionById( monthlyPlanId );
	const yearly = findPlanOptionById( defaultPlanId );

	if ( currentPlanIsYearly ) {
		return {
			options: [ { ...yearly, bannerText: 'Current plan' }, monthly ],
		};
	}

	return {
		options: [ { ...yearly, bannerText: null }, { ...monthly, bannerText: 'Current plan' } ],
	};
}

const ChangePlanForm = ( props: {
	handleClose: () => void,
	trackingData: { context: string },
} ): React.ReactNode => {
	// Start by getting the user's current plan id.
	const { getUserSetting } = useUserSettings();
	const currentPlanId = getUserSetting( PLAN_ID  );
	useTrackingOnMount( trackFormView, { ...props.trackingData, planId: currentPlanId } );

	const [ value, setValue ] = useState( `${currentPlanId}` );

	// Get the country code that corresponds to the user's current plan.
	const { countryCode, yearly: currentPlanIsYearly, monthly: currentPlanIsMonthly } = allPlans[ currentPlanId ];

	// Use the country code to retrieve that region's plan ids and currency symbol.
	// Plans can only be changed within their region: India to India, US to US, etc.
	const { defaultPlanId, monthlyPlanId, symbol } = getPlanDataByCountryCode( countryCode, countryCode );

	const newPlanId = currentPlanIsYearly ? defaultPlanId : monthlyPlanId;

	const planChangePreview = usePlanChangePreview( newPlanId );

	const {
		type: newPlanType,
		price: newPlanPrice,
		monthly: newPlanIsMonthly,
		yearly: newPlanIsYearly,
	} = allPlans[ value ];

	const planCredit = planChangePreview?.items.find( item => item.amount < 0 );
	const formattedCredit = formattedMoney( planCredit?.amount ?? 0, symbol );

	const canSubmit = planChangePreview && ( currentPlanIsYearly && newPlanIsMonthly || currentPlanIsMonthly && newPlanIsYearly );

	const { updatePlan, loading, error } = usePlanChange();
	const { options } = getPlanChangeOptions( currentPlanId );

	function onSubmit( event ) {
		event.preventDefault();

		updatePlan( value ).then( () => props.handleClose() );
	}

	return (
		<form className={styles.container} onSubmit={onSubmit}>
			<FormHeader title="Update plan" />
			<div className="plan-select">
				<PlanSelect
					options={options}
					handleChange={setValue}
					value={value}
					id="plan-select"
				/>
			</div>

			<div className={cx( 'form-actions' )}>
				<FormActions
					error={error}
					submitText="Update plan"
					cancelText="Go back"
					loading={loading}
					disabled={!canSubmit}
					onCancel={props.handleClose}
				/>
			</div>

			{
				planChangePreview &&
				<p className={cx( 'billing-copy' )}>
					If you switch to the {newPlanType} plan, you will be credited the prorated amount for this billing period ({formattedCredit}), and will be charged {newPlanPrice} to begin your new {newPlanType} plan.
				</p>
			}
		</form>
	);
};

export default ChangePlanForm;
