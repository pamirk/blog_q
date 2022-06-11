import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import classnames from 'classnames/bind';
import styles from './EmbedVimeo.module.scss';
import withAmp from '../../../../helpers/wrappers/withAmp';

const cx = classnames.bind( styles );

const EmbedVimeo = ( { url, amp } ) => {
	// Extract the ID from the URL
	const idMatch = url.match( /\.com\/([0-9]+)/ );

	if ( !idMatch ) {
		return null;
	}

	const [ , videoId ] = idMatch;
	const iframeSrc = `https://player.vimeo.com/video/${videoId}`;

	if ( amp ) {
		return (
			<Fragment>
				<Helmet>
					<script async={undefined} custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
				</Helmet>
				<amp-iframe
					src={iframeSrc}
					width="640"
					height="360"
					frameBorder="0"
					layout="responsive"
					sandbox="allow-scripts allow-same-origin"
				>
				</amp-iframe>
			</Fragment>
		);
	}

	return (
		<div className={cx( 'container' )}>
			<iframe
				src={iframeSrc}
				allowFullScreen={true}
				frameBorder="0"
				title="Embedded Vimeo video"
			></iframe>
		</div>
	);
};

EmbedVimeo.propTypes = {
	amp: PropTypes.bool.isRequired, // URL to the Vimeo video
	url: PropTypes.string.isRequired,
};

EmbedVimeo.defaultProps = {
	mode: 'scroll',
};

export default withAmp()( EmbedVimeo );
