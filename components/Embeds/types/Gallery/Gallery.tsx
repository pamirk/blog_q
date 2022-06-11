import React, { Fragment } from 'react';
import ArticleImage from 'components/ArticleImage/ArticleImage';
import { useMediaItemsByIdQuery } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

export default function Gallery ( props: { ids: string } = { ids: '' } ) {
	const intIds = props.ids.split( /[,\\s]+/ )
		.map( id => parseInt( id, 10 ) )
		.filter( Boolean )
		.map( String );
	const images = useMediaItemsByIdQuery( { variables: { ids: intIds } } )
		.data?.mediaItems?.nodes?.filter( notUndefinedOrNull );

	if ( ! images ) {
		return null;
	}

	return (
		<Fragment>
			{
				images.map( ( { altText, id, mediaDetails, sourceUrl, ...props } ) => (
					<ArticleImage
						alt={altText}
						height={mediaDetails?.height}
						key={id}
						size="large"
						url={sourceUrl}
						width={mediaDetails?.width}
						{...props}
					/>
				) )
			}
		</Fragment>
	);
}
