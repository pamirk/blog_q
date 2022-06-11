import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import styles from './QuartzObject.module.scss';
import classnames from 'classnames/bind';
import withAmp from '../../helpers/wrappers/withAmp';

const cx = classnames.bind( styles );

function objectURL( id ) {
	return `https://objects.qz.com/object/${id}/embed`;
}

const QuartzObject = ( { id } ) => (
	<div className={cx( 'container' )}>
		<iframe
			src={objectURL( id )}
			title="Quartz Objects"
			layout="responsive"
			sandbox="allow-scripts allow-same-origin allow-popups"
			frameBorder="0"
			allowFullScreen=""
		>
		</iframe>
	</div>
);

const QuartzObjectAmp = ( { id } ) => (
	<Fragment>
		<Helmet>
			<script
				async={undefined}
				custom-element="amp-iframe"
				src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"
			/>
		</Helmet>
		<amp-iframe
			src={objectURL( id )}
			layout="responsive"
			sandbox="allow-scripts allow-same-origin allow-popups"
			frameBorder="0"
			allowFullScreen=""
			width="1.6"
			height="1"
		>
		</amp-iframe>
	</Fragment>
);

QuartzObject.propTypes = QuartzObjectAmp.propTypes = {
	id: PropTypes.string.isRequired,
};

export default withAmp( QuartzObjectAmp )( QuartzObject );
