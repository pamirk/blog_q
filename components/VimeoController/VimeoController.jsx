import React, {Component} from 'react';
import PropTypes from 'prop-types';
import mediaPropTypes from '../../helpers/propTypes/mediaPropTypes';
import Vimeo from '../../components/Vimeo/Vimeo';
import classnames from 'classnames/bind';
import styles from './VimeoController.module.scss';
import ResponsiveImage from '../../components/ResponsiveImage/ResponsiveImage';
import {SubscribeLink} from '../../components/AccountLink/AccountLink';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import {convertSecondsToMinutes} from '../../helpers/dates';
import PlayIcon from '../../svgs/play-icon';

const cx = classnames.bind(styles);

const PlayerOverlayDetails = ({title, duration}) => (
    <div className={cx('video-data-container')}>
        <span className={cx('title')}>{title}</span>
        {
            duration &&
            <time className={cx('duration')} dateTime={`${duration}s`}>{convertSecondsToMinutes(duration)}</time>
        }
    </div>
);

PlayerOverlayDetails.propTypes = {
    duration: PropTypes.number,
    title: PropTypes.string,
};

const PlayerOverlayImage = ({featuredImage}) => (

    <ResponsiveImage
        src={featuredImage.sourceUrl}
        title={featuredImage.title}
        alt={featuredImage.altText}
        sources={[
            {
                breakpoint: 'phone-only',
                width: 410,
            },
            {
                breakpoint: 'phone-large-up',
                width: 690,
            },
            {
                breakpoint: 'tablet-portrait-up',
                width: 950,
            },
            {
                breakpoint: 'tablet-landscape-up',
                width: 1150,
            },
        ]}
        lazyLoad={true}
        aspectRatio={16 / 9}
        crop={false}
    />
);

PlayerOverlayImage.propTypes = {
    featuredImage: PropTypes.shape(mediaPropTypes).isRequired,
};

export const PlayerOverlay = ({duration, loaded, featuredImage, onPlay, overlay, title}) => {
    switch (overlay) {
        case 'trailer':
            return (
                <button
                    className={cx('overlay', {loaded})}
                    onClick={onPlay}
                >
                    {featuredImage && <PlayerOverlayImage featuredImage={featuredImage}/>}
                    <div className={cx('content-wrapper', {loaded})}>
                        <div className={cx('button')}>
                            <PlayIcon className={cx('play-icon', 'trailer')}/>
                            <span className={cx('subscribe-text')}>Preview this video</span>
                        </div>
                        <PlayerOverlayDetails duration={duration} title={title}/>
                    </div>
                </button>
            );
        case 'rewatchTrailer':
        case 'paywall':
            return (
                <div className={cx('overlay', {loaded})}>
                    {featuredImage && <PlayerOverlayImage featuredImage={featuredImage}/>}
                    <div className={cx('content-wrapper', {loaded})}>
                        <div className={cx('button')}>
                            <SubscribeLink trackingContext="article video">
                                <span className={cx('subscribe-text')}>Become a member to watch this video</span>
                            </SubscribeLink>
                        </div>
                    </div>
                </div>
            );
        default:
            return (
                <button
                    title="Play video"
                    className={cx('overlay', {loaded})}
                    onClick={onPlay}
                >
                    {featuredImage && <PlayerOverlayImage featuredImage={featuredImage}/>}
                    <div className={cx('content-wrapper', {loaded})}>
                        <PlayIcon className={cx('play-icon', 'default')}/>
                        <PlayerOverlayDetails duration={duration} title={title}/>
                    </div>
                </button>
            );
    }
};

PlayerOverlay.propTypes = {
    duration: PropTypes.number,
    featuredImage: PropTypes.shape(mediaPropTypes),
    loaded: PropTypes.bool.isRequired,
    onPlay: PropTypes.func.isRequired,
    overlay: PropTypes.string,
    title: PropTypes.string,
};

// Handles the overlay display and logic for the Vimeo player.
class VimeoController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            loaded: false,
        };

        this.handleEnded = this.handleEnded.bind(this);
        this.handleLoaded = this.handleLoaded.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
    }

    handleEnded() {
        this.setState({playing: false});
    }

    handleLoaded() {
        this.setState({loaded: true});
    }

    handlePlay() {
        const {onStarted} = this.props;

        this.setState({
            playing: true,
        }, onStarted);
    }

    render() {
        const {playing} = this.state;
        const {featuredImage, video, overlay, title} = this.props;

        return (
            <div className={cx('container')}>
                <Vimeo
                    {...this.state}
                    video={video}
                    onEnded={this.handleEnded}
                    onLoaded={this.handleLoaded}
                />
                {!playing && (
                    <PlayerOverlay
                        {...this.state}
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

VimeoController.propTypes = {
    featuredImage: PropTypes.shape(mediaPropTypes),
    onStarted: PropTypes.func.isRequired,
    overlay: PropTypes.string,
    title: PropTypes.string,
    video: PropTypes.shape({
        id: articlePropTypes.video.id,
        related: articlePropTypes.video.related,
        duration: PropTypes.number,
    }).isRequired,
};

VimeoController.defaultProps = {
    onStarted: () => {
    },
};

export default VimeoController;
