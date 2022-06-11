import React from 'react';
import PropTypes from 'prop-types';
import {getQueryParams, stringifyUrlParams} from '../../helpers/urls';
import Link from "../Link/Link";

/**
 * Append the current query params to a string `to` prop.
 *
 * @param {string|object|function} to Redirect target.
 * @param {string|object|function}
 */
export const getTo = to => {
	if ( 'string' === typeof to ) {
		return to + stringifyUrlParams( getQueryParams() );
	}

	return to;
};

export const Redirect = ( {
	status,
	to,
	...props
} ) => {
	return <Link o={getTo( to )} {...props}/>
	/*return (
		<Route
			render={( { staticContext } ) => {
				// Static context only exists on the server.
				if ( staticContext ) {
					Object.assign( staticContext, { statusCode: status } );
				}

				return <ReactRouterRedirect to={getTo( to )} {...props} />;
			}}
		/>
	);*/
}

Redirect.propTypes = {
	status: PropTypes.number.isRequired,
	to: PropTypes.oneOfType( [
		PropTypes.func,
		PropTypes.string,
		PropTypes.object,
	] ).isRequired,
};

Redirect.defaultProps = {
	status: 302,
};

export default Redirect;
