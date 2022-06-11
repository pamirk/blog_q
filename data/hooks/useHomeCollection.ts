import { useRouter } from 'next/router'
import { useHomeCollectionQuery, useHomeCollectionPreviewQuery, CollectionPartsFragment } from '@quartz/content';
import { PreviewAuthenticationError } from 'helpers/errors';

function useHomeCollectionData() {
	const router = useRouter()

	const { postId, time, token } = router.query;
	const isPreview = !! ( postId && time && token );

	// we can’t conditionally run `useQuery` React hooks; instead, using Apollo’s `skip` directive

	const { data: previewData, loading } = useHomeCollectionPreviewQuery( { skip: !isPreview, variables: {
			// @ts-ignore
		id: parseInt( postId, 10 ), time: parseInt( time, 10 ),
		token,
	} } );

	if ( isPreview && !loading && !previewData ) {
		throw new PreviewAuthenticationError;
	}

	const { data } = useHomeCollectionQuery( { skip: isPreview } );

	return data ?? previewData;
}

export default function useHomeCollection(): CollectionPartsFragment | undefined {
	const data = useHomeCollectionData()?.collections?.nodes?.[ 0 ];

	if ( data ) {
		return data;
	}

	return ;
}
