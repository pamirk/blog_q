import React, { Fragment } from 'react';
import FormHeader from '../../../FormHeader/FormHeader';
import { LoginLink } from '../../../../AccountLink/AccountLink';
import classnames from 'classnames/bind';
import styles from './ConfirmReset.module.scss';

const cx = classnames.bind( styles );

const ConfirmReset = ( ) => (
	<Fragment>
		<FormHeader
			title="Reset password"
			description="Your password has been reset."
		/>

		<div className={cx( 'container' )}>
			<LoginLink trackingContext="login" buttonVariant="primary" />
		</div>
	</Fragment>
);

export default ConfirmReset;
