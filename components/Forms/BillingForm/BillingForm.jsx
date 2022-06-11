import React, { useRef, useState } from 'react';
import CreditCard from '../../CreditCard/CreditCard';
import FormActions from '../../FormActions/FormActions';
import FormHeader from '../FormHeader/FormHeader';
import Form from '../../Form/Form';
import { stripeClientKey, allPlans } from '../../../config/membership';
import styles from '../Forms.module.scss';
import { PLAN_ID } from '../../../helpers/types/account';
import useJCBCardError from '../../../helpers/hooks/useJCBCardError';
import useUserSettings from '../../../helpers/hooks/useUserSettings';
import useNotifications from '../../../helpers/hooks/useNotifications';
import useChangeCard from '../../../helpers/hooks/useChangeCard';
import useTracking from '../../../helpers/hooks/useTracking';
import { trackMembershipBillingUpdateSuccess } from '../../../helpers/tracking/actions';
import useModal from '../../../helpers/hooks/useModal';

const BillingForm = () => {
	const { hideModal } = useModal();
	const { notifySuccess } = useNotifications();
	const { getUserSetting } = useUserSettings();
	const planId = getUserSetting( PLAN_ID );

	const { loading, changeCard } = useChangeCard();
	const [ error, setError ] = useState( null );

	const trackSuccess = useTracking( trackMembershipBillingUpdateSuccess, { context: 'settings' } );

	// Initial Stripe token getter which will be overridden by CreditCard
	// component via handleStripeReady prop, which is passed down.
	const getStripeTokenRef = useRef( () => Promise.reject( new Error( 'Credit card form is not ready.' ) ) );

	function handleStripeReady( tokenGetter ) {
		getStripeTokenRef.current = tokenGetter;
	}

	function onSubmit( event ) {
		event.preventDefault();

		getStripeTokenRef.current()
			.then( tokenObject => changeCard( { tokenObject } ) )
			.then( () => {
				trackSuccess();
				hideModal();
				notifySuccess( 'Your saved card was successfully updated.' );
			} )
			.catch( ( error ) => {
				setError( error.message );
			} );
	}

	const { countryCode } = allPlans[ planId ] || {};

	const { cardError: JCBError, setCardBrand } = useJCBCardError();
	const cardError = countryCode === 'jp' && JCBError;

	return (
		<div className={styles.container}>
			<Form
				onSubmit={onSubmit}
				trackingData={{
					formName: 'Billing form',
					context: 'settings',
					planId,
				}}
			>
				<FormHeader title="Update your billing information" />
				<div className={styles.field}>
					<CreditCard
						clientKey={stripeClientKey}
						onStripeReady={handleStripeReady}
						setCardBrand={setCardBrand}
						error={error || cardError}
						language={countryCode === 'jp' ? 'ja' : 'en'}
					/>
				</div>
				<FormActions
					disabled={!!cardError} // Drastic, but it "succeeds" in Stripe so we need to actually prevent it
					error={error}
					submitText="Update"
					cancelText="Never mind"
					onCancel={hideModal}
					loading={loading}
				/>
			</Form>
		</div>
	);
};

export default BillingForm;
