import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import {Badge, Button, Constrain, Kicker,} from '@quartz/interface';
import FormattedText from 'components/FormattedText/FormattedText';
import Link from 'components/Link/Link';
import ListWithAds from 'components/List/ListWithAds';
import LoadMoreButton from 'components/LoadMoreButton/LoadMoreButton';
import Page, {PageLoading} from 'components/Page/Page';
import ShareIcon from 'components/ShareIcons/ShareIcon';
import useContentByAuthor from 'data/hooks/useContentByAuthor';
import {stripTags, truncateText} from 'helpers/text';
import styles from './Author.module.scss';

const ad = {
    path: 'list',
    targeting: {
        page: 'latest',
    },
};

// Helper function to generate a unique bio per author.
// This is helpful for the many authors who don't have unique bios in the CMS, but instead have organizations (e.g. "The Atlantic")
function createAuthorBio(slug: string, bio?: string | null, name?: string | null) {
    if (!bio) {
        return `Quartz Articles by ${name || slug}`;
    }

    if (bio.length > 250) {
        return `Quartz Articles by ${name || slug} - ${truncateText(stripTags(bio), 250)}...`;
    }

    return `Quartz Articles by ${name || slug} - ${stripTags(bio)}`;
}

function AuthorBio({bio}) {
    const [expanded, setExpanded] = useState(Boolean);
    const onClick = () => setExpanded(true);

    if (!bio) {
        return null;
    }

    if (!expanded && bio.length > 275) {
        return (
            <p className={styles.bio}>
                <span dangerouslySetInnerHTML={{__html: truncateText(stripTags(bio), 225)}}/>
                ...
                <Button
                    inline={true}
                    onClick={onClick}
                    type="button"
                >
                    <span className={styles['read-more']}>Read more</span>
                </Button>
            </p>
        );
    }

    return (
        <div className={styles.bio}>
            <FormattedText text={bio} noFollow={false}/>
        </div>
    );
}

AuthorBio.propTypes = {
    bio: PropTypes.string.isRequired,
};

function Author() {
    const router = useRouter()
    const {slug} = router.query;

    const authorWithContent = useContentByAuthor(slug as string);
    const {author, content, fetchMore, hasMore, loading} = authorWithContent;

    if (!author || !content) {
        return <PageLoading/>;
    }

    const {
        avatar,
        bio,
        email,
        emeritus,
        facebook,
        instagram,
        linkedin,
        name,
        pgp,
        title,
        twitter,
        type,
        website,
    } = author;

    const headerTitle = 'guest-author' === type ? 'Contributor' : title;

    return (
        <Page
            canonicalPath={`/author/${slug}/`}
            feedLink={`/author/${slug}`}
            pageDescription={createAuthorBio(slug as string, bio, name)}
            pageTitle={name ?? `Quartz Articles by ${name || slug}`}
            pageType="author"
            socialImage={avatar ?? ''}
        >
            <Constrain size="extra-large">
                <div className={styles.header}>
                    {
                        !emeritus && avatar &&
                        <div className={styles.badge}>
                            <Badge
                                alt={name ?? ''}
                                imageUrl={avatar}
                                size="extra-large"
                            />
                        </div>
                    }
                    {
                        !emeritus && headerTitle &&
                        <div className={styles.title}>
                            <Kicker>{headerTitle}</Kicker>
                        </div>
                    }
                    <h1 className={styles.name}>{name}</h1>
                    {
                        !emeritus &&
                        <>
                            <AuthorBio bio={bio ?? ''}/>
                            <div className={styles.social}>
                                {
                                    website &&
                                    <Link
                                        className={styles['personal-url']}
                                        to={website}
                                    >
                                        {website.replace(/^https?:\/\//, '')}
                                    </Link>
                                }
                                <div className={styles['share-icons']}>
                                    {
                                        facebook &&
                                        <ShareIcon
                                            service="facebook"
                                            url={facebook}
                                            title={`${name} on Facebook`}
                                        />
                                    }
                                    {
                                        linkedin &&
                                        <ShareIcon
                                            service="linkedin"
                                            url={linkedin}
                                            title={`${name} on LinkedIn`}
                                        />
                                    }
                                    {
                                        email &&
                                        <ShareIcon
                                            service="email"
                                            url={`mailto:${email}`}
                                            title={`Email ${name}`}
                                        />
                                    }
                                    {
                                        twitter &&
                                        <ShareIcon
                                            service="twitter"
                                            url={twitter}
                                            title={`${name} on Twitter`}
                                        />
                                    }
                                    {
                                        instagram &&
                                        <ShareIcon
                                            service="instagram"
                                            url={instagram}
                                            title={`${name} on Instagram`}
                                        />
                                    }
                                </div>
                            </div>
                            {
                                pgp &&
                                <p className={styles.pgp}>PGP fingerprint: {pgp}</p>
                            }
                        </>
                    }
                </div>
            </Constrain>
            <hr/>
            <ListWithAds ad={ad} collection={content}/>
            <LoadMoreButton
                fetching={loading}
                hasMorePosts={hasMore}
                loadMore={fetchMore}
            />
        </Page>
    );
}

export default Author;
