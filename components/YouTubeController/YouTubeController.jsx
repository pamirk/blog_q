import React, {Component} from 'react';
import PropTypes from 'prop-types';
import mediaPropTypes from '../../helpers/propTypes/mediaPropTypes';
import classnames from 'classnames/bind';
import styles from './YouTubeController.module.scss';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import {loadScriptOnce} from '../../helpers/utils';
import {PlayerOverlay} from '../../components/VimeoController/VimeoController';

const cx = classnames.bind(styles);

// Handles the overlay display and logic for the YouTube player.
class YouTubeController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            loaded: false,
        };

        this.handleEnded = this.handleEnded.bind(this);
        this.handleLoaded = this.handleLoaded.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);

        this.playerId = `player-${this.props.video.id}`;
    }

    componentDidMount() {
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
        loadScriptOnce('https://www.youtube.com/iframe_api').then(this.onYouTubeIframeAPIReady);
    }

    onYouTubeIframeAPIReady() {

        if (this.state.loaded || 'undefined' === typeof window.YT.Player) {
            return;
        }

        this.player = new window.YT.Player(this.playerId, {
            videoId: this.props.video.id,
            events: {
                onStateChange: this.handleEnded,
            },
            playerVars: {
                modestbranding: 1,
                rel: 0,
            },
        });

        this.handleLoaded();
    }

    handleEnded(event) {

        if (event.data === window.YT.PlayerState.ENDED) {
            this.setState({playing: false});
        }
    }

    handleLoaded() {
        this.setState({loaded: true});
    }

    handlePlay() {
        this.setState({playing: true});
        this.player.playVideo();
    }

    render() {
        const {playing, loaded} = this.state;
        const {featuredImage, video, overlay, title} = this.props;

        return (
            <div className={cx('container')}>
                <div id={this.playerId}></div>
                {!playing && (
                    <PlayerOverlay
                        playing={playing}
                        loaded={loaded}
                        featuredImage={featuredImage}
                        onPlay={this.handlePlay}
                        overlay={overlay}
                        title={title}
                        duration={video.duration}
                    />
                )}
            </div>
        );
    }
}

YouTubeController.propTypes = {
    featuredImage: PropTypes.shape(mediaPropTypes),
    overlay: PropTypes.string,
    title: PropTypes.string,
    video: PropTypes.shape({
        id: articlePropTypes.video.id,
        related: articlePropTypes.video.related,
        duration: PropTypes.number,
    }).isRequired,
};

export default YouTubeController;
