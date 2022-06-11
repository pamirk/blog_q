import { useEffect, useState } from 'react';

export default function ClientOnly( props: { children: JSX.Element } ) {
	const [ isClient, setIsClient ] = useState( false );
	useEffect( () => setIsClient( true ), [] );

	if ( isClient ) {
		return props.children;
	}

	return null;
}
