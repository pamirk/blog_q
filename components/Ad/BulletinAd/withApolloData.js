// noinspection JSCheckFunctionSignatures

import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '../../../data/apollo';
import compose from '../../../helpers/compose';
import { ArticleDocument } from '../../../@quartz/content';
import { getArticleProps } from '../../../helpers/data/article';
import { withBulletinTracking } from './withSponsoredContentTracking';

const withBulletinWrapper = BulletinComponent => {

	const BulletinWrapper = ( { loading, article, error, dataProp, ownProps } ) => {

		if ( loading || error ) {
			return null;
		}

		const componentProps = { article, ...ownProps };

		componentProps[dataProp] = article;

		return <BulletinComponent {...componentProps} />;
	};

	BulletinWrapper.propTypes = {
		article: PropTypes.object,
		dataProp: PropTypes.string,
		error: PropTypes.object,
		loading: PropTypes.bool.isRequired,
		ownProps: PropTypes.object,
	};

	BulletinWrapper.defaultProps = {
		dataProp: 'article',
	};

	return BulletinWrapper;

};

const options = props => ( {
	variables: {
		id: props.bulletin.postId,
	},
} );

const mapDataToProps = ( { ownProps, data: { loading, error, posts } } ) => {

	const props = posts?.nodes?.length ? getArticleProps( posts.nodes[ 0 ] ) : {};

	let bulletin = {};

	if ( props.bulletin ) {
		bulletin = { ...props.bulletin };
		bulletin.clientTracking = { ...props.bulletin.clientTracking, ...ownProps.bulletin };
	}

	return {
		article: {
			...props,
			bulletin,
		},
		loading,
		error,
		ownProps,
	};

};

const withApolloData = graphql( ArticleDocument, { options, props: mapDataToProps } );

export default compose(
	withApolloData,
	withBulletinWrapper,
	withBulletinTracking
);

export { withApolloData, withBulletinWrapper };
