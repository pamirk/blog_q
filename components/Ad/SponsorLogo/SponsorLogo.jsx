import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Logo } from '../../../components/Ad/Ad.jsx';
import styles from './SponsorLogo.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind( styles );

class SponsorLogo extends Component {

	constructor( props ) {
		super( props );

		this.onSlotRenderEnded = this.onSlotRenderEnded.bind( this );

		this.state = {
			visible: false,
		};
	}

	onSlotRenderEnded( event ) {
		this.setState( {
			visible: !event.isEmpty,
		} );
	}

	render() {
		const { path, sponsorText, targeting, context } = this.props;
		const { visible } = this.state;

		return (
			<div className={cx( 'container', { visible }, { [`context-${context}`]: context } )}>
				<span className={cx( 'sponsor-text' )}>{sponsorText}</span>
				<div className={cx( 'sponsor-logo' )}>
					<Logo
						id="sponsor-logo"
						path={path}
						onSlotRenderEnded={this.onSlotRenderEnded}
						targeting={targeting}
						lazyLoad={false}
					/>
				</div>
			</div>
		);
	}
}

SponsorLogo.propTypes = {
	context: PropTypes.string,
	path: PropTypes.string.isRequired,
	sponsorText: PropTypes.string.isRequired,
	targeting: PropTypes.object.isRequired,
};

SponsorLogo.defaultProps = {
	sponsorText: 'Sponsored by',
	targeting: {},
	context: '',
	renderWhenViewable: true,
};

export default SponsorLogo;
