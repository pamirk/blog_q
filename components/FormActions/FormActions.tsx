import React, { Fragment } from 'react';
import { Button } from '@quartz/interface';
import classnames from 'classnames/bind';
import styles from './FormActions.module.scss';

const cx = classnames.bind( styles );

type ButtonType = 'primary' | 'secondary' | 'warning'

const FormActions = ( props: {
	disabled?: boolean,
	inactive?: boolean,
	error?: React.ReactNode,
	loading?: boolean,
	cancelText?: string,
	onCancel?: () => void,
	submitText: string,
	submitButtonType?: ButtonType,
	cancelButtonType?: ButtonType,
} ) => {
	const {
		disabled = false,
		inactive = false,
		loading = false,
		error,
		cancelText,
		onCancel,
		submitText,
		submitButtonType = 'primary',
		cancelButtonType = 'secondary',
	} = props;

	return (
		<Fragment>
			<div className={cx( 'button-container' )}>
				<Button
					type="submit"
					loading={loading}
					variant={submitButtonType}
					inactive={inactive}
					disabled={disabled}
				>{submitText}</Button>
			</div>
			{
				cancelText && onCancel &&
				<div className={cx( 'button-container' )}>
					<Button
						variant={cancelButtonType}
						onClick={onCancel}
					>{cancelText}</Button>
				</div>
			}
			{error && <div className={cx( 'error' )} data-cy="form-error">{error}</div>}
		</Fragment>
	);
};

export default FormActions;
