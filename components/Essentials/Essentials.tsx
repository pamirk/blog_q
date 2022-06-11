import React, { Fragment } from 'react';
import styles from './Essentials.module.scss';
import { CollectionPartsFragment } from '@quartz/content';
import { EssentialsContentBlock } from './EssentialsContentBlock';
import { blockTypesSet } from 'helpers/tracking/segment/trackEssentials';
import { useEssentialsFeedViewTracking } from 'helpers/tracking/segment/hooks/useEssentialsViewTracking';
import SponsoredEssentialStack from 'components/Essentials/SponsoredEssential/SponsoredEssential';
import { notUndefinedOrNull } from 'helpers/typeHelpers';

function Essentials( props: {
	blocks: CollectionPartsFragment[ 'blocks' ],
	collectionId?: number,
	collectionTitle?: string,
	showAds: boolean,
	trackingContext: string,
	ad: {
		path: string,
		targeting: any
	}
} ) {
	// Only render nugs.
	const validBlocks = props.blocks
		?.filter( block => block?.type && 'Nug' === block?.connections?.[0]?.__typename )
		?.filter( notUndefinedOrNull ) || [];

	const sponsoredEssentials = validBlocks.map( ( _, index ) => {
		if ( ( index - 1 ) % 5 !== 0 ) {
			return null;
		}
		return SponsoredEssentialStack( { ad: props.ad } );
	} );

	const visibilityRef = useEssentialsFeedViewTracking( {
		block_types: blockTypesSet( { collection: validBlocks } ),
		card_count: validBlocks.length,
		card_id: validBlocks.map( block => block.id ).filter( notUndefinedOrNull ),
		collection_id: props.collectionId,
		collection_title: props.collectionTitle,
	} );

	return (
		<>
			<ul className={styles.container} ref={visibilityRef}>
				{
					validBlocks
						.map( ( block, index ) => (
							<Fragment key={index}>
								<li className={styles.block}>
									<EssentialsContentBlock
										attributes={block.attributes}
										connections={block.connections}
										id={block.id}
										innerHtml={block.innerHtml}
										tagName={block.tagName}
										type={block.type}
										card_index={index + 1}
										card_title={
											block.connections?.[0]?.__typename === 'Nug' ? block.connections?.[0]?.title || undefined : undefined
										}
										collection_id={props.collectionId}
										collection_title={props.collectionTitle}
										stack_index={1}
										stack_size={validBlocks.length}
										trackingContext={props.trackingContext}
									/>
								</li>
								{
									( index - 1 ) % 5 === 0 &&
									props.showAds &&
									!!sponsoredEssentials[index] &&
									<li className={!!sponsoredEssentials[index]?.hasSponsoredEssential ? styles.block : undefined}>
										{sponsoredEssentials[index]?.sponsoredEssential}
									</li>
								}
							</Fragment>
						) )
				}
			</ul>
		</>
	);
}

Essentials.defaultProps = { showAds: true };
export default Essentials;
