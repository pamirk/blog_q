import React, { useRef } from 'react';
import { ButtonLabel } from '@quartz/interface';
import LivingBriefingPageHeader from 'components/LivingBriefingPageHeader/LivingBriefingPageHeader';
import Link from 'components/Link/Link';
import Nug from 'components/Nug/Nug';
import Page, { PageLoading } from 'components/Page/Page';
import styles from './Brief.module.scss';
import NotFound from '../../pages/NotFound/NotFound';
import TOC from 'components/TOC/TOC';
import CollapsibleTOC from 'components/CollapsibleTOC/CollapsibleTOC';
import { useClientSideUserData } from 'helpers/hooks';
import useLivingBriefingNugs from '../../pages/LivingBriefing/useLivingBriefingNugs.js';
import { useRouter } from 'next/router';

const extractMetaFromNugBlocks = ( blocks ) => {
	let title = null;
	let description = null;

	for ( const block in blocks ) {
		if ( blocks[block].tagName === 'h2' && ! title ) {
			title = blocks[block].innerHtml;

			if ( !! description ) {
				break;
			}
		} else if ( blocks[block].tagName === 'p' && ! description ) {
			// Parsing HTML with regex is generally a bad idea, but boutique content calls for boutique solutions
			description = blocks[block].innerHtml.replace( /(<([^>]+)>)/gi, '' );
			if ( !! title ) {
				break;
			}
		}
	}

	return {
		pageTitle: title,
		metaDescription: description,
	};
};

function Brief() {

	const { postId } = useRouter().query;
	const { nugsByTopic, nugsHashMap } = useLivingBriefingNugs();
	const { isMember } = useClientSideUserData();
	const tocRef = useRef();

	if ( ! nugsByTopic || ! nugsHashMap ) {
		return <PageLoading />;
	}

	// If the requested nug is not part of the Living Briefing, then throw a 404.
	// This prevents people from viewing nugs out of context.
	if ( ! nugsHashMap[ postId ] ) {
		return <NotFound />;
	}

	const { [ postId ]: { blocks, nugId, slug, title, updateDate } } = nugsHashMap;

	const { pageTitle, metaDescription } = extractMetaFromNugBlocks( blocks );

	// Calculate the total number of updated or new sentences in each block. For
	// new visitors, this will be 0.
	const updateCount = blocks.reduce( ( acc, { updateCount } ) => acc + updateCount, 0 );

	return (
		<Page
			canonicalPath={`/briefing/coronavirus/${nugId}/${slug}/`}
			pageDescription={metaDescription}
			pageTitle={pageTitle || `${title} — Coronavirus living briefing`}
			pageType="living-briefing"
			socialImage="https://cms.qz.com/wp-content/uploads/2020/03/LB-Coronavirus-image-feature.png?w=1200&h=720&crop=1&strip=all&quality=75"
		>
			<LivingBriefingPageHeader
				dateModified={updateDate}
				isLanding={false}
				title={title}
				tocRef={tocRef}
				updateCount={updateCount}
			>
				<div className={styles.tocLinks}>
					<Link to="/briefing/coronavirus/">← Coronavirus Living Briefing</Link>
					<div className={styles.tocContainer}>
						<CollapsibleTOC contents={nugsByTopic} />
					</div>
				</div>
			</LivingBriefingPageHeader>

			<div className={styles.container}>
				<Nug blocks={blocks} postId={parseInt( postId, 10 )} showPaywall={!isMember} />

				<hr />

				<div ref={tocRef}>
					<TOC contents={nugsByTopic} />
				</div>

				<div className={styles.returnLink}>
					<Link to="/briefing/coronavirus/">
						<ButtonLabel variant="secondary">← Back to the Living Briefing</ButtonLabel>
					</Link>
				</div>
			</div>
		</Page>
	);
}

export default Brief;
