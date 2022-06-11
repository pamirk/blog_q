import React from 'react';
import PropTypes from 'prop-types';
import styles from './PullQuote.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const PullQuote = ( { innerHtml, isPremium } ) => (
	<div
		className={cx( 'container', { premium: isPremium } )}
		dangerouslySetInnerHTML={{ __html: innerHtml }}
	/>
);

PullQuote.propTypes = {
	innerHtml: PropTypes.string.isRequired,
	isPremium: PropTypes.bool,
};

export default PullQuote;
