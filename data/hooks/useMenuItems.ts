import { useMenuByNameQuery } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

export default function useMenuItems( name: string, first?: number ) {
	const { data } = useMenuByNameQuery( { variables: { id: name, first } } );

	return data?.menu?.menuItems?.nodes
		?.map( node => {
			// Narrow types, matching the types specified in MenuItemParts.
			if ( node?.connectedNode?.node?.__typename === 'Post' || node?.connectedNode?.node?.__typename === 'Promotion' ) {
				return node?.connectedNode?.node;
			}

			return null;
		} )
		.filter( notUndefinedOrNull );
}
