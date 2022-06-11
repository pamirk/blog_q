import { useEmailByIdQuery } from '@quartz/content';
import { encodeRelayId } from 'helpers/graphql';

export default function useEmailById( emailId: number ) {
	return useEmailByIdQuery( {
		variables: {
			id: emailId ? encodeRelayId( 'email', emailId ) : '',
		},
		skip: !emailId,
	} ).data?.email;
}
