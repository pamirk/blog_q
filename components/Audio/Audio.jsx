// noinspection JSUnresolvedLibraryURL

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import withAmp from '../../helpers/wrappers/withAmp';
import classnames from 'classnames/bind';
import styles from './Audio.module.scss';
import { getAmpBool } from '../../helpers/amp';

const cx = classnames.bind( styles );

const Audio = ( { loop, src } ) => (
	// Wordpress doesn't support closed captions for audio embeds yet :(
	// eslint-disable-next-line jsx-a11y/media-has-caption
	<audio
		className={cx( 'player' )}
		controls={true}
		src={src}
		loop={loop}
	/>
);

const AudioAmp = ( { loop, src } ) => (
	<Fragment>
		<Helmet>
			<script
				async={undefined}
				custom-element="amp-audio"
				src="https://cdn.ampproject.org/v0/amp-audio-0.1.js"
			/>
		</Helmet>
		<amp-audio
			controls=""
			loop={getAmpBool( loop )}
			src={src}
		/>
	</Fragment>
);

Audio.propTypes =
AudioAmp.propTypes = {
	loop: PropTypes.bool.isRequired,
	src: PropTypes.string.isRequired,
};

Audio.defaultProps =
AudioAmp.defaultProps = {
	loop: false,
};

export default withAmp( AudioAmp )( Audio );
