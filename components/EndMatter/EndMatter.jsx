import React from 'react';
import PropTypes from 'prop-types';
import styles from './EndMatter.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

const EndMatter = ( { innerHtml } ) => (
	<p className={cx( 'container' )}><em dangerouslySetInnerHTML={{ __html: innerHtml }} /></p>
);

EndMatter.propTypes = {
	innerHtml: PropTypes.string.isRequired,
};

export default EndMatter;
