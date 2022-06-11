import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Link from '../../components/Link/Link';
import styles from './Disclaimer.module.scss';

const cx = classnames.bind( styles );

const Disclaimer = ( { children } ) => (
	<div className={cx( 'disclaimer' )}>
		<p className={cx( 'secure-transaction' )}>This is a secure transaction.</p>
		{children}
		<p>Need help? Email <Link to="mailto:join@qz.com">join@qz.com</Link> for support.</p>
	</div>
);

Disclaimer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Disclaimer;
