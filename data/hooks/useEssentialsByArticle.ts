import {
    CollectionPartsFragment,
    useEssentialsByArticlePreviewQuery,
    useEssentialsByArticleQuery,
} from '@quartz/content';
import {encodeRelayId} from 'helpers/graphql';
import {notUndefinedOrNull} from 'helpers/typeHelpers';
import {ElementType} from "react";

type ArticleEssential = {
    badge?: string | null;
    blocks: CollectionPartsFragment[ 'blocks' ];
    collectionId?: number | null,
    label?: string | null,
    link?: string | null;
    tagline?: string | null;
    title?: string | null;
};

/**
 * An article can have up to 3 essentials associated with it.
 * Two can come from automatic associations via a connected Obsession or Field Guide.
 * The third can come from an editor manually adding a Collection to the article and
 * editors can manually add up to 3, with the second overriding the Obsession-connected
 * Collection, and the third overriding the Field Guide-connected Collection.
 */
export default function useEssentialsByArticle(
    postId: number,
    options: { ssr?: boolean, time?: number, token?: string } = {}
) {
    const {ssr = false, time = 0, token = ''} = options;
    const isPreview = !!(time && token);

    const prodData = useEssentialsByArticleQuery({
        variables: {
            id: encodeRelayId('post', postId),
        },
        ssr,
        skip: isPreview,
    });

    const previewData = useEssentialsByArticlePreviewQuery({
        variables: {
            id: postId,
            time: time,
            token: token,
        },
        ssr,
        skip: !isPreview,
    });

    const data = isPreview ? previewData.data?.posts?.nodes?.[0] : prodData.data?.post;

    const article = data?.essentials?.nodes ?? [];
    const guide = data?.guides?.nodes?.[0];
    const obsession = data?.obsessions?.nodes?.[0];

    function getArticleEssential(
        essential: ElementType<typeof article> | typeof guide | typeof obsession
    ): ArticleEssential | undefined {
        if ((essential?.__typename === 'Guide' || essential?.__typename === 'Obsession') && essential?.hasEssentials) {
            return {
                badge: essential.featuredImage?.sourceUrl,
                blocks: essential.essentials?.nodes?.[0]?.blocks,
                collectionId: essential.essentials?.nodes?.[0]?.collectionId,
                link: essential.link,
                tagline: essential.shortDescription,
                title: essential.name,
            };
        }

        if (essential?.__typename === 'Collection') {
            return {
                badge: essential.featuredImage?.sourceUrl,
                blocks: essential.blocks,
                collectionId: essential.collectionId,
                tagline: essential.excerpt,
                title: essential.title,
            };
        }
        return;
    }

    // automatically-associated Essentials based on the article’s taxonomies
    const connectedEssentials = [getArticleEssential(guide), getArticleEssential(obsession)];
    const connectedIDs = connectedEssentials.map(essential => essential?.collectionId);

    // Essentials selected manually by editors in the article editor
    const manualEssentials = article.map(getArticleEssential)
        // filter out manually-added essentials that already exist via automatic connections
        .filter(essential => !connectedIDs.includes(essential?.collectionId));

    return [...manualEssentials, ...connectedEssentials].filter(notUndefinedOrNull).slice(0, 3);
}
