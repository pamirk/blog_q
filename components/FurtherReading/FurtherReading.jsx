import React from 'react';
import PropTypes from 'prop-types';
import styles from './FurtherReading.module.scss';
import classnames from 'classnames/bind';
import Link from '../../components/Link/Link';
import { getHostname } from '../../helpers/urls';

const cx = classnames.bind( styles );

const FurtherReading = ( { title, url } ) => (
	<div className={cx( 'container' )}>
		<h4 className={cx( 'kicker' )}>Further Reading</h4>
		<h3 className={cx( 'title' )}>
			<Link to={url}>{title}</Link>
		</h3>
		<div className={cx( 'domain' )}>{getHostname( url )}</div>
	</div>
);

FurtherReading.propTypes = {
	title: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
};

FurtherReading.defaultProps = {
	title: '',
	url: '',
};

export default FurtherReading;
