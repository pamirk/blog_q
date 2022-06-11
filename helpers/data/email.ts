import { getArticleProps } from 'helpers/data/article';
import { allEmails, MEMBER_ONLY_EMAILS } from 'config/emails';

export const getArticleOrEmailProps = ( post ) => {
	const normalizedPost =  getArticleProps( post );
	if ( post.__typename !== 'Email' ) {
		return normalizedPost;
	}
	// use the email slug to grab the Email name
	const slug = post.emailLists?.nodes?.[0]?.slug;
	if ( normalizedPost.edition && slug && allEmails[slug] ) {
		normalizedPost.edition.name = `📬 ${allEmails[slug].name}`;

		if ( MEMBER_ONLY_EMAILS.includes( slug ) ) {
			normalizedPost.edition.name = `🔒${normalizedPost.edition.name}`;

		}
	}
	normalizedPost.kicker = slug && allEmails[slug] ? allEmails[slug]?.kicker : '';
	return normalizedPost;
};
