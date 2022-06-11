import React, { useEffect, useMemo, useState } from 'react';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import ListWithAds from 'components/List/ListWithAds';
import { Spinner } from '@quartz/interface';
import { useContentBySearchTermQuery } from '@quartz/content';
import styles from './SearchResults.module.scss';
import { getArticleProps } from 'helpers/data/article';
import NoResults from './NoResults';

export default function SearchResults ( props: {
	search: string,
} ) {

	// Ordering in WPGraphQL is busted for search right now, making it impossible
	// for us to use a fetchMore query from Apollo. Instead, we're loading all 100
	// search results generated by our search query directly to the frontend. We will
	// revisit once WPGraphQL ships a patch release.
	const { data, loading } = useContentBySearchTermQuery( { variables: { search: props.search, limit: 100 }, errorPolicy: 'all', notifyOnNetworkStatusChange: true } );
	const [ canLoadMore, setCanLoadMore ] = useState( true );
	const [ visibleIndex, setVisibleIndex ] = useState( 9 );
	const articles = useMemo( () => data?.content?.nodes?.filter( Boolean ) || [], [ data ] );

	useEffect( () => {
		if ( ! articles.length || articles.length <= visibleIndex + 1 ) {
			setCanLoadMore( false );
		} else {
			setCanLoadMore( true );
		}
	}, [ articles, visibleIndex ] );

	if ( ! data ) {
		return (
			<div className={styles.spinner}>
				<Spinner />
			</div>
		);
	}

	if ( ! articles.length ) {
		return <NoResults />;
	}

	return (
		<>
			<ListWithAds
				ad={{
					path: 'list',
					targeting: {
						page: 'search',
					},
				}}
				collection={articles.slice( 0, visibleIndex ).map( getArticleProps )}
				isSearch={true}
			/>
			<LoadMoreButton
				fetching={loading}
				hasMorePosts={canLoadMore}
				loadMore={() => setVisibleIndex( visibleIndex + 10 )}
			/>
		</>
	);
}