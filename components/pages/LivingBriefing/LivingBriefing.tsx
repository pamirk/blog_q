import React, {useRef} from 'react';
import styles from './LivingBriefing.module.scss';
import {FeatureCard, Hed} from '@quartz/interface';
import Link from 'components/Link/Link';
import MembershipCTA from 'components/MembershipCTA/MembershipCTA';
import LivingBriefingPageHeader from 'components/LivingBriefingPageHeader/LivingBriefingPageHeader';
import Nug from 'components/Nug/Nug';
import Page, {PageLoading} from 'components/Page/Page';
import PageSectionFooter from 'components/Page/PageSectionFooter/PageSectionFooter';
import CollapsibleTOC from 'components/CollapsibleTOC/CollapsibleTOC';
import TOC from 'components/TOC/TOC';
import useArticlesByTag from 'data/hooks/useArticlesByTag';
import useLivingBriefingNugs from './useLivingBriefingNugs';
import useUserRole from 'helpers/hooks/useUserRole';
import ArticleRecircArticle from 'components/ArticleRecircArticle/ArticleRecircArticle';

function LivingBriefing() {
    const {nugsByTopic, nugBriefings, relatedGuides} = useLivingBriefingNugs();
    const latestArticles = useArticlesByTag('coronavirus', 3);
    const {isLoggedIn, isMember} = useUserRole();
    const tocRef = useRef<HTMLDivElement>(null);

    if (!latestArticles || !nugsByTopic || !nugBriefings) {
        return <PageLoading/>;
    }

    const {articles} = latestArticles;

    // Calculate the total number of updated or new sentences in each of the nugs
    // that are part of the summary. For new visitors, this will be 0.
    const updateCount = nugBriefings.reduce((acc, {recentBlocks}) => {
        const nugUpdateCount = recentBlocks.reduce((nugAcc, {updateCount}) => nugAcc + updateCount, 0);
        return acc + nugUpdateCount;
    }, 0);

    return (
        <Page
            canonicalPath="/briefing/coronavirus/"
            pageDescription="Catch up quickly. New updates every business day."
            pageTitle="How Covid is affecting the economy"
            pageType="living-briefing"
            socialImage="https://cms.qz.com/wp-content/uploads/2020/03/LB-Coronavirus-image-feature.png?w=1200&h=720&crop=1&strip=all&quality=75"
        >
            <LivingBriefingPageHeader
                dateModified={nugBriefings[0]?.updateDate.toISOString()}
                isLanding
                title="Coronavirus living briefing"
                updateCount={updateCount}
            >
                <CollapsibleTOC contents={nugsByTopic}/>
            </LivingBriefingPageHeader>

            <div className={styles.section}>
                <div className={styles.heading}>
                    <Hed size="large">Recent updates</Hed>
                </div>

                {
                    nugBriefings.map(({
                                          link,
                                          nugId,
                                          recentBlocks,
                                          title,
                                          updateDate,
                                      }, i) => (
                        <div key={nugId}>
                            {
                                0 !== i &&
                                <hr/>
                            }
                            <Nug
                                blocks={recentBlocks}
                                postId={nugId}
                                lastModified={updateDate.toISOString()}
                                link={link}
                                title={title}
                            />
                        </div>
                    ))
                }
            </div>

            {
                !isMember &&
                <MembershipCTA
                    isLoggedIn={isLoggedIn}
                    trackingContext="living-briefing"
                    type="living-briefing"
                />
            }

            <div className={styles.section} ref={tocRef}>
                <TOC contents={nugsByTopic}/>

                <div className={styles.heading}>
                    <Hed size="large">Latest coronavirus stories</Hed>
                </div>
                {
                    articles?.map(article => (
                        <div className={styles.articleCard} key={article.id}>
                            <ArticleRecircArticle article={article}/>
                        </div>
                    ))
                }
                <PageSectionFooter
                    text="View all coronavirus stories"
                    url="/re/coronavirus/"
                />
            </div>

            {
                relatedGuides &&
                <div className={styles.section}>
                    <div className={styles.heading}>
                        <Hed size="large">Related field guides</Hed>
                    </div>
                    <div className={styles.guideCards}>
                        {
                            relatedGuides.map(({featuredImage, id, link, shortDescription, name}) => (
                                <div key={id} className={styles.guideCard}>
                                    <Link to={link}>
                                        <FeatureCard
                                            thumbnailUrl={featuredImage?.sourceUrl || ''}
                                            title={name || ''}
                                            description={shortDescription || ''}
                                            size="medium"
                                            isPortrait
                                        />
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                    <PageSectionFooter
                        text="View all field guides"
                        url="/guides/"
                    />
                </div>
            }
        </Page>
    );
}

export default LivingBriefing;
