import { useEffect, useState } from 'react';
import useUserApi from './useUserApi';
import useClientSideUserData from './useClientSideUserData';
import useNotifications from './useNotifications';
import useStableSignature from '../../helpers/hooks/useStableSignature';

function useMagicLinkRedemption( token ) {
	const { callApi, loading } = useUserApi();
	const { isLoggedIn } = useClientSideUserData();

	const [ error, setError ] = useState( null );

	const { notifyError, notifySuccess } = useNotifications();

	const redeemMagicLinkWithToken = useStableSignature( () => {
		function redeemMagicLink( { token } ) {
			if ( isLoggedIn ) {
				return;
			}

			setError( null );

			return callApi( {
				endpoint: 'login/magic',
				method: 'post',
				body: { token },
			} );
		}

		if ( token ) {
			redeemMagicLink( { token } )
				.then( () => notifySuccess( 'You’re logged in!' ) )
				.catch( message => {
					setError( message );
					notifyError( 'An error occurred and we couldn’t log you in.' );
				} );
		}
	} );

	useEffect( () => {
		redeemMagicLinkWithToken();
	}, [ redeemMagicLinkWithToken, token ] );

	return { loading, error };
}

export default useMagicLinkRedemption;
