import { useQuery } from 'data/apollo';
import getUpdateQuery from 'data/apollo/getUpdateQuery';
import { EmailsByListDocument } from '@quartz/content';
import { ResourceNotFoundError } from 'helpers/errors';

export default function useEmailsByList ( slug: string, tags: Array<string> = [], ssr = true, perPage = 10 ) {
	const queryOptions = {
		notifyOnNetworkStatusChange: true, // needed to get an accurate loading prop on fetchMore
		ssr,
		variables: {
			perPage: perPage,
			slug,
			tags,
		},
	};

	const { data, error, fetchMore, loading } = useQuery( EmailsByListDocument, queryOptions );

	if ( error ) {
		throw error;
	}

	const emailList = data?.emailLists?.nodes?.[0];

	if ( ! emailList && ! loading ) {
		throw new ResourceNotFoundError();
	}

	return {
		emailList,
		emails: emailList?.emails?.nodes,
		fetchMore: () => fetchMore( {
			variables: {
				...queryOptions.variables,
				after: emailList?.emails?.pageInfo?.endCursor,
			},
			// @ts-ignore
			updateQuery: getUpdateQuery( 'emailLists.nodes[0].emails.nodes' ),
		} ),
		hasMore: emailList?.emails?.pageInfo?.hasNextPage,
		loading,
	};
}
