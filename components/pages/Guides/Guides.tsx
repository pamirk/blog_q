import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FeatureCard, PageHeader, Spinner, TabNav, TabNavItem, TextInput } from '@quartz/interface';
import NoResults from 'components/SearchResults/NoResults';
import LandingPagePromoModule from 'components/LandingPagePromoModule/LandingPagePromoModule';
import Link from 'components/Link/Link';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import Page, { PageLoading } from 'components/Page/Page';
import { abbreviateTopicName } from 'config/dictionaries';
import useGuides from 'data/hooks/useGuides';
import { useGuidesByTopicQuery, useTopicsQuery } from '@quartz/content';
import { notUndefinedOrNull } from 'helpers/typeHelpers';
import { useDebouncedCallback } from 'use-debounce';
import styles from './Guides.module.scss';

function Placeholder () {
	return (
		<div className={styles.loading}>
			<Spinner />
		</div>
	);
}

const title = 'Field Guides';
const pageType = 'field-guides';
const socialImage = 'https://cms.qz.com/wp-content/uploads/2019/05/guides_social.gif';

function getDescription ( topic?: string | null ) {
	if ( !topic ) {
		return 'Here are all of our field guides to the industries, companies, and phenomena that are changing the state of play in business.';
	}

	return `Quartz field guides on ${topic.toLowerCase()}.`;
}

function AllGuides () {
	const [ searchFieldInput, setSearchFieldInput ] = useState<string | null>( null );
	const [ search, setSearch ] = useState<string | null>( null );
	const throttledSearch = useDebouncedCallback( ( value: string | null ) => setSearch( value ), 300 );

	const data = useGuides( { search } );

	if ( ! data ) {
		return <Placeholder />;
	}

	const { fetchMore, guides, loading, startCursor, hasPreviousPage } = data;

	function onSubmit( event: React.FormEvent<HTMLFormElement> ) {
		event.preventDefault();
		throttledSearch.cancel();
		setSearch( searchFieldInput );
	}

	return (
		<>
			<form className={styles['search-container']} onSubmit={onSubmit}>
				<TextInput
					id="search"
					type="search"
					placeholder={`Search all ${title}`}
					value={searchFieldInput ?? ''}
					onChange={( { currentTarget: { value } } ) => {
						setSearchFieldInput( value );
						if ( ! value ) { // if the search is empty, immediately send
							throttledSearch.cancel();
							setSearch( null );
						} else { // otherwise throttle the search
							throttledSearch( value );
						}
					}}
					autoComplete="off"
				/>
			</form>
			{
				data.loading && !guides?.length &&
				<Placeholder />
			}
			{
				! data.loading && !guides?.length && !! search &&
				<NoResults />
			}
			<ul className={styles['guides-list']}>
				{
					guides?.map( ( { featuredImage, id, link, shortDescription, name } ) => (
						<li
							className={styles['guide-item']}
							key={id}
						>
							<Link to={link}>
								<FeatureCard
									thumbnailUrl={featuredImage?.sourceUrl || ''}
									title={name || ''}
									description={shortDescription || ''}
									size="medium"
									isPortrait
								/>
							</Link>
						</li>
					) )
				}
			</ul>
			<LoadMoreButton
				fetching={loading}
				hasMorePosts={hasPreviousPage ?? false}
				loadMore={() => fetchMore( { variables: { before: startCursor } } )}
			/>
		</>
	);
}

function GuidesByTopic ( props: {
	topic: string,
} ) {
	const { data } = useGuidesByTopicQuery( { variables: { slug: [ props.topic ] } } );
	const guides = data?.topics?.nodes?.[0]?.guides?.nodes
		?.filter( notUndefinedOrNull )
		?.filter( guide => !!guide?.count );

	if ( ! guides ) {
		return <Placeholder />;
	}

	return (
		<ul className={styles['guides-list']}>
			{
				guides.map( ( { featuredImage, id, link, shortDescription, name } ) => (
					<li
						className={styles['guide-item']}
						key={id}
					>
						<Link to={link}>
							<FeatureCard
								thumbnailUrl={featuredImage?.sourceUrl || ''}
								title={name || ''}
								description={shortDescription || ''}
								size="medium"
								isPortrait
							/>
						</Link>
					</li>
				) )
			}
		</ul>
	);
}

export default function Guides () {
	let topic = useRouter().query.topic;
	topic = topic && topic[0]
	const topics = useTopicsQuery({})?.data?.topics?.nodes?.filter( notUndefinedOrNull );

	if ( ! topics ) {
		return <PageLoading />;
	}

	let canonicalPath = '/guides/';
	let topicName = '';
	if ( topic ) {
		canonicalPath = `${canonicalPath}${topic}/`;
		topicName = topics.find( topicDetails => topicDetails.slug === topic )?.name || '';
	}

	return (
		<Page
			canonicalPath={canonicalPath}
			pageDescription={getDescription( topicName )}
			pageTitle={topic ? `${title} on ${topicName}` : title}
			pageType={pageType}
			socialImage={socialImage}
		>
			<LandingPagePromoModule />
			<PageHeader
				intro={getDescription()}
				showPadding={false}
				title={title}
			>
				<TabNav>
					<TabNavItem
						isActive={!topic}
						key="all-topics"
					>
						<Link to="/guides/">All</Link>
					</TabNavItem>
					{
						topics.filter( ( { slug } ) => 'other-topics' !== slug ).map( ( { id, name, slug } ) => (
							<TabNavItem
								isActive={slug === topic}
								key={id}
							>
								<Link to={`/guides/${slug}/`}>
									{abbreviateTopicName( name )}
								</Link>
							</TabNavItem>
						) )
					}
				</TabNav>
			</PageHeader>
			<div className={styles.guides}>
				{
					topic ?
						<GuidesByTopic topic={topic as string} />
						:
						<AllGuides />
				}
			</div>
		</Page>
	);
}
