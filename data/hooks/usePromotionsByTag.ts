import { usePromotionsByTagQuery } from '@quartz/content';

export default function usePromotionsByTag ( slug: string, perPage = 10, ssr = true, skip = false ) {
	const { data } = usePromotionsByTagQuery( {
		ssr,
		variables: {
			perPage,
			slug: [ slug ],
		},
		skip,
	} );

	return data?.promotions?.nodes || [];
}
