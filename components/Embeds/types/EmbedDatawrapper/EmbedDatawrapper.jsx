import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import styles from './EmbedDatawrapper.module.scss';
import classnames from 'classnames/bind';
import withAmp from '../../../../helpers/wrappers/withAmp';
import { getAmpBool } from '../../../../helpers/amp';
import { get } from '../../../../helpers/utils';

const cx = classnames.bind( styles );

export const getId = url => url.replace( /^https?:\/\/[^\/]+\//, '' ).split( '/' )[0];

export const EmbedDatawrapper = ( {
	align,
	height: initialHeight,
	size,
	title,
	url,
} ) => {
	const [ height, setHeight ] = useState( initialHeight );
	const chartId = getId( url );
	const eventName = 'datawrapper-height';
	const timeout = useRef();
	const timestamp = useRef();

	useEffect( () => {
		const listener = ( newHeight ) => {
			if ( timeout.current ) {
				clearTimeout( timeout.current );
				timeout.current = null;
				timestamp.current = null;
			}
			// only update the height if it changes by a noticeable amount
			if ( newHeight && Math.abs( newHeight - height ) > 5 ) {
				setHeight( newHeight );
			}
		};

		const throttle = ( { data }, delay = 250 ) => {
			const newHeight = get( data, `${eventName}.${chartId}` );
			if ( !newHeight ) {
				return; // this event isn’t relevant to this chart’s height
			}
			let elapsed = 0;
			if ( timestamp.current ) {
				elapsed = Date.now() - timestamp.current;
			}
			clearTimeout( timeout.current );
			if ( ! timestamp.current || elapsed >= delay ) {
				// fire immediately on first invocation,
				// or if it’s been longer than the delay [time] from the last invocation
				listener( newHeight );
			} else {
				// otherwise schedule an invocation for the next delay interval
				timeout.current = setTimeout( () => listener( newHeight ), delay - elapsed );
			}
			timestamp.current = Date.now();
		};

		window.addEventListener( 'message', throttle );

		// when component unmounts:
		return () => {
			clearTimeout( timeout.current );
			timestamp.current = null;
			window.removeEventListener( 'message', throttle );
		};
	}, [ chartId, height ] );

	return (
		<div className={cx( 'container', size, { [ `align-${align}` ]: align } )}>
			<iframe
				className={cx( 'iframe' )}
				id={`datawrapper-chart-${chartId}`}
				title={title}
				src={url}
				scrolling="no"
				height={height}
			/>
		</div>
	);
};

const EmbedDatawrapperAmp = ( { title, url, width, height } ) => (
	<Fragment>
		<Helmet>
			<script async={undefined} custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
		</Helmet>
		<div className={cx( 'container' )}>
			<amp-iframe
				src={url}
				title={title}
				width={width}
				height={height}
				layout="responsive"
				sandbox="allow-scripts allow-same-origin"
				resizable={getAmpBool( true )}
			>
				<div overflow={getAmpBool( true )}></div>
			</amp-iframe>
		</div>
	</Fragment>
);

const sharedPropTypes = {
	align: PropTypes.oneOf( [ 'left', 'right' ] ),
	height: PropTypes.number.isRequired,
	size: PropTypes.oneOf( [
		'small',
		'medium',
		'large',
		'extra-large',
	] ),
	title: PropTypes.string,
	url: PropTypes.string.isRequired,
};

const sharedDefaultProps = {
	size: 'medium',
};

EmbedDatawrapper.propTypes = sharedPropTypes;
EmbedDatawrapperAmp.propTypes = {
	...sharedPropTypes,
	width: PropTypes.number.isRequired,
};

EmbedDatawrapper.defaultProps = sharedDefaultProps;
EmbedDatawrapperAmp.defaultProps = sharedDefaultProps;

export default withAmp( EmbedDatawrapperAmp )( EmbedDatawrapper );
