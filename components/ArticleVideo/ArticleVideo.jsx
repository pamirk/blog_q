import React, {Component} from 'react';
import PropTypes from 'prop-types';
import articlePropTypes from '../../helpers/propTypes/articlePropTypes';
import mediaPropTypes from '../../helpers/propTypes/mediaPropTypes';
import VimeoController from '../../components/VimeoController/VimeoController';
import YouTubeController from '../../components/YouTubeController/YouTubeController';

class ArticleVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trailerStarted: false,
        };

        this.handleTrailerStarted = this.handleTrailerStarted.bind(this);
    }

    handleTrailerStarted() {
        this.setState({trailerStarted: true});
    }

    componentDidUpdate(prevProps) {
        if (this.props.video.id !== prevProps.video.id) {
            this.setState({trailerStarted: false});
        }
    }

    render() {
        const {
            featuredImage,
            showPaywall,
            trailerVideo,
            video,
            video: {type},
        } = this.props;

        const {trailerStarted} = this.state;

        // We don't handle anything besides Youtube and Vimeo yet.
        if (type !== 'youtube' && type !== 'vimeo') {
            return null;
        }

        // We can show a trailer if one exists. Trailers only exist for vimeo videos.
        if (showPaywall && trailerVideo) {
            return (
                <VimeoController
                    video={trailerVideo}
                    featuredImage={featuredImage}
                    onStarted={this.handleTrailerStarted}
                    overlay={trailerStarted ? 'rewatchTrailer' : 'trailer'}
                />
            );
        }

        if (type === 'youtube') {
            return (
                <YouTubeController
                    video={video}
                    featuredImage={featuredImage}
                    overlay={showPaywall ? 'paywall' : 'default'}
                />
            );
        }

        return (
            <VimeoController
                video={video}
                featuredImage={featuredImage}
                overlay={showPaywall ? 'paywall' : 'default'}
            />
        );
    }
}

ArticleVideo.propTypes = {
    featuredImage: PropTypes.shape(mediaPropTypes),
    showPaywall: PropTypes.bool.isRequired,
    trailerVideo: PropTypes.shape({
        id: articlePropTypes.video.id,
    }),
    video: PropTypes.shape({
        duration: PropTypes.number,
        id: articlePropTypes.video.id,
        related: articlePropTypes.video.related,
        type: PropTypes.string,
    }).isRequired,
};

export default ArticleVideo;
