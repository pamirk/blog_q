import { EditionName } from '@quartz/content';

const links = {
	AFRICA: {
		social: {
			facebook: 'https://www.facebook.com/QuartzAfrica/',
			twitter: 'https://twitter.com/qzafrica',
		},
		subscription: {
			name: 'Sign up for the Quartz Africa Weekly Brief',
			url: 'https://qz.com/newsletters/africa-weekly-brief/',
		},
	},
	INDIA: {
		social: {
			twitter: 'https://twitter.com/qzindia',
		},
	},
	QUARTZ: {
		social: {
			facebook: 'https://facebook.com/qz',
			twitter: 'https://twitter.com/qz',
			instagram: 'https://instagram.com/qz/',
			youtube: 'https://youtube.com/channel/UC9f78Z5hgtDt0n8JWyfBk8Q',
			linkedin: 'https://www.linkedin.com/company/quartzmedia/',
		},
		subscription: {
			name: 'Sign up for the Quartz Daily Brief',
			url: 'https://qz.com/daily-brief',
		},
	},
	WORK: {
		social: {
			facebookGroup: 'https://facebook.com/groups/QuartzAtWork',
			twitter: 'https://twitter.com/QuartzAtWork',
			linkedin: 'https://www.linkedin.com/company/quartzmedia/',
		},
		subscription: {
			name: 'Sign up for the Quartz Daily Brief',
			url: 'https://qz.com/daily-brief',
		},
	},
};

export default function ( edition: EditionName ) {
	return links[ edition ] || links.QUARTZ;
}
