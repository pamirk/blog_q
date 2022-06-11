import useUserApi from 'helpers/hooks/useUserApi';

function useChangeCard() {
	const { loading, callApi } = useUserApi();

	function changeCard( { tokenObject } ) {
		const { id: token, card: { address_zip: addressZip, country: addressCountry } } = tokenObject || {};

		return callApi( {
			endpoint: 'billing',
			method: 'put',
			body: { addressZip, addressCountry, token },
		} );
	}

	return { loading, changeCard };
}

export default useChangeCard;
