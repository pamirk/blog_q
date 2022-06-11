import useUserApi from './useUserApi';
import { useState } from 'react';

const useMagicLinkRequest = () => {
	const { loading, callApi } = useUserApi();

	const [ error, setError ] = useState( null );

	function requestMagicLink( { email, redirectTo } ) {
		setError( null );
		return callApi( {
			endpoint: 'magic-link',
			method: 'post',
			body: { email, redirectTo },
		} ).catch( message => setError( message ) );
	}

	return { requestMagicLink, loading, error };
};

export default useMagicLinkRequest;
