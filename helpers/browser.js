import { breakpoints } from './images';

export const getBreakpoint = () => {
	const breakpointNames = Object.keys( breakpoints );
	const [ defaultBreakpoint ] = breakpointNames;

	if ( typeof window === 'undefined' || typeof window.matchMedia !== 'function' ) {
		return defaultBreakpoint;
	}

	// Find our current breakpoints by looking backwards through the breakpoints
	const mediaMatch = breakpointNames
		.reverse()
		.find( breakpoint => window.matchMedia( breakpoints[ breakpoint ].media ).matches );

	if ( mediaMatch ) {
		return mediaMatch;
	}

	return defaultBreakpoint;
};

// A convenience wrapper for the DOM API's video.canPlayType method, but without the pesky strings
// See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType
// Returns false if the browser definitely can't play the video
// 'probably' and 'maybe' will evalate to true
export const canPlayVideoType = extension => {
	const videoEl = document.createElement( 'video' );
	return !! videoEl.canPlayType( `video/${extension}` );
};
