import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import styles from './YouTube.module.scss';
import classnames from 'classnames/bind';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import withAmp from '../../helpers/wrappers/withAmp';
import { videoEmbedURL } from '../../helpers/utils';

const cx = classnames.bind( styles );

const Video = ( { video } ) => {
	if ( ! video ) {
		return null;
	}

	let url = videoEmbedURL( video );

	if ( video.related ) {
		url += `&rel=${video.related}`;
	}

	return (
		<div className={cx( 'container' )}>
			<iframe
				allowFullScreen={true}
				frameBorder="0"
				src={url}
				title="Embedded YouTube video"
			></iframe>
		</div>
	);
};

const VideoAmp = ( { video } ) => (
	<Fragment>
		<Helmet>
			<script async={undefined} custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js" />
		</Helmet>
		<amp-youtube
			data-videoid={video.id}
			autoplay={0}
			data-param-showinfo={0}
			data-param-playsinline={1}
			data-param-modestbranding={1}
			data-param-rel={video.related}
			layout="responsive"
			width="640"
			height="360"
		>
		</amp-youtube>
	</Fragment>
);

Video.propTypes = VideoAmp.propTypes = {
	video: PropTypes.shape( {
		id: articlePropTypes.video.id,
		related: articlePropTypes.video.related,
	} ).isRequired,
};

export default withAmp( VideoAmp )( Video );
