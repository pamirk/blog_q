import { trackSegmentEvent } from './index';

export default function trackArticleConsumed( properties: {
	authors: string[]
	edition: string
	obsession?: string
	isMember: boolean,
	title: string
	topic?: string,
} ) {
	const { authors, edition, isMember, obsession, title, topic } = properties;

	trackSegmentEvent( 'Article Consumed', {
		article_authors: authors,
		article_edition: edition,
		article_obsession: obsession,
		article_topic: topic,
		membership_state: isMember ? 'Member' : 'Non-Member',
		title,
	} );
}
