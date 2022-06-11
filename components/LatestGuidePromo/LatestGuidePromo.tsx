import React from 'react';
import { FeatureCard } from '@quartz/interface';
import Link from 'components/Link/Link';
import useGuides from 'data/hooks/useGuides';

const LatestGuidePromo = () => {
	const data = useGuides( { perPage: 1 } );

	if ( ! data.guides?.length ) {
		return null;
	}

	const [
		{
			featuredImage,
			link,
			name,
			shortDescription,
		},
	] = data.guides;

	if ( ! featuredImage || ! link || ! name ) {
		return null;
	}

	return (
		<Link to={link}>
			<FeatureCard
				thumbnailUrl={featuredImage.sourceUrl || ''}
				title={name}
				description={shortDescription || ''}
				size="small"
				isPortrait
			/>
		</Link>
	);
};

export default LatestGuidePromo;
