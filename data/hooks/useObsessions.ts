import usePageVariant from 'helpers/hooks/usePageVariant';
import { useObsessionsQuery, MenuLocationEnum } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

export default function useObsessions( posts = 1 ) {
	const { edition } = usePageVariant();
	let location: MenuLocationEnum = 'OBSESSIONS_QUARTZ';
	switch ( edition ) {
		case 'AFRICA':
			location = 'OBSESSIONS_AFRICA'; break;
		case 'INDIA':
			location = 'OBSESSIONS_INDIA'; break;
		case 'WORK':
			location = 'OBSESSIONS_WORK'; break;
	}
	const { data } = useObsessionsQuery( { variables: {
		perPage: 25,
		postsPerPage: posts,
		location,
	} } );
	return data?.menuItems?.nodes
		?.map( node => node?.connectedObject )
		.map( node => {
			if ( node?.__typename === 'Obsession' ) {
				return node; // selecting the connected type we want to help TypeScript narrow down the type
			}
			return null;
		} )
		.filter( notUndefinedOrNull );
}
