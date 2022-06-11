import { loadScriptOnce } from '../../helpers/utils';

export const processAtlasEmbeds = () => {
	if ( window.Atlas ) {
		window.Atlas.parse();
	} else {
		loadScriptOnce( 'https://www.theatlas.com/javascripts/atlas.js' );
	}
};

export const processFBEmbeds = () => {
	if ( window.FB ) {
		window.FB.XFBML.parse();
	} else {
		loadScriptOnce( 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=602231513195606' );
	}
};

export const processEmbedlyEmbeds = () => {
	if ( window.embedly ) {
		window.embedly( 'card' );
	} else {
		loadScriptOnce( 'https://cdn.embedly.com/widgets/platform.js' );
	}
};
