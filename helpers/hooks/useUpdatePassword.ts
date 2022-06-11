import useUserApi from './useUserApi';

export default function useUpdatePassword(): { updatePassword: ( args: { password?: string, newPassword: string } ) => Promise<any>, loading: boolean } {

	const { loading, callApi } = useUserApi();

	function updatePassword( args: { password?: string, newPassword: string } ) {
		const body = { password: args.password, newPassword: args.newPassword };

		return callApi( {
			endpoint: 'password',
			method: 'put',
			body,
		} );
	}

	return { updatePassword, loading };
}
