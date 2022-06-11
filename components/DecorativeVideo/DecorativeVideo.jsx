import React from 'react';
import PropTypes from 'prop-types';
import compose from '../../helpers/compose';
import {mediaPropTypes} from '../../helpers/propTypes';
import {canPlayVideoType, getBreakpoint} from '../../helpers/browser';
import {once} from '../../helpers/utils';
import {withProps, withResize} from '../../helpers/wrappers';
import ArtDirection from '../../components/ArtDirection/ArtDirection';

const sizesToBreakpoints = {
    small: [
        'phone-only',
        'phone-large-up',
    ],
    medium: [
        'tablet-portrait-up',
        'tablet-landscape-up',
    ],
    large: [
        'desktop-up',
        'desktop-large-up',
        'desktop-extra-large-up',
    ],
};

const canPlayWebm = once(() => canPlayVideoType('webm'));

const breakpointToSize = breakpoint => Object.keys(sizesToBreakpoints).find(size => sizesToBreakpoints[size].includes(breakpoint));

class DecorativeVideo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            breakpointPosterSrc: null,
            breakpointVideoSrc: null,
            ssr: true,
        };
    }

    componentDidMount() {
        /*
            Once the component has mounted we are able to determine the size of the
            viewport and therefore we can pick the appropriate video and poster size.
        */
        this.setBreakpointSrcs();
        this.props.addResizeListener(this.setBreakpointSrcs.bind(this));
    }

    setBreakpointSrcs() {
        const viewportSize = breakpointToSize(getBreakpoint());
        const video = this.props.sources.find(({size}) => size === viewportSize);

        if (!video) {
            return;
        }

        const {mp4, poster, webm} = video;
        // noinspection JSUnresolvedVariable
        this.setState({
            // We prefer webm because it tends to have better compression
            breakpointVideoSrc: canPlayWebm() ? webm.mediaItemUrl : mp4.mediaItemUrl,
            breakpointPosterSrc: poster.sourceUrl,
            ssr: false,
        });
    }

    render() {
        return this.state.ssr ? (
            <ArtDirection alt="Video placeholder" sources={this.props.posterSources}/>
        ) : (
            /*
                Ordinarily we would use <source> nodes for the webm and mp4 sources and let the browser
                decide which it wants to use. However, changing the src attribute of a <source> node on the
                fly, as we want to do when the breakpoint changes, will not update the video that is playing.
                Instead we must update the src attribute of the <video> node itself. From W3C:

                > "Dynamically modifying a source element and its attribute when the element is already
                > inserted in a video or audio element will have no effect. To change what is playing, just
                > use the src attribute on the media element directly, possibly making use of the
                > canPlayType() method to pick from amongst available resources."
                - http://w3c.github.io/html/#the-source-element
            */
            <video
                autoPlay
                loop
                muted
                playsInline
                poster={this.state.breakpointPosterSrc}
                src={this.state.breakpointVideoSrc}
            />
        );
    }
}

DecorativeVideo.propTypes = {
    addResizeListener: PropTypes.func.isRequired,
    posterSources: PropTypes.arrayOf(PropTypes.shape({
        breakpoint: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    })).isRequired,
    sources: PropTypes.arrayOf(PropTypes.shape({
        poster: PropTypes.shape(mediaPropTypes).isRequired,
        size: PropTypes.string.isRequired,
        mp4: PropTypes.shape(mediaPropTypes).isRequired,
        webm: PropTypes.shape(mediaPropTypes).isRequired,
    })).isRequired,
};

/*
	Extracts the poster image data from the supplied video source data
	so we can easily supply them to ArtDirection for our placeholder
	images (to display until we are ready to show a video).
*/
const withPosterSources = props => {
    const posterSources = props.sources.map(videoSource => {
        const {poster: {mediaDetails, sourceUrl}, size} = videoSource;
        const {width, height} = mediaDetails;

        return {
            breakpoint: sizesToBreakpoints[size][0],
            url: sourceUrl,
            width,
            height,
        };
    });

    return {
        posterSources,
    };
};

export default compose(
    withProps(withPosterSources),
    withResize
)(DecorativeVideo);
