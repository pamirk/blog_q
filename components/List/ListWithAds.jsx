import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import BulletinList from './BulletinList/BulletinList';
import { ListItem } from '../../components/List/List';
import ListWithEngageAds from './ListWithEngageAds/ListWithEngageAds';
import { withApollo } from '../../data/apollo';
import { getArticleProps } from '../../helpers/data/article';
import { dedupeCollection } from '../../helpers/utils';
import { ArticleOrBulletinTeaserDocument } from '../../@quartz/content';
import { withBulletinTracking } from '../../components/Ad/BulletinAd/withSponsoredContentTracking';

const ListItemWithBulletinTracking = withBulletinTracking( ListItem );

export class ListWithAds extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			bulletins: [],
		};

		this._handleBulletinData = this._handleBulletinData.bind( this );
		this._fetchBulletinData = this._fetchBulletinData.bind( this );
		this._parseAndSetBulletins = this._parseAndSetBulletins.bind( this );
	}

	_fetchBulletinData( postId ) {
		const { client } = this.props;

		return client.query( {
			query: ArticleOrBulletinTeaserDocument,
			variables: {
				id: postId,
			},
		} );
	}

	_parseAndSetBulletins( post, pos ) {
		const { bulletins } = this.state;
		const bulletin = getArticleProps( post );
		const sortedBulletins = [ ...bulletins, { data: bulletin, pos: pos } ].sort( ( bulletinA, bulletinB ) => bulletinA.pos > bulletinB.pos );

		this.setState( {
			bulletins: sortedBulletins,
		} );
	}

	_handleBulletinData( pos, data ) {
		// handleBulletinData can return undefined when the ad is empty
		if ( data ) {
			this._fetchBulletinData( data.postId )
				.then( response => {
					this._parseAndSetBulletins( response.data.posts?.nodes?.[0], pos );
				} ) // format bulletin data to articleProps and update the bulletins state array
				.catch( err => {
					console.error( 'Could not fetch bulletin data', err );
				} );
		}
	}

	render() {
		const { bulletins } = this.state;
		const { collection, isSearch } = this.props;

		// Remove duplicates from the article collection
		const uniqueCollection = dedupeCollection( collection );

		// Insert bulletin data into the collection in the correct order
		const articles = bulletins
			.reduce( ( items, bulletin ) => [ ...items.slice( 0, bulletin.pos ), bulletin.data, ...items.slice( bulletin.pos ) ], uniqueCollection );
			// Loop through the articles and return the appropriate components based on whether or not the item is a bulletin
		const items = articles.map( ( element, i ) => {
			const key = `${element.id}-${i}`;
			const sharedProps = {
				article: element,
				element: element,
				initialVisibility: i < 5,
			};

			if ( element.bulletin ) {
				return (
					<ListItemWithBulletinTracking
						key={key}
						{...sharedProps}
					/>
				);
			}

			return (
				<ListItem
					key={key}
					isSearch={isSearch}
					{...sharedProps}
				/>
			);
		} );

		return (
			<Fragment>
				<ListWithEngageAds
					items={items}
					{...this.props}
				/>
				<BulletinList
					handleBulletinData={this._handleBulletinData}
					articleCount={articles.length}
					{...this.props}
				/>
			</Fragment>
		);
	}
}

ListWithAds.propTypes = {
	ad: PropTypes.object.isRequired,
	bulletinRate: PropTypes.number, // bulletin ad display interval
	bulletinStart: PropTypes.number, // the index at which bulletins start
	bulletinTileStart: PropTypes.number,
	client: PropTypes.object.isRequired,
	collection: PropTypes.arrayOf( PropTypes.object ).isRequired,
	engageRate: PropTypes.number, // engage ad display interval
	engageStart: PropTypes.number, // index of the first engage ad
	engageTileStart: PropTypes.number,
	isSearch: PropTypes.bool,
	maxBulletin: PropTypes.number, // max number of bulletins in the list
	maxEngage: PropTypes.number, // max number of engage ad units in the list
};

ListWithAds.defaultProps = {
	bulletinRate: 7,
	bulletinStart: 2,
	bulletinTileStart: 1,
	engageRate: 7,
	engageStart: 7,
	engageTileStart: 0,
	isSearch: false,
	maxBulletin: 2,
	maxEngage: 2,
};

export default withApollo( ListWithAds );
