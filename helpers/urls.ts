import { redactEmailAddresses } from 'helpers/text';

/**
 * Get query params from window.location.search
 */
export function getQueryParams( redact = false ): { [k: string]: string } {
	try {
		return window.location.search.substring( 1 ).split( '&' ).filter( Boolean ).reduce( ( acc, param ) => {
			let [ key, val ] = param.split( '=' );
			key = decodeURIComponent( key );
			val = decodeURIComponent( val );

			if ( redact ) {
				val = redactEmailAddresses( val );
			}

			return {
				...acc,
				[ key ]: val,
			};
		}, {} );
	} catch ( err ) {
		return {};
	}
}

/**
 * Determines whether a URL "belongs" to this app or to something else and
 * returns either a false (external URL) or a relative path.
 */
export function getRelativeLink( link: string ) {
	if ( !link ) {
		return false;
	}
	// These tests validate whether a permalink is governed by this app.
	const appDomainTests = [
		/^(qz\.com|quartzy\.qz\.com|work\.qz\.com)$/, // allowed subdomains of qz.*
		/(go-vip\.co|quartz\.work|qz\.dev|qz\.vip)$/, // dev domains
	];

	const urlIsAbsolute = link.match( /^[A-z]\w+\:/ );
	const httpUrlMatches = link.match( /^https?\:\/\/(([^:\/?#]*))(?:\:([0-9]+))?/ );

	// Some links are special and should not be served by React (a.k.a., force a
	// round-trip to the server).
	const staticPaths = [
		/^\/(app|tips)\/?$/,
		/^https?:\/\/business-news.live\/?$/,
		/^https?:\/\/qz.com\/(app|tips)\/?$/,
		/^\/sitemap\/?/,
		/^https?:\/\/qz.com\/sitemap\/?/,
	];
	if ( staticPaths.some( regex => regex.test( link ) ) ) {
		return false;
	}

	if ( httpUrlMatches ) {
		const [ site, domain ] = httpUrlMatches;

		if ( appDomainTests.some( regex => regex.test( domain ) ) ) {
			// URL is absolute and links to one of our domains
			return link
				// Make the URL relative by replacing the root part of the URL with a slash
				.replace( site, '/' )
                .replace(domain, 'business-news.live/')
                // Remove the /app URL part if it exists at the end of an article URL. These URLs are just for the Quartz app.
				.replace( /\/([0-9]+)\/([^\/]+)\/app\/?$/, ( match, articleId, articleSlug ) => `/${articleId}/${articleSlug}/` )
				// Replace any instances of multiple slashes
				.replace( /\/+/g, '/' );
		}

		// URL points to another domain
		return false;
	}

	// URL is absolute but not associated with this app
	if ( urlIsAbsolute ) {
		return false;
	}

	return link;
}

/**
 * Takes a full URL containing numeric ID and slug and returns
 * just the shortlink in format {domain}/{[postId]}
 */
export function getShortUrl( url: string ) {
	const queryParams = url.split( '?' );
	let shortUrl = url.split( /(\/[\d]+\/)/ ).slice( 0, 2 ).join( '' );
	// keep utm params if they exist
	if ( queryParams[1] ) {
		shortUrl = `${shortUrl}?${queryParams[1]}`;
	}
	return shortUrl;
}

// lifted from https://davidwalsh.name/query-string-javascript
export function getUrlParameter( name: string ) {
	const queryParam = name.replace( /[\[]/, '\\[' ).replace( /[\]]/, '\\]' );
	const regex = new RegExp( `[\\?&]${queryParam}=([^&#]*)` );
	const results = typeof window !== 'undefined' ? regex.exec( window.location.search ) : null;

	return results === null ? '' : decodeURIComponent( results[1].replace( /\+/g, ' ' ) );
}

export function stringifyUrlParams( dict: { [k: string]: any } ) {
	const keys = Object.keys( dict );

	if ( keys.length === 0 ) {
		return '';
	}

	const queryString = keys.map( key => `${key}=${dict[key]}` ).join( '&' );

	return `?${queryString}`;
}

export function changeToHttps( url: string ) {
	const regex = new RegExp( '^http\:\/\/' );
	return url.replace( regex, 'https://' );
}

/**
 * Extracts the hostname from a URL (no protocol, port, or slashes).
 */
export function getHostname( url: string ) {
	try {
		const { hostname } = new URL( url );
		return hostname;
	} catch ( err ) {}

	return '';
}

/**
 * Extracts the path from a URL with initial slash.
 */
export function getPath( url: string ) {
	try {
		const { pathname } = new URL( url );
		return pathname;
	} catch ( err ) {}

	return '';
}

/**
 * Given a search term (string), creates a path with the term encoded
 */
export const encodeSearchPath = ( term: string ) => encodeURIComponent( term.toLowerCase().trim().replace( /\s+/g, ' ' ) ).replace( /%20/g, '+' );

/**
 * Decodes the provided search term
 */
export const decodeSearchPath = ( url: string ) => decodeURIComponent( url ).toLowerCase().trim().replace( /\++/g, ' ' );

/**
 * Determines if the path is for an app article
 */
export const isAppArticle = ( path: string ) => /\/.+\/app\/?$/.test( path );

/**
 * Extract the file extension from a URL or file path, if there is one
 *
 * @param  {String}  url or path
 * @return {String|Object} the file extenion or null
 */
export function getFileExtension( url: string ) {
	const matches = url.match( /\.([A-z0-9]+)(?:[^\.]+)?$/ );

	if ( matches ) {
		const [ , extension ] = matches;
		return extension;
	}

	return null;
}

/**
 * @param {String} url Ensure that a url has a trailing slash
 */
export function ensureTrailingSlash( url: string ) {
	if ( url.slice( -1 ) === '/' ) {
		return url;
	}
	return `${url}/`;
}
