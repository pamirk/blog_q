import React from 'react';
import { PageHeader, TabNav, TabNavItem } from '@quartz/interface';
import FeatureSection from 'components/FeatureSection/FeatureSection';
import Link from 'components/Link/Link';
import Page, { PageLoading } from 'components/Page/Page';
import useObsessions from 'data/hooks/useObsessions';
import { getArticleProps } from 'helpers/data/article';
import usePageVariant from 'helpers/hooks/usePageVariant';
import styles from './Obsessions.module.scss';
import withSponsoredObsessionAds from 'helpers/wrappers/withSponsoredObsessionAds';
import getMeta from 'config/meta';

function ObsessionsList( props: {
	obsessions: ReturnType<typeof useObsessions>,
	work?: boolean,
} ) {
	return (
		<div className={styles.container}>
			{
				props.obsessions?.map( obsession => (
					<FeatureSection
						key={obsession.id}
						description={obsession.shortDescription ?? ''}
						featuredImage={obsession.featuredImage ?? obsession.headerImage}
						name={obsession.name ?? ''}
						posts={obsession.posts?.nodes?.map( getArticleProps ) ?? []}
						link={`${props.work ? '/work' : ''}/on/${obsession.slug}/`}
					/>
				) )
			}
		</div>
	);
}

function Obsessions() {
	const { edition } = usePageVariant();
	const obsessions = useObsessions( 3 );

	if ( ! obsessions ) {
		return <PageLoading />;
	}

	let canonicalPath = '/obsessions/';
	if ( 'QUARTZ' !== edition ) {
		canonicalPath = `/${edition.toLowerCase()}/obsessions/`;
	}

	const description = 'These are the core obsessions that drive our newsroom—defining topics of seismic importance to the global economy.';

	return (
		<Page
			canonicalPath={canonicalPath}
			pageDescription={description}
			pageTitle="Obsessions"
			pageType="obsessions"
		>
			<PageHeader
				intro={description}
				showPadding={false}
				title="Obsessions"
			>
				<TabNav>
					<TabNavItem isActive={edition === 'QUARTZ'}>
						<Link style={{ color: 'inherit' }} to="/obsessions/">Quartz</Link>
					</TabNavItem>
					<TabNavItem isActive={edition === 'WORK'}>
						<Link style={{ color: 'inherit' }} to="/work/obsessions/">{getMeta( 'WORK' ).title}</Link>
					</TabNavItem>
				</TabNav>
			</PageHeader>
			<ObsessionsList obsessions={obsessions} work={edition === 'WORK'} />
		</Page>
	);
}

export default withSponsoredObsessionAds( Obsessions );
