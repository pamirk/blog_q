// number of blocks you must have to insert an ad
const minimumBlocks = 4;

// how many text blocks must appear at the start and end
const offset = 2;

// number of blocks between inline ads
const blocksBetweenAds = 3;

// total number of ads that can be inserted
const maxAds = 6;

// how many characters a text block has to have to be counted
const minimumCharacterCount = 140;

/**
 * Find the starting index position for the ads
 *
 * @param  {Array} blocks
 * @return {Int}
 */
export const findStart = ( blocks ) => {

	let count = 0;
	let index = 0;

	for ( let i = 0; i < blocks.length; i++ ) {

		// must be a text block
		if ( 'P' === blocks[i].type ) {
			const blockProps = ( blocks[i].attributes || [] ).reduce( ( acc, obj ) => ( { ...acc, [obj.name]: obj.value } ), {} );

			// must have a minimum character count
			if ( blockProps.characterCount >= minimumCharacterCount ) {
				count++;
			}
		}

		// we've found x text blocks, the first available position is the index after the current one
		if ( offset === count ) {
			index = i + 1;
			break;
		}
	}

	return index;
};

/**
 * Ensure that the blocks before and after the index are text blocks
 *
 * @param  {Array} blocks
 * @param  {Int} index
 * @return {Bool}
 */
export const canInsertAd = ( blocks, index ) => {

	const prevIndex = index - 1;
	const nextIndex = index + 1;

	// index is within range
	if ( index < offset || index > blocks.length - 1 ) {
		return false;
	}

	// must have a minimum number of blocks
	if ( blocks.length < minimumBlocks ) {
		return false;
	}

	// there must be one block after the current index
	// when the ad is inserted, the current index + the one after it will be shifted
	if ( ! blocks[nextIndex] ) {
		return false;
	}

	// make sure the adjacent blocks are text blocks
	// because of the way that Array.splice works, the "previous" block will be the passed index minus 1
	// where as the "next" block will be the current index
	if (
		blocks[prevIndex] && blocks[prevIndex].type !== 'P' ||
		blocks[index] && blocks[index].type !== 'P'
	) {
		return false;
	}

	// make sure the nearest neighbors of the adjacent block are not images
	if (
		blocks[index - 2] && blocks[index - 2].type === 'SHORTCODE_CAPTION' ||
		blocks[nextIndex] && blocks[nextIndex].type === 'SHORTCODE_CAPTION'
	) {
		return false;
	}

	// none of the previous 4 blocks are already ads
	for ( let i = prevIndex; i > prevIndex - blocksBetweenAds; i-- ) {
		if ( blocks[i] && blocks[i].type === 'AD' ) {
			return false;
		}
	}

	return true;
};

/**
 * Helper to insert the ad object into blocks
 *
 * @param  {Array} blocks
 * @param  {Int} index
 * @return {Void}
 */
const insertAd = ( blocks, index ) => {
	blocks.splice( index, 0, {
		type: 'AD',
	} );
};

/**
 * Places ads within the blocks based on config values
 *
 * @param  {Array}  blocks
 * @param  {Object} ArticleContent props
 * @return {Array}
 */
 const ads = ( blocks, { paywallType } ) => {
	if ( paywallType ) {
		return blocks;
	}

	// Find the first position where we can insert an ad. The starting index
	// cannot be 0.
	const start = findStart( blocks );
	if ( 0 === start ) {
		return blocks;
	}

	// unseal the array by making a new one
	const newBlocks = [ ...blocks ];
	const adIndexes = [];

	let len = newBlocks.length;
	let insertedAds = 0;
	let lastAdIndex = 0;

	// the starting index cannot be 0
	for ( let i = start; i < len; i++ ) {
		// If we've already inserted the maximum number of ads, break.
		if ( insertedAds >= maxAds ) {
			break;
		}

		// If we can't insert an ad, try the next slot.
		if ( ! canInsertAd( newBlocks, i ) ) {
			continue;
		}

		insertAd( newBlocks, i );

		lastAdIndex = i;
		insertedAds++;
		len++;
		adIndexes.push( lastAdIndex );
	}

	return newBlocks;
};
export default ads;