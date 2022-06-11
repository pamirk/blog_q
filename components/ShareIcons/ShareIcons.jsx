import React from 'react';
import PropTypes from 'prop-types';
import ShareIcon from './ShareIcon';
import getLinks from '../../config/links';
import getMeta from '../../config/meta';
import usePageVariant from '../../helpers/hooks/usePageVariant';
import { getShortUrl } from '../../helpers/urls';

const ShareIcons = ( {
	author,
	customURLs,
	description,
	isBulletin,
	services,
	title,
	trackingData,
	url,
} ) => {
	const { edition } = usePageVariant();
	const { twitterName, title: siteTitle } = getMeta( edition );
	const { subscription } = getLinks( edition );

	// URL-encode share text so it doesn't break older browsers.
	const encodedShortUrl = encodeURIComponent( getShortUrl( url ) );
	const encodedTitle = encodeURIComponent( title );
	const encodedUrl = encodeURIComponent( url );
	const encodedVia = isBulletin ? 'QuartzCreative' : encodeURIComponent( twitterName );

	const getShareUrl = service => {
		if ( customURLs?.[service] ) {
			// sometimes marketing requests variable copy between services
			// N.B. carefully validate the custom URL for service
			return customURLs[service];
		}

		let shareUrl = '';

		switch ( service ) {
			case 'email':
				const encodedPrefix = encodeURIComponent( `${siteTitle}: ` );
				shareUrl = `mailto:?subject=${encodedPrefix}${encodedTitle}&body=`;

				// put a short description before the link, if it exists
				if ( description ) {
					shareUrl += encodeURIComponent( `${description}\n\n` );
				}

				shareUrl += encodedUrl;

				if ( subscription ) {
					shareUrl += encodeURIComponent( `\n\n${subscription.name}: ${subscription.url}` );
				}

				break;

			case 'sms':
				shareUrl = 'sms:?&body=';

				if ( encodedTitle ) {
					shareUrl += encodeURIComponent( encodedTitle );
				}

				if ( description ) {
					shareUrl += encodeURIComponent( `\n\n${description}` );
				}

				shareUrl = shareUrl += `\n\n${encodedUrl}`;

				break;

			case 'facebook':
				shareUrl = `https://www.facebook.com/sharer.php?u=${encodedUrl}&caption=qz.com`;

				if ( author ) {
					shareUrl += encodeURIComponent( ` | By ${author}` );
				}
				break;

			case 'linkedin':
				shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;

				if ( description ) {
					shareUrl += `&summary=${encodeURIComponent( description )}`;
				}
				break;

			case 'twitter':
				shareUrl = `https://twitter.com/intent/tweet?url=${encodedShortUrl}&text=${encodedTitle}&via=${encodedVia}`;
				break;

			case 'whatsapp':
				shareUrl = `whatsapp://send?text=From%20${siteTitle}%3A%20${title}+${url}`;
				break;
		}

		return shareUrl;
	};

	return services.map( service => (
		<ShareIcon
			key={service}
			service={service}
			url={getShareUrl( service )}
			trackingData={trackingData}
		/>
	) );
};

ShareIcons.propTypes = {
	author: PropTypes.string,
	customURLs: PropTypes.object,
	description: PropTypes.string,
	isBulletin: PropTypes.bool.isRequired,
	services: PropTypes.arrayOf( PropTypes.string ).isRequired,
	title: PropTypes.string.isRequired,
	trackingData: PropTypes.object,
	url: PropTypes.string.isRequired,
};

ShareIcons.defaultProps = {
	isBulletin: false,
};

export default ShareIcons;
