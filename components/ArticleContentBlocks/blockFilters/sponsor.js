const seriesSponsorBlock = {
    type: 'SPONSOR',
};

const sponsor = (blocks, {isSeries, isGuide}) => {
    if (isSeries || isGuide) {
        return [...blocks, seriesSponsorBlock];
    }

    return blocks;
};
export default sponsor;