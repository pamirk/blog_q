import React, { Fragment, useState } from 'react';
import { TextInput, Button } from '@quartz/interface';
import getLocalization from 'helpers/localization';
import usePageVariant from 'helpers/hooks/usePageVariant';
import Checkmark from 'svgs/check';
import classnames from 'classnames/bind';
import styles from './PromoCodeField.module.scss';

const cx = classnames.bind( styles );

const dictionary = {
	ja: {
		Enter: '入力',
		'% off': '%オフ',
	},
};

const PromoCodeField = ( props: {
	error?: React.ReactNode,
	handleButtonClick: ( event: any ) => void,
	onChange: ( event: React.ChangeEvent ) => void,
	label?: string,
	loading: boolean,
	inputRef: React.RefObject<HTMLInputElement>,
	onFocus?: () => void,
	placeholder?: string,
	percentOff?: number,
	success: boolean,
	hint?: string,
	value?: string,
} ) => {
	const { language } = usePageVariant();
	const localize = getLocalization( { dictionary, language } );
	const status = props.success && 'confirmed';
	const statusText = props.percentOff && `${props.percentOff}${localize( '% off' )}`;

	const [ showError, setShowError ] = useState( false );

	function onClick( event: React.FormEvent ) {
		setShowError( true );
		props.handleButtonClick( event );
	}

	function onChange( event: React.ChangeEvent ) {
		setShowError( false );
		props.onChange( event );
	}

	return (
		<Fragment>
			<div className={cx( 'promo-code', { [`status-${status}`]: status } )} >
				<div className={styles.promoCodeField}>
					<TextInput
						autoComplete="off"
						onChange={onChange}
						onFocus={props.onFocus}
						id="promo-code"
						placeholder={props.placeholder}
						label={props.label}
						type="text"
						value={props.value}
						invalid={!!( showError && props.error )}
						inputRef={props.inputRef}
					/>
				</div>
				{status &&
				<div className={styles.status}>
					<Checkmark
						className={styles.check}
					/>
					{statusText && <span className={styles.statusText}>{statusText}</span>}
				</div>
				}
				{!!props.inputRef.current?.value?.length && !props.success &&
				<div className={styles.checkPromoCodeButton}>
					<Button
						loading={props.loading}
						onClick={onClick}
					>
						{localize( 'Enter' )}
					</Button>
				</div>
				}
			</div>
			<div className={cx( 'promo-code-subtext', { error: showError && props.error, hint: props.hint } )}>
				{showError && props.error || props.hint}
			</div>
		</Fragment>
	);
};

export default PromoCodeField;
