import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAdType } from '../AdUnit';
import { clearSpotlight, renderSpotlight } from './action';
import compose from '../../../helpers/compose';
import { withRouter } from 'next/router';
import { Spotlight as SpotlightAd } from '../../../components/Ad/Ad';

class Spotlight extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			el: undefined,
		};

		this.onSlotRenderEnded = this.onSlotRenderEnded.bind( this );
	}

	componentDidUpdate( { id: prevId } ) {
		if ( prevId !== this.props.id ) {
			this.props.onClearSpotlight( prevId );
		}
	}

	/**
	 * When the ad render is complete, determine what type it is and add the proper class
	 * If the unit is a spotlight, save its id in redux
	 * @param {object} event
	 * @return {void}
	 */
	onSlotRenderEnded( event ) {
		const { isEmpty, size } = event;
		const { id, onRenderSpotlight, onClearSpotlight } = this.props;

		if ( !isEmpty && size ) {
			if ( 'spotlight' === getAdType( size ) ) {
				const el = document.getElementById( id );
				this.setState( { el } );
				onRenderSpotlight( id, el );
			} else {
				onClearSpotlight( id );
			}
		}
	}

	/**
	 * Before the component unmounts, remove any spotlight ids from redux if this was a spotlight ad
	 *
	 * @return {void}
	 */
	componentWillUnmount() {
		const { id, onClearSpotlight } = this.props;
		const { type } = this.state;

		if ( 'spotlight' === type ) {
			onClearSpotlight( id );
		}
	}

	render() {
		const { loaded } = this.state;

		return (
			<SpotlightAd
				onSlotRenderEnded={this.onSlotRenderEnded}
				loaded={loaded}
				{...this.props}
			/>
		);
	}

}

Spotlight.propTypes = {
	id: PropTypes.string.isRequired,
	onClearSpotlight: PropTypes.func.isRequired,
	onRenderSpotlight: PropTypes.func.isRequired,
	path: PropTypes.string,
};

const mapDispatchToProps = dispatch => ( {
	onClearSpotlight: id => dispatch( clearSpotlight( id ) ),
	onRenderSpotlight: ( id, el ) => dispatch( renderSpotlight( id, el ) ),
} );

export default compose(
	withRouter,
	connect( undefined, mapDispatchToProps )
)( Spotlight );
