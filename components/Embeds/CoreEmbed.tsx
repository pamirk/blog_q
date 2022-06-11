import React from 'react';
import EmbedSpotify from './types/EmbedSpotify';
import EmbedVimeo from './types/EmbedVimeo/EmbedVimeo';
import EmbedYoutube from './types/EmbedYoutube';
import Twitter from 'components/Twitter/Twitter';
import useInView from 'helpers/hooks/useInView';

function embedComponent( slug: string ): ( ( props: any ) => JSX.Element | null ) | null  | any{
	switch ( slug ) {
		case 'spotify': return EmbedSpotify;
		case 'twitter': return Twitter;
		case 'vimeo': return EmbedVimeo;
		case 'youtube': return EmbedYoutube;
		default: return null;
	}
}

/**
 * Lighter alternative to `EmbeddedContent` for embeds from our Gutenberg editor (Nug, Collection).
 * Gutenberg groups all embeds under the `CORE_EMBED` type so the type of each embed block
 * has to be inferred from the `providerNameSlug` in that block’s properties.
 */
export default function CoreEmbed( props: {
	[k: string]: any
 } & {
	postId?: number;
	providerNameSlug?: string;
	url?: string;
 }
) {
	const [ ref, visible ] = useInView( { rootMargin: '300px' } );

	if ( !props.providerNameSlug ) {
		return null;
	}

	const EmbeddedComponent = embedComponent( props.providerNameSlug );

	if ( !EmbeddedComponent ) {
		return null;
	}

	if ( !visible ) {
		return <div ref={ref} />;
	}

	return (
		<div ref={ref}>
			<EmbeddedComponent {...props} />
		</div>
	);
}
