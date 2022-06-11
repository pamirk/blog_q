import React from 'react';
import classnames from 'classnames/bind';
import { Engage } from '../../../components/Ad/Ad';
import PropTypes from 'prop-types';
import styles from '../List.module.scss';

const cx = classnames.bind( styles );

/* This component injects engage ads into a list of articles and bulletin ads.
We need to wrap segments of articles and bulletin ads in a div, therefore we
can't simply loop over each item and insert engage ads as siblings. */
const ListWithEngageAds = ( {
	ad: {
		path,
		targeting,
	},
	constrain,
	engageRate,
	engageStart,
	engageTileStart,
	items,
	maxEngage,
} ) => {
	let itemsWithEngage = [];

	const outerClasses = cx( 'container', { constrain } );
	const innerClasses = cx( 'items' );

	// If engageRate is set, populate the array with chunks of articles
	if ( engageRate ) {
		// Calculate how many engage ads we will need in total
		const numEngage = Math.floor( ( items.length - engageStart ) / engageRate ) + 1;

		for ( let i = 0; i <= numEngage; i++ ) {
			/* Are there flex ads remaining to be inserted?
			 - we have not reached the maxium number of engage ads (i <= maxEngage)
			 - there are still engage ads to place after this (i < numEngage) */
			const hasFlexAdsRemaining = i < maxEngage && i < numEngage;

			// Create a delicious wrapped slice of articles to add to the array.
			let articleSlice;

			if ( i === 0 ) {
				// Grab the first batch of articles based on engageStart (the starting point for ad injection)
				articleSlice = items.slice( 0, engageStart );
			} else {
				// Calculate how many items we have already added
				const cursor = ( i - 1 ) * engageRate + engageStart;
				// If there are still flex ads to add, slice a specific amount. Otherwise slice all remaining articles
				articleSlice = hasFlexAdsRemaining ? items.slice( cursor, cursor + engageRate ) : items.slice( cursor );
			}

			itemsWithEngage.push(
				<div className={outerClasses} key={`list-article-slice-${i}`}>
					<ul className={innerClasses}>
						{articleSlice}
					</ul>
				</div>
			);

			// At this point, if there are no ads remaining to be added, we should stop looping (all items have been added)
			if ( !hasFlexAdsRemaining ) {
				break;
			}

			// add the chunk of articles to itemsWithEngage followed by an Engage ad
			const tile = i + engageTileStart;
			const id = `list-engage-${tile}`;

			itemsWithEngage.push(
				<Engage
					id={id}
					key={id}
					targeting={{ ...targeting, tile }}
					path={path}
					className="list-engage"
				/>
			);
		}
	} else {
	// If engageRate is not set, return all articles as one chunk
		itemsWithEngage = (
			<div className={outerClasses}>
				<ul className={innerClasses}>
					{items}
				</ul>
			</div>
		);
	}
	return itemsWithEngage;
};

ListWithEngageAds.propTypes = {
	ad: PropTypes.object.isRequired, // ad targeting and path
	constrain: PropTypes.bool.isRequired,
	engageRate: PropTypes.number, // engage ad display interval
	engageStart: PropTypes.number, // index of the first engage ad
	engageTileStart: PropTypes.number,
	items: PropTypes.arrayOf( PropTypes.element ),
	maxEngage: PropTypes.number, // max number of engage ad units in the list
};

ListWithEngageAds.defaultProps = {
	constrain: true,
	engageRate: 7,
	engageStart: 7,
	engageTileStart: 0,
	maxEngage: 2,
};

export default ListWithEngageAds;
