import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Redirect from 'components/Redirect/Redirect';
import { getErrorContext } from 'helpers/errors';
import ErrorPage from '../pages/Error/Error';

// Punting on types for react-router props since they are not yet installed.
type ErrorBoundaryProps = {
	children: React.ReactNode,
	location: any,
	staticContext: any,
};

type ErrorBoundaryState = {
	statusCode: number,
	url: string | null,
};

// This error boundary wraps the entire App component and will catch any error
// thrown *client side* within the React lifecycle.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor( props: ErrorBoundaryProps ) {
		super( props );

		// Status code may have been set on the server and passed down.
		const {
			staticContext: {
				statusCode = 200,
			} = {},
		} = props;

		// This mirrors the properties set on react-router staticContext.
		this.state = {
			statusCode,
			url: null,
		};
	}

	// NOTE: getDerivedStateFromError is NOT called on the server in React 16.
	// On the server, we instead catch the error and do a similar inspection of
	// the error to determine what to do. See app middleware for details.
	static getDerivedStateFromError( error: Error ) {
		const errorContext = getErrorContext( error );

		// Client-side, redirects and 404s are the only errors we want to catch and
		// render. All other errors are *unexpected*. We don't want to replace a
		// broken but still potentially useful page with an unhelpful error page.
		if ( [ 301, 302, 404 ].includes( errorContext.statusCode ) ) {
			return errorContext;
		}

		return null;
	}

	// NOTE: componentDidCatch is NOT called on the server in React 16.
	componentDidCatch( error: Error ) {
		console.log( 'Error: ', error );
	}

	componentDidUpdate( { location } ) {
		// Clear error if user navigates away.
		if ( location.pathname !== this.props.location.pathname ) {
			this.setState( {
				statusCode: 200,
				url: null,
			} );
		}
	}

	render() {
		const { children, location } = this.props;
		const { statusCode, url } = this.state;

		if ( url ) {
			return <Redirect status={statusCode} to={url} />;
		}

		if ( 200 !== statusCode ) {
			return <ErrorPage location={location} statusCode={statusCode} />;
		}

		return children;
	}
}

// @ts-ignore
export default withRouter( ErrorBoundary );
