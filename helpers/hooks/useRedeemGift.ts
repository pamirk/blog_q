import useUserApi from 'helpers/hooks/useUserApi';

export default function useRedeemGift() {
	const { callApi, loading } = useUserApi();

	function redeemGift( code: string ) {
		return callApi( {
			endpoint: `gift/${code}`,
			method: 'patch',
		} );
	}

	return { redeemGift, loading };
}
