import useUserSettings from 'helpers/hooks/useUserSettings';
import useNotifications from 'helpers/hooks/useNotifications';
import { SUBSCRIPTION_ID } from 'helpers/types/account';
import useUserApi from 'helpers/hooks/useUserApi';

export default function useCancelSubscription() {
	const { notifyError } = useNotifications();
	const { getUserSetting } = useUserSettings();
	const { callApi, loading } = useUserApi();

	const id = getUserSetting( SUBSCRIPTION_ID );

	function cancelSubscription() {
		return callApi( {
			endpoint: 'subscription',
			method: 'delete',
			body: { id },
		} )
			.catch( () => notifyError( 'There was an error cancelling your subscription.' ) );
	}

	return { cancelSubscription, loading };
}
