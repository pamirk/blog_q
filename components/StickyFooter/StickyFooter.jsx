import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './StickyFooter.module.scss';

const cx = classnames.bind( styles );

const StickyFooter = ( { children } ) => (
	<div className={cx( 'container' )}>
		{children}
	</div>
);

StickyFooter.propTypes = {
	children: PropTypes.node,
};

export default StickyFooter;
