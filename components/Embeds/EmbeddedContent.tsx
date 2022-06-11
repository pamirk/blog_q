import React from 'react';
import EmbedAtlas from './types/EmbedAtlas';
import EmbedDatawrapper from './types/EmbedDatawrapper/EmbedDatawrapper';
import EmbedDocumentCloud from './types/EmbedDocumentCloud';
import EmbedFacebook from './types/EmbedFacebook';
import EmbedFacebookVideo from './types/EmbedFacebookVideo';
import EmbedReddit from './types/EmbedReddit';
import EmbedScribd from './types/EmbedScribd';
import EmbedSoundcloud from './types/EmbedSoundcloud';
import EmbedSpotify from './types/EmbedSpotify';
import EmbedTikTok from './types/EmbedTikTok';
import EmbedVimeo from './types/EmbedVimeo/EmbedVimeo';
import EmbedYoutube from './types/EmbedYoutube';
import EmbedObjects from './types/EmbedObjects';
import Gallery from './types/Gallery/Gallery';
import useInView from 'helpers/hooks/useInView';

import {
	processAtlasEmbeds,
	processFBEmbeds,
	processEmbedlyEmbeds,
} from './embedScripts';

const getMappings = ( type: string )=> {
	switch ( type ) {
		case 'EMBED_ATLAS':
		case 'SHORTCODE_QZ_ATLAS':
			return {
				component: EmbedAtlas,
				script: processAtlasEmbeds,
			};
		case 'EMBED_DOCUMENTCLOUD':
			return {
				component: EmbedDocumentCloud,
			};
		case 'EMBED_TIKTOK':
			return {
				component: EmbedTikTok,
			};
		case 'EMBED_YOUTUBE':
		case 'SHORTCODE_YOUTUBE':
		case 'EMBED_WPCOM_YOUTUBE_EMBED_CRAZY_URL':
			return {
				component: EmbedYoutube,
			};
		case 'EMBED_FACEBOOK_ALTERNATE':
		case 'EMBED_FACEBOOK_PHOTO':
		case 'SHORTCODE_QZ_FACEBOOK_POST':
			return {
				component: EmbedFacebook,
				script: processFBEmbeds,
			};
		case 'EMBED_FACEBOOK_ALTERNATE_VIDEO':
		case 'EMBED_FACEBOOK_VIDEO':
		case 'SHORTCODE_QZ_FACEBOOK_VIDEO':
			return {
				component: EmbedFacebookVideo,
				script: processFBEmbeds,
			};
		case 'EMBED_VIMEO':
		case 'EMBED_WPCOM_VIMEO_EMBED_URL':
			return {
				component: EmbedVimeo,
			};
		case 'EMBED_QZ_OBJECT':
			return {
				component: EmbedObjects,
			};
		case 'EMBED_REDDIT':
			return {
				component: EmbedReddit,
				script: processEmbedlyEmbeds,
			};
		case 'EMBED_SOUNDCLOUD':
			return {
				component: EmbedSoundcloud,
			};
		case 'EMBED_SPOTIFY':
			return {
				component: EmbedSpotify,
			};
		case 'EMBED_SCRIBD':
		case 'SHORTCODE_SCRIBD':
			return {
				component: EmbedScribd,
			};
		case 'SHORTCODE_GALLERY':
			return {
				component: Gallery,
			};
		case 'EMBED_DATAWRAPPER':
		case 'SHORTCODE_QZ_DATAWRAPPER':
			return {
				component: EmbedDatawrapper,
			};
		default:
			return {};
	}
};

export default function EmbeddedContent(
	props: {
		isAmp: boolean,
		postId?: number;
		type: string;
	}
) {
	const [ ref, visible ] = useInView( { rootMargin: '300px' } );
	const { script, component: EmbeddedComponent } = getMappings( props.type );

	if ( !EmbeddedComponent ) {
		return null;
	}

	// if it's AMP, load the script and embed regardless of visibility
	if ( !props.isAmp && !visible ) {
		return <div ref={ref} />;
	}

	if ( 'object' === typeof window ) {
		script?.();
	}

	return (
		<div ref={ref}>
			<EmbeddedComponent {...props} />
		</div>
	);
}
