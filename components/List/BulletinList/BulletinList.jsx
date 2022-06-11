import React from 'react';
import BulletinAd from '../../../components/Ad/BulletinAd/BulletinAd';
import PropTypes from 'prop-types';

/* This component generates an array of bulletin ad units (see BulletinAd.jsx and Ad.jsx)
When the ad component is mounted, onBulletinData will fetch the bulletin data,
parse it, and set it to state on ListWithAds to be used in future renders */
const BulletinList = ( {
	ad: {
		path,
		targeting,
	},
	articleCount,
	bulletinRate,
	bulletinStart,
	bulletinTileStart,
	handleBulletinData,
	maxBulletin,
} ) => {
	const bulletinAds = [];
	const numBulletin = Math.floor( articleCount / bulletinRate );
	const bulletinNum = Math.min( numBulletin, maxBulletin );
	let i = 0;

	for ( i = 0; i < bulletinNum; i += 1 ) {
		const pos = i * ( bulletinRate + 1 ) + bulletinStart;
		const tile = i + bulletinTileStart;

		bulletinAds.push( <BulletinAd
			id={`bulletin-${i}`}
			path={path}
			key={`bulletin-${pos}`}
			targeting={{ ...targeting, tile }}
			onBulletinData={handleBulletinData.bind( undefined, pos )}
		/> );
	}

	return bulletinAds;
};

BulletinList.propTypes = {
	ad: PropTypes.object.isRequired, // ad targeting and path
	articleCount: PropTypes.number,
	bulletinRate: PropTypes.number, // bulletin ad display interval
	bulletinStart: PropTypes.number, // index of the first bulletin ad
	bulletinTileStart: PropTypes.number,
	handleBulletinData: PropTypes.func,
	maxBulletin: PropTypes.number, // max number of bulletins in the list
};

BulletinList.defaultProps = {
	articleCount: 0,
	bulletinRate: 7,
	bulletinStart: 2,
	bulletinTileStart: 1,
	maxBulletin: 2,
};

export default BulletinList;
