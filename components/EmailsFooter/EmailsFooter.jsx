import React from 'react';
import PropTypes from 'prop-types';
import styles from './EmailsFooter.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const EmailsFooter = ( { alwaysShow, alwaysHide, children } ) => (
	<div className={cx( 'container', { alwaysShow, alwaysHide } )}>
		<div className={cx( 'inner-container' )}>{children}</div>
	</div>
);

EmailsFooter.propTypes = {
	alwaysHide: PropTypes.bool,
	alwaysShow: PropTypes.bool,
	children: PropTypes.array,
};

EmailsFooter.defaultProps = {
	confirmed: false,
};

export default EmailsFooter;
