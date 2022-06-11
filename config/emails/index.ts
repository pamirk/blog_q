/*
	Config explanation:
	- link					the canonical link on qz.com for the email list
	- badgeUrl				the svg url
	- listId				legacy Sendgrid ID
	- menuOrder 			used in the nav Email dropdown; no menuOrder, and it won't appear
	- shortDescription		the description of the email used in the EmailSignup component
	- title					promotional copy used as EmailSignup title prop when that email is the primary Email for that component
	- frequency				descriptive string used to note the emails expected frequency, i.e. "every Tuesday"
	- canonicalSegment		if present, the segment of the email that should be used as the default segment (currently just Americas for Daily Brief)
	- filterableSegments	if the email has more than one segment, these are the segments we allow filtering by
	- kicker				the kicker used above the email title in lists/feeds that include the email
	— definiteArticle		whether or not to prepend an article ('the') before the title of an email when using it in a sentence
	* TODO: embed this information in CMS
*/
const emails = {
	'daily-brief': {
		link: '/emails/daily-brief/',
		badgeUrl: 'https://qz.com/public/svg/badge-quartz-default.svg',
		listId: 3224114,
		menuOrder: 1,
		name: 'Quartz Daily Brief',
		shortDescription: 'The concise, conversational rundown you need to start your day',
		title: 'Kick off each morning with coffee and the Daily Brief (BYO coffee).',
		frequency: 'Every morning except Sunday',
		canonicalSegment: 'americas',
		kicker: 'What you need to know',
		definiteArticle: true,
	},
	/*
		TODO: remove this config eventually.
		Keep this for now so we don't break the archive page / content feeds
	*/
	olympics: {
		link: '/emails/olympics/',
		badgeUrl: 'https://qz.com/public/svg/badge-ntk-olympics.svg',
		menuOrder: null,
		name: 'Need to Know: Tokyo Olympics',
		shortDescription: 'Your guide to the Games, with highlights, histories, and daily surprising discoveries',
		title: 'A daily guide to the Games, with highlights, histories, and surprising discoveries.',
		frequency: 'A few times a week',
		kicker: 'Game on',
		definiteArticle: false,
	},
	'quartz-obsession': {
		link: '/emails/quartz-obsession/',
		badgeUrl: 'https://qz.com/public/svg/badge-obsession.svg',
		listId: 1827166,
		menuOrder: 2,
		name: 'Quartz Weekly Obsession',
		shortDescription: 'An interactive email on the fascinating histories of everyday ideas',
		title: 'Want to escape the news cycle? Try our Weekly Obsession.',
		frequency: 'Weekly',
		kicker: 'Go down the rabbit hole',
		definiteArticle: true,
	},
	'quartz-members': {
		link: null,
		listId: 10299706,
		menuOrder: null,
		name: 'For Quartz members',
		shortDescription: 'Deep dives into the companies, people, and phenomena defining the global economy',
		frequency: 'Weekly',
		definiteArticle: false,
	},
	'quartz-weekend-brief': {
		link: null,
		menuOrder: null,
		name: 'Weekend Brief',
		shortDescription: 'Analysis and insights on one big news item of the week, plus the best of Quartz',
		frequency: 'Every weekend',
		definiteArticle: true,
	},
	'quartz-company': {
		link: null,
		menuOrder: null,
		name: 'The Company',
		shortDescription: 'A weekly deep dive on a company you need to know',
		frequency: 'Weekly',
		definiteArticle: false,
	},
	'quartz-forecast': {
		link: null,
		menuOrder: null,
		name: 'The Forecast',
		shortDescription: 'A look at emerging industries and trends around the corner',
		frequency: 'Weekly',
		definiteArticle: false,
	},
	'quartz-how-to': {
		link: null,
		menuOrder: null,
		name: 'How To',
		shortDescription: 'Practical advice for work and life, delivered the way only Quartz can',
		frequency: 'Weekly',
		definiteArticle: false,
	},
	'quartz-at-work': {
		link: '/emails/quartz-at-work',
		badgeUrl: 'https://qz.com/public/svg/badge-quartz-at-work.svg',
		listId: 3225180,
		menuOrder: 3,
		name: 'The Memo from Quartz at Work',
		shortDescription: 'Practical advice for modern workers everywhere',
		title: 'Sign up for our weekly email on the future of work.',
		frequency: 'Weekly',
		kicker: 'For modern workers everywhere',
		definiteArticle: false,
	},
	'africa-weekly-brief': {
		link: '/emails/africa-weekly-brief/',
		badgeUrl: 'https://qz.com/public/svg/badge-africa.svg',
		listId: 2985278,
		menuOrder: 4,
		name: 'Quartz Africa Weekly Brief',
		shortDescription: 'News and culture from around the continent',
		title: 'Keep up with developments and emerging industries in Africa.',
		frequency: 'Weekly',
		kicker: 'News from the continent',
		definiteArticle: true,
	},
	'space-business': {
		badgeUrl: 'https://qz.com/public/svg/badge-space-business.svg',
		link: '/emails/space-business/',
		listId: 7827898,
		menuOrder: 5,
		name: 'Space Business',
		shortDescription: 'A glimpse at the economic possibilities of space',
		title: 'Discover the innovators behind growing investment in space.',
		frequency: 'Weekly',
		kicker: 'Eyeing the extraterrestrial sphere',
		definiteArticle: false,
	},
	coronavirus: {
		link: '/emails/coronavirus/',
		badgeUrl: 'https://qz.com/public/svg/badge-coronavirus.svg',
		listId: 11090937,
		menuOrder: 6,
		name: 'Need to Know: Coronavirus',
		shortDescription: 'A calm, rational, even curious approach to the pandemic',
		title: 'Want to keep up with Covid-19? There’s an email for that.',
		frequency: 'Weekly',
		kicker: 'Tracking a pandemic',
		definiteArticle: false,
	},
};

const japanConfig = {
	'quartz-japan': {
		link: '/japan/subscribe/email/',
		listId: 9675205,
		menuOrder: null,
		name: 'Quartz Japan',
		shortDescription: 'A glimpse at the future of the global economy-in Japanese',
		title: 'Keep up with developments in business, econ, international relations, and consumer culture.',
		frequency: 'Every weekday morning and afternoon',
		kicker: 'Member exclusive newsletter',
		filterableSegments: [ 'am', 'pm', 'weekend' ],
		definiteArticle: false,
	},
};

// used in EmailsSection - the difference is, we include Quartz Japan - order these in the order we wish them to appear
const emailList = [
	'daily-brief',
	'quartz-at-work',
	// 'olympics', // TODO: remove this config eventually.
	'coronavirus',
	'quartz-members',
	'quartz-weekend-brief',
	'quartz-company',
	'quartz-forecast',
	'quartz-how-to',
	'quartz-obsession',
	'africa-weekly-brief',
	'space-business',
	'quartz-japan',
] as const;

const MEMBER_ONLY_EMAILS = [
	'quartz-members',
	'quartz-weekend-brief',
	'quartz-company',
	'quartz-forecast',
	'quartz-how-to',
	'quartz-japan',
];

// Type denoting a union of valid email list slugs, i.e. all of the
// slugs in the emailList array above.
// This works because an array has a numeric index signature, (meaning
// it’s indexed by numbers).
// Further reading:
// - https://steveholgado.com/typescript-types-from-arrays/
// - https://dev.to/andreasbergqvist/typescript-get-types-from-data-using-typeof-4b9c
export type EmailListSlug = typeof emailList[ number ];

const allEmails = { ...emails, ...japanConfig };

export {
	allEmails,
	emails as default,
	emailList,
	japanConfig,
	MEMBER_ONLY_EMAILS,
};
