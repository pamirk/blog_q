import React from 'react';
import FeatureSection from 'components/FeatureSection/FeatureSection';
import useArticlesByTopic from 'data/hooks/useArticlesByTopic';

export default function TopicSection({slug}: { slug: string }) {
    const data = useArticlesByTopic(slug, 3);
    const {articles, topic} = data;

    if (!topic) {
        return null;
    }

    if (topic.featuredImage) {
        return (
            <FeatureSection
                description={topic.description ?? ''}
                featuredImage={topic.featuredImage}
                link={`/topic/${slug}/`}
                name={topic.name ?? ''}
                posts={articles || []}
            />
        );
    }
    return null;
}
