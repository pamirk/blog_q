const articleQualifiers = article => {
    if (!article) {
        return {};
    }

    const {
        bulletin,
        featuredImage,
        featuredImageSize,
        flags,
        guide,
        interactive,
        metered,
        obsession,
        paywalled,
        project,
        series,
        show,
        subtype,
        tags,
        video,
    } = article;

    const hasEssentials = !!obsession?.hasEssentials || !!guide?.hasEssentials;
    const isBulletin = !!bulletin;
    const isGuide = !!guide?.slug;
    const isMetered = metered && !paywalled && !isBulletin;
    const isPaywalled = !!paywalled;
    const isPremium = isGuide; // Premium template is reserved for field guides.
    const isSeries = !!series?.slug;
    const isShow = !!show?.slug;
    const isProject = !!project?.slug;
    const isVideo = !!(subtype === 'video' && video);
    const isInteractive = !!(subtype === 'interactive' && interactive);
    const isWorkGuide = !!tags?.some(tag => tag.slug === 'work-guides');

    // A story in a guide or series can show a TOC of other stories in that collection.
    const hasTOC = !!(isGuide || isSeries && series.showToc);

    const showHeader =
        !isInteractive ||

        isInteractive &&
        interactive.showHeader === true

    ;

    const showHero =
        !isInteractive &&
        !isVideo &&
        null !== featuredImage &&
        'hidden' !== featuredImageSize;

    // Check for the dark-mode flag
    const darkModeDisabled = !!flags.length && flags
        .map(flag => flag.slug)
        .includes('dark-mode-disabled');

    return {
        darkModeDisabled,
        hasEssentials,
        hasTOC,
        isBulletin,
        isGuide,
        isInteractive,
        isMetered,
        isPaywalled,
        isPremium,
        isProject,
        isSeries,
        isShow,
        isVideo,
        isWorkGuide,
        showHeader,
        showHero,
    };
};
export default articleQualifiers;