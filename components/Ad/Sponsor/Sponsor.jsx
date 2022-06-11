import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Sponsor} from '../Ad';
import withPostMessage from '../../../helpers/wrappers/withPostMessage.js';
import {generateId} from '../../../helpers/math';
import {get, logImpression} from '../../../helpers/utils';
import deepEqual from 'deep-equal';

class SponsorAd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clickThroughUrls: [],
            hasSponsorData: false,
            images: [],
            messages: [],
            isEmpty: false,
        };

        this.postMessageEventName = `sponsor-ad-${generateId()}`;
        this.onSponsorData = this.onSponsorData.bind(this);
        this.onSlotRenderEnded = this.onSlotRenderEnded.bind(this);
    }

    componentDidMount() {
        const {addMessageListener} = this.props;

        // when mounted, it will call addMessageListener to pass the postEventType and postHandler to the withPostMessage HOC which knows when to trigger the handler function given the event type
        addMessageListener({
            eventHandler: this.onSponsorData,
            eventName: this.postMessageEventName,
        });
    }

    componentDidUpdate(prevProps) {
        if (!deepEqual(prevProps.targeting, this.props.targeting)) {
            this.setState({isEmpty: false});
        }
    }

    componentWillUnmount() {
        this.props.removeMessageListener();
    }

    onSponsorData(event) {
        const {images, messages, tracking} = event.data;
        const clickThroughUrls = get(tracking, 'clickThrough.urls', []);
        const viewTrackingUrls = get(tracking, 'view.urls', []);

        // Here is where we should fire tracking pixels.
        viewTrackingUrls.forEach(url => logImpression(url));

        this.setState({
            clickThroughUrls,
            hasSponsorData: true,
            images: images || [],
            messages: messages || [],
            isEmpty: false,
        });
    }

    onSlotRenderEnded(event) {
        if (event.isEmpty) {
            this.setState({isEmpty: true});
        }
    }

    render() {
        const {path, render, targeting} = this.props;
        const {hasSponsorData, isEmpty, ...state} = this.state;
        const eventName = this.postMessageEventName;

        if (hasSponsorData) {
            return render(state);
        }

        if (isEmpty) {
            return null;
        }

        return (
            <Sponsor
                path={path}
                targeting={{...targeting, eventName}}
                onSlotRenderEnded={this.onSlotRenderEnded}
            />
        );
    }
}

SponsorAd.propTypes = {
    addMessageListener: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    removeMessageListener: PropTypes.func.isRequired,
    render: PropTypes.func,
    targeting: PropTypes.object,
};

SponsorAd.defaultProps = {
    render: () => null,
    targeting: {},
};

export default withPostMessage(SponsorAd);
