import {ArticleDocument, useArticleQuery} from "./Article"
import {ArticlesByObsessionDocument, useArticlesByObsessionQuery} from "./ArticlesByObsession"
import {ArticleOrBulletinTeaserDocument} from "./ArticleTeaser"
import {useEmailListsBySlugQuery} from "./EmailListsBySlug"
import {useEssentialsByArticleQuery} from "./EssentialsByArticle"
import {useEssentialsByArticlePreviewQuery} from "./EssentialsByArticlePreview"
import {useEssentialsByCollectionQuery} from "./EssentialsByCollection"
import {useEssentialsByGuideQuery} from "./EssentialsByGuide"
import {useGuidesQuery} from "./Guides"
import {useGuidesByTopicQuery} from "./GuidesByTopic"
import {useHomeCollectionQuery} from "./HomeCollection"
import {useHomeCollectionPreviewQuery} from "./HomeCollectionPreview"
import {useLatestArticlesQuery} from "./LatestArticles"
import {useLatestFeedContentQuery} from "./LatestFeedContent"
import {useMediaItemsByIdQuery} from "./MediaItemsById"
import {useMenuByNameQuery} from "./MenuByName"
import {useObsessionsQuery} from "./Obsessions"
import {usePageByUriQuery} from "./PageByUri"
import {usePromotionsByTagQuery} from "./PromotionsByTag"
import {useTopicsQuery} from "./Topics"
import {useArticlesByTopicQuery} from "./ArticlesByTopic"
import {useNugsByTagQuery} from "./NugsByTag"
import {useLatestEmailByListQuery} from "./LatestEmailByList"
import { useArticlesByTagQuery } from "./ArticlesByTag"
import { useContributorsQuery } from "./Contributors"
import { useContentByAuthorQuery } from "./ContentByAuthor"
import { useEssentialsByObsessionQuery } from "./EssentialsByObsession"
import { useContentBySearchTermQuery } from "./ContentBySearchTerm"
import { useGuidesBySlugQuery } from "./GuidesBySlug"
import { useBulletinsBySeriesQuery } from "./BulletinsBySeries"
import { useArticlesByShowQuery } from "./ArticlesByShow"
import { EmailsByListDocument } from "./EmailsByList"
import { useArticlesByGuideQuery } from "./ArticlesByGuide"
import { useArticlesBySeriesQuery } from "./ArticlesBySeries"
import { useContentByTagQuery } from "./ContentByTag"
import { useEmailByIdQuery } from "./EmailById"
import { useEmailsByTagQuery } from "./EmailsByTag"
import { usePopularArticlesQuery } from "./ArticlesByPopularity"

export type ArticlePartsFragment = any
export type CollectionPartsFragment = any
export type ArticleTeaserPartsFragment = any
export type AuthorPartsFragment = any
export type BlockPartsFragment = any
export type GuidePartsFragment = any
export type SeriesPartsFragment = any
export type EditionName = any
export type VideoPartsFragment = any
export type MenuLocationEnum = string

enum BlockNameEnum {

}


export {
    usePopularArticlesQuery,
    useEmailsByTagQuery,
    useEmailByIdQuery,
    useContentByTagQuery,
    useArticlesByGuideQuery,
    useArticlesBySeriesQuery,
    useArticleQuery,
    EmailsByListDocument,
    useArticlesByShowQuery,
    useBulletinsBySeriesQuery,
    useGuidesBySlugQuery,
    useContentBySearchTermQuery,
    useEssentialsByObsessionQuery,
    useContentByAuthorQuery,
    useArticlesByObsessionQuery,
    useArticlesByTagQuery,
    useContributorsQuery,
    useLatestEmailByListQuery,
    useNugsByTagQuery,
    useArticlesByTopicQuery,
    ArticleOrBulletinTeaserDocument,
    useEssentialsByCollectionQuery,
    useMediaItemsByIdQuery,
    useEmailListsBySlugQuery,
    ArticleDocument,
    usePageByUriQuery,
    useGuidesByTopicQuery,
    useTopicsQuery,
    BlockNameEnum,
    ArticlesByObsessionDocument,
    usePromotionsByTagQuery,
    useObsessionsQuery,
    useMenuByNameQuery,
    useLatestFeedContentQuery,
    useLatestArticlesQuery,
    useHomeCollectionQuery,
    useHomeCollectionPreviewQuery,
    useGuidesQuery,
    useEssentialsByGuideQuery,
    useEssentialsByArticleQuery,
    useEssentialsByArticlePreviewQuery,


}