import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './Video.module.scss';
import classnames from 'classnames/bind';
import withAmp from 'helpers/wrappers/withAmp';
import { getAmpBool } from 'helpers/amp';

const cx = classnames.bind( styles );

type SharedVideoProps = {
	autoplay: boolean,
	controls: boolean,
	loop: boolean,
	poster: string,
	src: string
}

interface VideoProps extends SharedVideoProps {
	innerHtml?: string,
	playsinline: boolean,
	preload: string,
	size: 'medium' | 'large' | 'extra-large',
}

interface AmpProps extends SharedVideoProps {
	height: number,
	layout: string,
	width: number,
}

// Browsers do a decent job of playing/pausing autoplay videos as they come
// into/out of view, so we won't bother wrapping in withVisibility.
// https://developers.google.com/web/updates/2016/07/autoplay
const Video = ( props: VideoProps ) => {
	/*
		Wordpress supports closed captions for video, but they are delivered to us as <track> tags
		in the innerHtml of the shortcode. We don't know whether this HTML exists or not, but we'll
		be optimistic and dangerouslySetInnerHTML whatever we're given in the hopes that it contains
		one or more <track> tags. Obviously eslint won't know this either, so we have to disable our
		media-has-caption rule here.
	*/
	const { autoplay, controls, innerHtml, loop, playsinline, poster, preload, size, src } = props;
	return (
		// eslint-disable-next-line jsx-a11y/media-has-caption
		<video
			autoPlay={autoplay}
			className={cx( 'container', 'alignleft', size )}
			controls={controls}
			dangerouslySetInnerHTML={{
				__html: innerHtml ? innerHtml.replace( /”|”/g, '"' ) : '',
			}}
			loop={loop}
			muted={autoplay}
			playsInline={playsinline}
			poster={poster}
			preload={preload}
			src={src}
		/>
	);
};

const VideoAmp = ( props: AmpProps ) => {
	const { autoplay, controls, height, layout, loop, poster, src, width } = props;
	return (
		<Fragment>
			<Helmet>
				<script
					async={undefined}
					custom-element="amp-video"
					src="https://cdn.ampproject.org/v0/amp-video-0.1.js"
				/>
			</Helmet>
			<amp-video
				autoplay={!!getAmpBool( autoplay )}
				controls={!!getAmpBool( controls )}
				loop={!!getAmpBool( loop )}
				poster={poster}
				src={src}
				width={width}
				height={height}
				layout={layout}
			/>
		</Fragment>
	);
};

const sharedDefaultProps = {
	autoplay: false,
	controls: true,
	loop: false,
	poster: '',
};

Video.defaultProps = {
	...sharedDefaultProps,
	innerHtml: '',
	playsinline: true,
	preload: 'auto',
	size: 'medium',
};

VideoAmp.defaultProps = {
	...sharedDefaultProps,
	height: 800,
	width: 450,
	layout: 'responsive',
};

// @ts-ignore
export default withAmp( VideoAmp )( Video );
