import React from 'react';
import compose from 'helpers/compose';
import styles from './ArticleTOC.module.scss';
import useArticlesByGuide from 'data/hooks/useArticlesByGuide';
import useArticlesBySeries from 'data/hooks/useArticlesBySeries';
import {ArticleStrip, BadgeGroup} from '@quartz/interface';
import Link from 'components/Link/Link';
import {ArticlePartsFragment, GuidePartsFragment, SeriesPartsFragment,} from '@quartz/content';
import {trackTableOfContentsClick as onClick, trackTableOfContentsView as onMount,} from 'helpers/tracking/actions';
import {withProps, withTracking, withVisibilityTracking,} from 'helpers/wrappers';

const LinkWithTracking = withTracking({onClick})(Link);

function ArticleTOC(props: {
    currentPostId: ArticlePartsFragment[ 'postId' ],
    posts: ArticlePartsFragment[],
    taxonomy?: GuidePartsFragment | SeriesPartsFragment,
}) {
    const {
        currentPostId,
        posts,
        taxonomy,
    } = props;

    if (!taxonomy) {
        return null;
    }

    return (
        <div>
            <Link to={taxonomy.link} className={styles.header}>
                <BadgeGroup
                    imageUrl={taxonomy.featuredImage?.sourceUrl}
                    kicker="You are reading"
                    size="medium"
                    tagline={taxonomy.shortDescription}
                    title={taxonomy.name ?? ''}
                />
            </Link>
            <ul className={styles.items}>
                {
                    posts.map(post => (
                        <li
                            aria-current={currentPostId === post.postId}
                            className={styles.item}
                            key={post.postId}
                        >
                            <LinkWithTracking
                                to={post.link}
                                className={styles.itemLink}
                                trackingData={{
                                    context: 'Table of Contents',
                                    destinationHeadline: post.title,
                                    destinationUrl: post.link,
                                }}
                            >
                                <ArticleStrip
                                    edition={post.editions?.[0].name}
                                    kicker={post.kicker}
                                    dateGmt={post.dateGmt}
                                    size="small"
                                    thumbnailUrl={post.featuredImage?.sourceUrl}
                                    title={post.title ?? ''}
                                />
                            </LinkWithTracking>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

const ArticleTOCWithTracking = compose(
    withProps({
        trackingData: {
            context: 'Table of Contents',
        },
    }),
	// @ts-ignore
	withVisibilityTracking({onMount})
)(ArticleTOC);

export function ArticleSeriesTOC(props: {
    postId: ArticlePartsFragment[ 'postId' ],
    slug: SeriesPartsFragment[ 'slug' ],
}) {
    const {postId, slug} = props;
    const data = useArticlesBySeries(slug ?? '', 20, false);

    if (!data) {
        return null;
    }

    const {articles, series} = data;

    return (
        <ArticleTOCWithTracking
            currentPostId={postId}
            posts={articles}
            taxonomy={series}
        />
    );
}

export function ArticleGuideTOC(props: {
    postId: ArticlePartsFragment[ 'postId' ],
    slug: GuidePartsFragment[ 'slug' ],
}) {
    const {postId, slug} = props;
    const data = useArticlesByGuide(slug ?? '', 20, false);

    if (!data) {
        return null;
    }

    const {articles, guide} = data;

    return (
        <ArticleTOCWithTracking
            currentPostId={postId}
            posts={articles}
            taxonomy={guide}
        />
    );
}
