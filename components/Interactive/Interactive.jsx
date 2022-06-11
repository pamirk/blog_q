import React from 'react';
import PropTypes from 'prop-types';
import styles from './Interactive.module.scss';
import classnames from 'classnames/bind';
import withPostMessage from '../../helpers/wrappers/withPostMessage';
import withScroll from '../../helpers/wrappers/withScroll';
import { changeToHttps } from '../../helpers/urls';

const cx = classnames.bind( styles );

export class Interactive extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			canFix: false,
			fixed: false,
			fixedBottom: false,
			height: 600,
		};

		this.el = null;
		this.maybeFixFrame = this.maybeFixFrame.bind( this );
		this.registerFrame = this.registerFrame.bind( this );
		this.resizeFrame = this.resizeFrame.bind( this );
	}

	componentDidMount() {
		const { addMessageListener, addScrollListener, id } = this.props;

		addMessageListener( {
			eventName: 'child:register',
			eventHandler: this.registerFrame,
			frameId: id,
		} );

		addMessageListener( {
			eventName: 'child:updateHeight',
			eventHandler: this.resizeFrame,
			frameId: id,
		} );

		addScrollListener( this.maybeFixFrame );
	}

	// Scroll listener to "fix" frame as user scrolls through it.
	maybeFixFrame() {
		if ( !this.state.canFix || !this.el ) {
			return;
		}

		const { bottom, top } = this.el.getBoundingClientRect();
		const fixed = top <= 0 && bottom >= 0;
		const fixedBottom = fixed && bottom < document.documentElement.clientHeight;

		this.setState( {
			fixed,
			fixedBottom,
		} );
	}

	// Listen for register event so we can set height and fix state.
	registerFrame( { data: { requestHeight } } ) {
		if ( !requestHeight ) {
			return;
		}

		const { allowFix } = this.props;
		const { desktop, fix } = requestHeight;

		this.setState( {
			canFix: allowFix && !!fix,
			height: desktop || this.state.height,
		} );
	}

	resizeFrame( { data: { height } } ) {
		this.setState( { height: Math.round( height ) } );
	}

	render() {

		const { id, size, src, title } = this.props;
		const { canFix, fixed, fixedBottom, height } = this.state;
		const containerStyle = { height };

		return (
			<div
				className={cx( 'container' )}
				id={`container-${id}`}
				ref={ref => this.el = ref}
				style={containerStyle}
			>
				<iframe
					id={id}
					title={title}
					className={cx( 'frame', size, {
						canFix,
						fixed,
						fixedBottom,
					} )}
					name={id}
					src={changeToHttps( src )}
					frameBorder="0"
					scrolling="no"
					seamless="seamless"
					allow="autoplay; fullscreen"
				/>
			</div>
		);
	}
}

Interactive.propTypes = {
	addMessageListener: PropTypes.func.isRequired,
	addScrollListener: PropTypes.func.isRequired,
	allowFix: PropTypes.bool.isRequired,
	id: PropTypes.string.isRequired,
	size: PropTypes.oneOf( [
		'medium',
		'large',
		'extra-large',
		'full-width',
	] ).isRequired,
	src: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

Interactive.defaultProps = {
	allowFix: true,
	size: 'medium',
	src: '',
};

export default withScroll( withPostMessage( Interactive ) );
