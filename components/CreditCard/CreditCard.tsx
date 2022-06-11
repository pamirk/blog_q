import React, { useCallback, useEffect, useRef, useState } from 'react';
import { loadScriptOnce } from 'helpers/utils';
import styles from './CreditCard.module.scss';
// import tokens from '@quartz/styles/dictionaries/colors.json';

const CreditCard = ( props: {
	clientKey: string,
	error?: React.ReactNode,
	label?: string,
	language?: string,
	onPaymentInfoComplete?: ( response: any ) => void,
	// @ts-ignore
	onStripeReady: ( callback: () => Promise<stripe.Token | undefined> ) => void,
	setCardBrand?: ( brand: string ) => void,
	subtext?: string | null,
} ) => {

	const { clientKey, error, label, language, onPaymentInfoComplete, onStripeReady, setCardBrand, subtext } = props;
	const [ cardGenerated, setCardGenerated ] = useState( false );
	const cardContainer = useRef<HTMLDivElement>( null );

	const configureStripe = useCallback( () => {
		if ( !cardGenerated ) {
			const locale = language || 'auto';
			// @ts-ignore
			const stripe = window.Stripe( clientKey, { locale } );
			// Not ideal, but styling Stripe's iframe is tricky
			const darkMode = window.matchMedia( '(prefers-color-scheme: dark)' ).matches;
			const elements = stripe.elements();

			const style = {
				base: {
					// color: darkMode ? tokens.color.white.value : tokens.color.black.value,
					color: darkMode ? "#000" : "#fff",
					fontSize: '16px',
					fontFamily: '"MaisonNeue", "Helvetica Neue", Helvetica, sans-serif',
					'::placeholder': {
						color: '#777777',
					},
				},
				invalid: {
					color: '#c25250',
					iconColor: '#c25250',
				},
			};

			const card = elements.create( 'card', { style } );
			card.mount( cardContainer.current );
			card.addEventListener( 'change', ( response ) => {
				if ( response?.brand && setCardBrand ) {
					setCardBrand( response.brand || 'unknown' );
				}

				onPaymentInfoComplete?.( !!response?.complete );
			} );

			// We pass back a getter for generating tokens from the Stripe/Card objects, because
			// the Submit component is a sibling, but needs to generate new tokens for each request
			const getStripeToken = () => stripe.createToken( card )
				.then( ( { error, token } ) => {
					if ( error ) {
						throw error;
					}

					return token;
				} );

			onStripeReady( getStripeToken );
			setCardGenerated( true );
		}
	}, [ cardGenerated, clientKey, language, onPaymentInfoComplete, onStripeReady, setCardBrand ] );

	useEffect( () => {
		loadScriptOnce( 'https://js.stripe.com/v3/', {} )
			.then( configureStripe );
	}, [ configureStripe ] );

	return (
		<div className={styles.container}>
			{label && <label htmlFor="credit-card" id="credit-card-label" className={styles.label}>{label}</label>}
			<div aria-labelledby="credit-card-label" aria-describedby="credit-card-subtext" id="credit-card" className={styles.creditCard} ref={cardContainer} />
			{( error || subtext ) &&
			<div
				className={error ? styles.error : styles.subtext}
				id="credit-card-subtext"
			>
				{error || subtext}
			</div>
			}
		</div>
	);
};

export default CreditCard;
