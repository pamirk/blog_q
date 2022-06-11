import {EditionName} from '@quartz/content';
import QuartzLogo from 'svgs/quartz-logo';
import clock from 'svgs/clock';
import WorkLogo from 'svgs/quartz-at-work-logo';
import AfricaLogo from 'svgs/quartz-africa-logo';
import IndiaLogo from 'svgs/quartz-india-logo';

export const baseAssetUrl = 'https://cms.qz.com';
export const baseFeedUrl = `${baseAssetUrl}/feed`;
export const baseUrl = 'https://business-news.live';

const meta = {
    QUARTZ: {
        description: 'Quartz is a guide to the new global economy for people in business who are excited by change. We cover business, economics, markets, finance, technology, science, design, and fashion.',
        favicon: {
            light: '/public/images/favicon-light-mode.ico',
            dark: '/public/images/favicon-dark-mode.ico',
        },
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2020/04/qz-icon.jpg',
        link: '/',
        logo: clock,
        manifest: '/public/meta/manifest.json',
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-og.jpg',
        shortDescription: 'Global business journalism about how the world is changing',
        subtitle: 'Global business news and insights',
        themeColor: '#000000',
        title: 'All',
        twitterName: 'qz',
    },

    AFRICA: {
        link: '/africa/',
        subtitle: 'Stories of innovation across the continent',
        shortDescription: 'Stories of innovation across the continent’s wide-ranging economies',
        description: 'Quartz Africa is a guide to the important stories of innovation across the continent’s wide-ranging economies. Our journalists in Africa write for both local and global readers.',
        title: 'Africa',
        twitterName: 'qzafrica',
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-africa-og.jpg',
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-africa-icon.jpg',
        logo: AfricaLogo,
    },

    INDIA: {
        description: 'Quartz India is a guide to the world’s fastest-growing major economy. We provide in-depth coverage of the country for India and its far-flung diaspora.',
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-india-icon.jpg',
        link: '/india/',
        logo: IndiaLogo,
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-india-og.jpg',
        shortDescription: 'In-depth coverage of the world’s largest democracy',
        subtitle: 'In-depth coverage of the world’s largest democracy',
        title: 'India',
        twitterName: 'qzindia',
    },

    // TODO: fill in iconUrl, openGraphImage & logo with "official" Quartz Japan versions
    JAPAN: {
        description: 'Keep up with developments in business, econ, international relations, and consumer culture.',
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2020/04/qz-icon.jpg',
        link: '/japan/',
        logo: QuartzLogo,
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-og.jpg',
        shortDescription: 'A glimpse at the future of the global economy—in Japanese',
        subtitle: 'A glimpse at the future of the global economy—in Japanese',
        title: 'Japan',
        twitterName: 'qzjapan',
    },

    WORK: {
        description: 'Quartz at Work is a guide to being a better manager, building a career, and navigating the modern workplace.',
        iconUrl: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-at-work-icon.jpg',
        link: '/work/',
        logo: WorkLogo,
        openGraphImage: 'https://cms.qz.com/wp-content/uploads/2018/07/quartz-at-work-og.jpg',
        shortDescription: 'Management news, advice, and ideas for business leaders',
        subtitle: 'Management news, advice, and ideas for business leaders',
        title: 'Work',
        twitterName: 'quartzatwork',
    },
};

// Extend each edition with defaults (Quartz).
Object.keys(meta).forEach(key => meta[key] = Object.assign({}, meta.QUARTZ, meta[key]));

function Index(edition: EditionName) {
    return meta[edition] || meta.QUARTZ;
}

export default Index
