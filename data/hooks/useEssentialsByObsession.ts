import { useEssentialsByObsessionQuery } from '@quartz/content';

export default function useEssentialsByObsession ( slug, options: { ssr?: boolean } = {} ) {
	const { ssr = false } = options;
	const { data } = useEssentialsByObsessionQuery( {
		variables: {
			slug,
		},
		ssr,
	} );

	return {
		essentials: data?.obsessions?.nodes?.[0]?.essentials?.nodes?.[0],
	};
}
