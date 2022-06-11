import { useEffect, useState } from 'react';

export default function useUserProfileFields() {
	const [ industries, updateIndustries ] = useState( [] );
	const [ jobLevels, updateJobLevels ] = useState( [] );

	useEffect( () => {
		// Intentionally not using useUserApi since this endpoint does not return
		// user data. If we used useUserApi, it would update the user object in
		// Redux with null.
		fetch( '/api/user/profile_fields' )
			.then( response => response.json() )
			.then( response => {
				updateIndustries( response.industries );
				updateJobLevels( response.jobLevels );
			} )
			.catch( () => {} );
	}, [] );

	return {
		industries,
		jobLevels,
	};
}
