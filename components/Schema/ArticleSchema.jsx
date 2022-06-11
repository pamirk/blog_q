import Schema from './Schema.jsx';
import { parseDateGmt } from '../../helpers/dates';
import { resizeWPImage } from '../../@quartz/js-utils';
import { mapProps } from '../../helpers/wrappers';

export const getArticleSchema = ( { article } ) => {
	const {
		authors,
		bulletin,
		dateGmt,
		edition,
		featuredImage,
		link: url,
		modifiedGmt,
		seoTitle: title,
		summary: description,
		tags,
	} = article;

	const dateCreated = parseDateGmt( dateGmt ).toISOString();
	const dateModified = parseDateGmt( modifiedGmt ).toISOString();

	// Google structured data, when dealing with multiple authors, prefers that authors
	// are listed in an array of authors (see http://bit.ly/2gLqQuT ). Parsely requires
	// that multiple authors be listed in the "creator" field array (see
	// https://www.parse.ly/help/integration/jsonld/ ). Putting both here for both
	// services.

	// One author: object. >1 authors: array of objects (Google)

	const creator = authors.map( author => author.name );
	let author = creator.map( name => ( { '@type': 'Person', name } ) );

	if ( author.length === 1 ) {
		[ author ] = author;
	}

	const identifier = [ 'Obsession', 'Topic' ].reduce( ( acc, name ) => {
		const term = article[ name.toLowerCase() ];
		if ( !term ) {
			return acc;
		}

		return [
			...acc,
			{
				'@type': 'PropertyValue',
				name,
				value: term.name,
			},
		];
	}, [] );

	const data = {
		'@type': 'NewsArticle',
		articleSection: bulletin ? 'bulletin' : edition.slug,
		author,
		creator,
		dateCreated,
		dateModified,
		datePublished: dateCreated,
		description,
		// @TODO: We are not yet respecting the paywalled flag for the metered
		// paywall. If/when we do, the logic here should be updated.
		hasPart: {
			'@type': 'WebPageElement',
			isAccessibleForFree: 'False', // https://schema.org/False
			cssSelector: '#article-content',
		},
		headline: title,
		identifier,
		isAccessibleForFree: 'False',
		keywords: tags.map( tag => tag.name ),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url,
		},
		name: title,
		url,
	};

	// Add image if it exists. Google recommends:
	// For best results, provide multiple high-resolution images (minimum of
	// 300,000 pixels when multiplying width and height) with the following
	// aspect ratios: 16x9, 4x3, and 1x1.
	if ( featuredImage?.sourceUrl ) {
		data.image = [
			resizeWPImage( featuredImage.sourceUrl, 1600, 900, true ),
			resizeWPImage( featuredImage.sourceUrl, 1200, 900, true ),
			resizeWPImage( featuredImage.sourceUrl, 900, 900, true ),
		];
	}

	return { data };
};

export default mapProps( getArticleSchema )( Schema );
