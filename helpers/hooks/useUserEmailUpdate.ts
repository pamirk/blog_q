import useUserApi from 'helpers/hooks/useUserApi';

export default function useUserEmailUpdate(): {
	updateUserEmail,
	loading: boolean,
	} {
	const { callApi, loading } = useUserApi();

	function updateUserEmail( email: string ): Promise<any> {
		return callApi( {
			endpoint: 'email',
			method: 'put',
			body: { email },
		} );
	}

	return { updateUserEmail, loading };
}
