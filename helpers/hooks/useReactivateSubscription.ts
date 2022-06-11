import useNotifications from 'helpers/hooks/useNotifications';
import { SUBSCRIPTION_ID } from 'helpers/types/account';
import useUserApi from 'helpers/hooks/useUserApi';
import useUserSettings from 'helpers/hooks/useUserSettings';

export default function useReactivateSubscription(): { reactivateSubscription: () => Promise<any>, loading: boolean }  {
	const { notifyError } = useNotifications();
	const { getUserSetting } = useUserSettings();
	const { callApi, loading } = useUserApi();

	function reactivateSubscription(): Promise<any> {
		// This is the patch that will "uncancel" a subscription.
		const data = {
			cancelAtPeriodEnd: false,
		};

		const id = getUserSetting( SUBSCRIPTION_ID );
		return callApi( {
			endpoint: 'subscription',
			method: 'patch',
			body: { data, id },
		} )
			.catch( () => notifyError( 'An error occurred and we couldn’t reactivate your subscription.' ) );
	}

	return { reactivateSubscription, loading };
}
