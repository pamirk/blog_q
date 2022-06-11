import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import withAmp from '../../helpers/wrappers/withAmp';
import { loadScriptOnce } from '../../helpers/utils';

// This is named VimeoVideo instead of just Vimeo
// to not conflict with Vimeo.js
class VimeoVideo extends React.Component {
	constructor( props ) {
		super( props );

		this.play = this.play.bind( this );
		this.resetPlayer = this.resetPlayer.bind( this );
		this.setupPlayer = this.setupPlayer.bind( this );
	}

	componentDidMount() {
		loadScriptOnce( 'https://extend.vimeocdn.com/ga/44438665.js' )
			.then( this.setupPlayer );
	}

	componentDidUpdate( prevProps ) {
		const { playing: wasPlaying, video: { id: prevId } } = prevProps;
		const { playing: isPlaying, video: { id } } = this.props;

		if ( prevId !== id ) {
			this.props.onEnded();
			this.setupPlayer();
			return;
		}

		if ( wasPlaying && !isPlaying ) {
			this.resetPlayer();
			return;
		}

		if ( !wasPlaying && isPlaying ) {
			this.play();
			return;
		}
	}

	setupPlayer() {
		const { video: { id }, onLoaded } = this.props;
		const { __vimeoRefresh, Vimeo } = window; // eslint-disable-line no-undef

		if ( this.player ) {
			this.player.unload().then( () => this.player.loadVideo( id ) );
		} else {
			this.player = new Vimeo.Player( this.el, { id } );
		}

		this.player.on( 'loaded', __vimeoRefresh );

		onLoaded( id );
	}

	resetPlayer() {
		this.player.setCurrentTime( 0 );
	}

	play() {
		const { loaded, video: { id }, onEnded } = this.props;

		if ( !loaded ) {
			return;
		}
		this.player.play();
		this.player.on( 'ended', () => onEnded( id ) );
	}

	render() {
		return (
			<div ref={ref => this.el = ref} />
		);
	}
}

VimeoVideo.propTypes = {
	loaded: PropTypes.bool.isRequired,
	onEnded: PropTypes.func.isRequired,
	onLoaded: PropTypes.func.isRequired,
	playing: PropTypes.bool.isRequired,
	video: PropTypes.shape( {
		id: articlePropTypes.video.id,
		related: articlePropTypes.video.related,
	} ).isRequired,
};

VimeoVideo.defaultProps = {
	loaded: false,
	onEnded: () => {},
	onLoaded: () => {},
	playing: false,
};

const VimeoAmp = ( { video } ) => (
	<Fragment>
		<Helmet>
			<script async custom-element="amp-vimeo" src="https://cdn.ampproject.org/v0/amp-vimeo-0.1.js"/>
		</Helmet>
		<amp-vimeo
			data-videoid={video.id}
			layout="responsive"
			width="640"
			height="360"
		>
		</amp-vimeo>
	</Fragment>
);

VimeoAmp.propTypes = {
	video: PropTypes.shape( {
		id: articlePropTypes.video.id,
		related: articlePropTypes.video.related,
	} ).isRequired,
};

export default withAmp( VimeoAmp )( VimeoVideo );
