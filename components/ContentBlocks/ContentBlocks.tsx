import React, {Fragment} from 'react';
import StyledElement from 'components/StyledElement/StyledElement';
import ArticleRecircArticle from 'components/ArticleRecircArticle/ArticleRecircArticle';
import EmbedDatawrapper from 'components/Embeds/types/EmbedDatawrapper/EmbedDatawrapper';
import Figure from 'components/Figure/Figure';
import {keyBy} from 'helpers/utils';
import {getArticleProps} from 'helpers/data/article';
import styles from './ContentBlocks.module.scss';
import {Blockquote, EmojiList} from '@quartz/interface';
import Nug from 'components/Nug/Nug';
import {stripInlineStyling} from 'helpers/text';
import {CollectionPartsFragment} from '@quartz/content';
import {getBlockPromotions, BlockPromotion} from 'helpers/data/blockPromotions';
import CoreEmbed from 'components/Embeds/CoreEmbed';

// @ts-ignore
export const ContentBlock = (props: ElementType<CollectionPartsFragment[ 'blocks' ]> & { location?: string, nugId?: number }) => {
    const {
        attributes,
        connections,
        innerHtml,
        nugId,
        tagName,
        type,
    } = props ?? {};
    // Map attribute objects to a dictionary
    const attributeDictionary = attributes ? keyBy(attributes, o => o.name, o => o.value) : {};

    const blockPromotion = getBlockPromotions(props);

    switch (type) {
        case 'BLOCKQUOTE':
        case 'CORE_QUOTE':
            if (!innerHtml) {
                return null;
            }

            return (
                <Blockquote>
                    <div dangerouslySetInnerHTML={{__html: stripInlineStyling(innerHtml)}}/>
                </Blockquote>
            );

        case 'QZ_POST_TOUT':
            if (!connections?.[0]) {
                return null;
            }

            return (
                <PostTout
                    connection={connections[0]}
                    location={props.location} // eslint doesn't like destructuring the interfaced type, so...
                    promotion={blockPromotion}
                    nugId={nugId}
                />
            );

        case 'CORE_IMAGE': {
            const connection = connections?.[0];
            // Guard against images that weren't able to be resolved.
            if (connection?.__typename !== 'MediaItem') {
                return null;
            }

            // Nug writers may add a caption in the nug, which should take precedence over the image caption
            const {overwriteCaption} = attributeDictionary;

            const {
                altText,
                caption,
                credit,
                mediaDetails,
                sourceUrl,
            } = connection;
            const {width, height} = mediaDetails ?? {};

            if (!sourceUrl || !width || !height) {
                return null;
            }

            return (
                <div className={styles.figureContainer}>
                    <Figure
                        alt={altText || ''}
                        aspectRatio={width / height}
                        caption={overwriteCaption ?? caption}
                        credit={credit}
                        lazyLoad={true}
                        src={sourceUrl}
                    />
                </div>
            );
        }

        case 'CORE_HEADING':
        case 'CORE_LIST':
        case 'CORE_PARAGRAPH':
        case 'CORE_SEPARATOR':
        case 'P':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
        case 'OL':
        case 'UL':
        case 'PRE':
        case 'FIGURE':
            return (
                <StyledElement
                    attributes={attributes}
                    innerHtml={innerHtml}
                    tagName={tagName || 'p'}
                />
            );

        case 'EMBED_DATAWRAPPER':
        case 'SHORTCODE_QZ_DATAWRAPPER': {
            const {height, title, url} = attributeDictionary;

            return (
                <EmbedDatawrapper
                    height={parseInt(height, 10)}
                    title={title}
                    url={url}
                />
            );
        }

        case 'EL': {
            const {emojiBullets} = attributeDictionary;

            return (
                <EmojiList
                    bullets={emojiBullets.split(',')}
                    innerHtml={innerHtml}
                    tagName={tagName ?? 'ul'}
                />
            );
        }

        case 'SHORTCODE_CAPTION': {
            const {
                alt,
                aspectRatio,
                caption,
                credit,
                url,
            } = attributeDictionary;

            if (!url) {
                return null;
            }

            return (
                <div className={styles.figureContainer}>
                    <Figure
                        alt={alt}
                        aspectRatio={parseFloat(aspectRatio)}
                        caption={caption}
                        credit={credit}
                        src={url}
                    />
                </div>
            );
        }

        case 'CORE_EMBED': {
            return (
                <CoreEmbed postId={nugId} {...attributeDictionary} />
            );
        }

        default:
            return null;
    }
};

export function PostTout(props: {
    connection,
    location?: string,
    promotion?: BlockPromotion,
    nugId?: number,
}) {
    const {
        connection,
        location,
        promotion,
    } = props;

    // If there is no id defined on the connection, that means we weren't prepared
    // for this type to be returned. (In GraphQL terms, we did not define fields
    // for this type in the union, e.g., "... on Nug".)
    //
    // This can be a problem when editors attempt to connect an object of the same
    // type, e.g., a nug-to-nug connection. Our current queries don't support this
    // because—again using nugs as an example—connecting nugs to nugs in NugParts
    // would cause infinite recursion as NugParts get spread in over and over
    // again, down the query tree.
    if (!connection.id) {
        return null;
    }

    switch (connection.__typename) {
        case 'Nug':
            return (
                <Nug
                    blocks={connection.blocks}
                    location={location}
                    promotion={promotion}
                    title={connection.title}
                    postId={connection.nugId}
                />
            );
        case 'Post':
            const article = getArticleProps(connection);

            return (
                <div className={styles.articleCardContainer}>
                    <ArticleRecircArticle article={article}/>
                </div>
            );
        default:
            return null;
    }
}

export const ContentBlocks = (props: {
    blocks: CollectionPartsFragment[ 'blocks' ],
} & { nugId?: number }) => {
    if (!props.blocks?.length) {
        return null;
    }

    return (
        <Fragment>
            {
                props.blocks.map((block, index) => {
                    if (!block?.type) {
                        return null;
                    }

                    return (
                        <ContentBlock
                            key={index}
                            attributes={block.attributes}
                            connections={block.connections}
                            id={block.id}
                            innerHtml={block.innerHtml}
                            tagName={block.tagName}
                            type={block.type}
                            nugId={props.nugId}
                        />
                    );
                })
            }
        </Fragment>
    );
};

export default ContentBlocks;
