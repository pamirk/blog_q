import React from 'react';
import PropTypes from 'prop-types';
import withResize from '../../helpers/wrappers/withResize';
import { get } from '../../helpers/utils';

class Iframe extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			height: this.props.maxHeight ?? this.props.height,
		};

		this.setRef = element => this.el = element;
		this.resizeFrame = this.resizeFrame.bind( this );
		this.timeoutId = null;
	}

	componentDidMount() {
		const { resize, addResizeListener, srcDoc } = this.props;

		// polyfill for srcDoc
		if ( 'undefined' !== typeof window && !( 'srcdoc' in document.createElement( 'iframe' ) ) ) {
			const doc = this.el.contentWindow.document;

			doc.open();
			doc.write( srcDoc );
			doc.close();
		}

		if ( resize ) {
			this.resizeFrame();
			addResizeListener( this.resizeFrame );
		}
	}

	resizeFrame() {
		// https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/contentWindow
		const doc = this.el.contentWindow.document;

		// If there is already content in the iframe, resize the window now
		// Otherwise, use the iframe's onload callback
		if ( get( doc, 'body.innerHTML.length' ) ) {
			// Defer to maxHeight, if set
			this.setState( {
				height: this.props.maxHeight ?
					Math.min( this.props.maxHeight, doc.body.scrollHeight ) :
					doc.body.scrollHeight,
			} );

			// Images might still be loading, so check back.
			this.timeoutId = setTimeout( this.resizeFrame, 3000 );
		} else {
			this.el.onload = this.resizeFrame;
		}
	}

	componentWillUnmount() {
		clearTimeout( this.timeoutId );
	}

	render() {

		const {
			frameBorder,
			resize,
			scrolling,
			srcDoc,
			title,
			width,
		} = this.props;
		const { height } = this.state;
		const style = {};

		if ( resize ) {
			style.height = height;
		}

		return (
			<iframe
				frameBorder={frameBorder}
				scrolling={scrolling}
				width={width}
				height={height}
				srcDoc={srcDoc}
				style={style}
				ref={this.setRef}
				title={title}
			/>
		);
	}
}

Iframe.propTypes = {
	addResizeListener: PropTypes.func.isRequired,
	frameBorder: PropTypes.number,
	height: PropTypes.string,
	maxHeight: PropTypes.number,
	resize: PropTypes.bool,
	scrolling: PropTypes.oneOf( [ 'yes', 'no', 'auto' ] ),
	srcDoc: PropTypes.string,
	title: PropTypes.string.isRequired,
	width: PropTypes.string,
};

Iframe.defaultProps = {
	frameBorder: 0,
	scrolling: 'no',
	width: '100%',
	height: '100%',
	resize: false,
};

export default withResize( Iframe );
