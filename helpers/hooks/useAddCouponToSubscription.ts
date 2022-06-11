import { SUBSCRIPTION_ID } from 'helpers/types/account';
import useUserApi from 'helpers/hooks/useUserApi';
import useUserSettings from 'helpers/hooks/useUserSettings';
import useNotifications from 'helpers/hooks/useNotifications';

export default function useAddCouponToSubscription(): { addCouponToSubscription: ( couponCode: string ) => Promise<any>, loading: boolean } {
	const { getUserSetting } = useUserSettings();
	const { callApi, loading } = useUserApi();

	const id = getUserSetting( SUBSCRIPTION_ID );
	const { notifyError } = useNotifications();

	function addCouponToSubscription( couponCode: string ): Promise<any> {
		return callApi( {
			endpoint: 'subscription',
			method: 'patch',
			body: { id, data: { couponCode } },
		} )
			.catch( () => notifyError( 'There was an error adding your coupon' ) );
	}

	return { addCouponToSubscription, loading };
}
