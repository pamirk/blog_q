const countFootnotes = (str = '') => {
    const regex = /\<a.+?class\=\"footnote\"/g;

    const matches = str.match(regex) || [];

    return matches.length;
};

const footnotes = (blocks, {article: {footnotes}}) => {
    if (footnotes.length === 0) {
        return blocks;
    }

    const newBlocks = [];
    let footnoteIndex = 0;

    blocks.forEach(block => {
        const footnoteCount = countFootnotes(block.innerHtml);

        newBlocks.push(block);

        if (block.type === 'P') {
            for (let i = 0; i < footnoteCount; i++) {
                newBlocks.push({
                    type: 'FOOTNOTE',
                    footnote: footnotes[footnoteIndex],
                    footnoteIndex,
                });
                footnoteIndex++;
            }
        }
    });

    return newBlocks;
};
export default footnotes;