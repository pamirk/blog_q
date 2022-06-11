import React from 'react';
import {Constrain, Hed, schemes, TextGroup,} from '@quartz/interface';
import Page, {PageLoading} from 'components/Page/Page';
import ArticleVideo from 'components/ArticleVideo/ArticleVideo';
import FeatureSection from 'components/FeatureSection/FeatureSection';
import List from 'components/List/List';
import NotFound from 'components/pages/NotFound/NotFound';
import styles from './MakeBusinessBetter.module.scss';
import useFeature from 'helpers/hooks/useFeature';
import useMenuItems from 'data/hooks/useMenuItems';
import {getArticleProps} from 'helpers/data/article';
import useArticlesBySeries from 'data/hooks/useArticlesBySeries';
import Link from 'components/Link/Link';
import SeriesHeader from 'components/SeriesHeader/SeriesHeader';

export default function MakeBusinessBetter() {
    const active = useFeature('mbb');
    const seriesData = useArticlesBySeries('make-business-better');
    const related = useMenuItems('related_mbb');

    /*if (!active) {
        return <NotFound/>;
    }*/

    if (!seriesData?.series || !related) {
        return <PageLoading/>;
    }

    const [mainFeature, ...additionalFeatures] = seriesData.articles || [];
    const relatedArticles = related.map(getArticleProps);
    let typography, background1, accent;

    if (seriesData.series.colors) {
        [
            typography = schemes.LIGHT.typography,
            background1 = schemes.LIGHT.background1,
            accent = schemes.LIGHT.accent,
        ] = seriesData.series.colors;
    }

    return (
        <Page
            canonicalPath="/is/make-business-better/"
            colorSchemes={seriesData.series.colors ? [
                {
                    accent,
                    background1,
                    type: 'default',
                    typography,
                },
            ] : undefined}
            pageDescription={seriesData.series.shortDescription ?? ''}
            pageTitle={seriesData.series.name ?? ''}
            pageType="video-series"
            socialImage={seriesData.series.socialImage?.sourceUrl ?? ''}
        >
            <div className={styles.headerContainer}>
                <SeriesHeader
                    {...seriesData.series}
                    taxonomy="project"
                    hideTitle={false}
                />
            </div>
            <Constrain size="extra-large">
                {
                    mainFeature &&
                    <div className={styles.featuredVideoContainer}>
                        <Hed size="large">
                            <h2 className={styles.heading}>Featured</h2>
                        </Hed>
                        <ArticleVideo
                            featuredImage={mainFeature.featuredImage}
                            showPaywall={false}
                            video={mainFeature.video}
                        />
                        <Link to={mainFeature.link} className={styles.featureArticleLink}>
                            <TextGroup
                                size="medium"
                                title={mainFeature.title}
                                isArticle={true}
                                kicker={mainFeature.kicker}
                            />
                        </Link>
                    </div>
                }
                {
                    !!additionalFeatures.length &&
                    <div className={styles.section}>
                        <Hed size="large">
                            <h2 className={styles.heading}>All episodes</h2>
                        </Hed>
                        <FeatureSection
                            posts={additionalFeatures}
                        />
                    </div>
                }
                <Hed size="large">
                    <h2 className={styles.heading}>Further reading</h2>
                </Hed>
                <div className={styles.listContainer}>
                    <List collection={relatedArticles} constrain={false}/>
                </div>
            </Constrain>
        </Page>

    );
}
