import { useEssentialsByGuideQuery } from '@quartz/content';

export default function useEssentialsByGuide ( slug, options: { ssr?: boolean } = {} ) {
	const { ssr = false } = options;
	const { data } = useEssentialsByGuideQuery( {
		variables: {
			slug,
		},
		ssr,
	} );

	return {
		essentials: data?.guides?.nodes?.[0]?.essentials?.nodes?.[0],
	};
}
