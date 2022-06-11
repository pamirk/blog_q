import useUserApi from 'helpers/hooks/useUserApi';

interface EmailUpdateArgs {
	firstName?: string,
	company?: string,
	title?: string,
	email: string,
	password: string,
}

export default function useVerifiedUserEmailUpdate() {
	const { loading, callApi } = useUserApi();

	function updateEmailWithVerification( args: EmailUpdateArgs ): Promise<any> {
		return callApi( {
			endpoint: 'verified_email',
			method: 'put',
			body: args,
		} );
	}

	return { updateEmailWithVerification, loading };
}
