import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SponsoredObsession } from '../Ad';
import withPostMessage from '../../../helpers/wrappers/withPostMessage.js';

class SponsoredObsessionAdWrapper extends Component {

	constructor( props ) {
		super( props );

		const { id, targeting } = props;

		this.postMessageHandler = this.postMessageHandler.bind( this );
		this.onSlotRenderEnded = this.onSlotRenderEnded.bind( this );
		this.postMessageEventName = `sponsored-obsession-ad-${id}`;

		this.targetingData = { ...targeting, eventName: this.postMessageEventName };
	}

	// when mount set the post message handler and event name
	componentDidMount() {
		// when mounted, it will call addMessageListener to pass the postEventType and postHandler to the withPostMessage HOC which knows when to trigger the handler function given the event type
		this.props.addMessageListener( { eventHandler: this.postMessageHandler, eventName: this.postMessageEventName } );
	}

	// the post message handler calls the onSponsoredObsessionData handler passing in the data from the post message event
	// then stop listening to anymore window.postMessage events
	postMessageHandler( { data } ) {
		const { onSponsoredObsessionData, removeMessageListener } = this.props;

		removeMessageListener();

		onSponsoredObsessionData( data );

	}

	// onSlotRenderEnded event that is triggered by GTP component.  This handler will check to see if the ad returns an empty ad, if if so
	// trigger removeMessageListener to stop listening to the post message event.  If not empty let the postMessageHandler stop the post message event
	onSlotRenderEnded( eventData ) {
		const { isEmpty } = eventData;
		const { removeMessageListener } = this.props;

		if ( isEmpty ) {
			removeMessageListener();
		}
	}

	render() {
		const { id, path, className } = this.props;

		return (
			<SponsoredObsession
				id={id}
				targeting={this.targetingData}
				path={path}
				className={className}
				onSlotRenderEnded={this.onSlotRenderEnded}
			/>
		);
	}

}

SponsoredObsessionAdWrapper.propTypes = {
	addMessageListener: PropTypes.func.isRequired, // id for the sponsored obsession ad
	className: PropTypes.string, // targeting params
	id: PropTypes.string.isRequired, // part of the adUnitPath
	onSponsoredObsessionData: PropTypes.func.isRequired, // additional className for styling purposes
	path: PropTypes.string, // a function that can be called to stop listening to the post message event
	removeMessageListener: PropTypes.func.isRequired, // a function that will set the post handler and post event type to the HOC postMessage
	targeting: PropTypes.object,
};

const SponsoredObsessionAd = withPostMessage( SponsoredObsessionAdWrapper );

SponsoredObsessionAd.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	path: PropTypes.string,
	targeting: PropTypes.object,
};

export default SponsoredObsessionAd;
