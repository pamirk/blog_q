export const appPageMeta = {
    title: 'Quartz app for iOS',
    description: 'Get the Quartz app for the latest business news in the global economy, from our reporters around the world.',
    socialImage: 'https://cms.qz.com/wp-content/uploads/2020/08/app.png',
};

export const headlines = [
    {
        title: 'Your guide to the global economy',
        description: 'Get the Quartz app for the latest business news in the global economy, from our reporters around the world.',
    },
];

const appUiImage = {
    landscape: {
        url: 'https://cms.qz.com/wp-content/uploads/2020/08/app-mobile.png',
        aspectRatio: 2132 / 1200,
    },
    portrait: {
        url: 'https://cms.qz.com/wp-content/uploads/2020/08/app.png',
        aspectRatio: 350 / 713,
    },
};

export const posterSources = [
    {
        breakpoint: 'desktop-up',
        url: appUiImage.portrait.url,
        width: 1600,
        height: Math.round(1600 / appUiImage.portrait.aspectRatio),
    },
    {
        breakpoint: 'tablet-landscape-up',
        url: appUiImage.landscape.url,
        width: 1440,
        height: Math.round(1440 / appUiImage.landscape.aspectRatio),
    },
    {
        breakpoint: 'tablet-portrait-up',
        url: appUiImage.landscape.url,
        width: 1024,
        height: Math.round(1024 / appUiImage.landscape.aspectRatio),
    },
    {
        breakpoint: 'phone-only',
        url: appUiImage.landscape.url,
        width: 767,
        height: Math.round(767 / appUiImage.landscape.aspectRatio),
    },
];
