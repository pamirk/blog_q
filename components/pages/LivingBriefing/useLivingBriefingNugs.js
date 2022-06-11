import {useEffect, useMemo, useReducer} from 'react';
import {useGuidesBySlugQuery, useNugsByTagQuery} from '@quartz/content';
import {oneDayInSeconds, parseDateGmt} from 'helpers/dates';
import useLocalStorageState from 'helpers/hooks/useLocalStorageState';
import {
    CORE_EMBED,
    CORE_HEADING,
    CORE_IMAGE,
    CORE_LIST,
    CORE_PARAGRAPH,
    CORE_QUOTE,
    EL,
    EMBED_DATAWRAPPER,
    QZ_POST_TOUT,
} from 'helpers/types/blocks';
import styles from './LivingBriefing.module.scss';

const blocksNeedingContext = [CORE_EMBED, CORE_IMAGE, EMBED_DATAWRAPPER, QZ_POST_TOUT];
const blocksWeCanParseForSentences = [CORE_LIST, CORE_PARAGRAPH, CORE_QUOTE, EL];
const blocksToExcludeFromBriefing = [CORE_HEADING];
const sixteenHoursInSeconds = oneDayInSeconds * 2 / 3;

/**
 * Port of Java's String#hashCode to generate sentence hashes.
 * https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 *
 * @param  {String} str String to hash.
 * @return {Number}
 */
function hashCode(str) {
    let hash;

    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }

    return hash;
}

/**
 * Assemble an object that represents the latest modified blocks across an array
 * of nugs.
 *
 * @param  {Object} nugs Array of nugs.
 * @param  {Array}  previousSentenceHashes Array of sentence hashes that the user has seen before.
 * @return {Object}
 */
function getLatestBlocks(nugs, previousSentenceHashes = []) {
    if (!nugs) {
        return {};
    }

    // Get a date representing two weeks ago, as a cut off for "recent."
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // First create a hash map of nugs that will be useful for both use cases.
    // Extract some useful properties and merge some nug meta into the blocks. I
    // apologize for calling this a hash map when we are separately using a hash
    // function. In this context, hash map === object.
    //
    // Break up the inner HTML of each block into an array of sentences and
    // calculate the hash of each. If the hash is not in the array of previously
    // seen hashes, wrap it in a span so that it can be highlighted.
    const currentSentenceHashes = [];
    const nugsHashMap = nugs.reduce((acc, nug) => ({
        ...acc,
        [nug.nugId]: {
            ...nug,
            blocks: nug.blocks.map((block, index) => {
                const dateModified = block.attributes.find(({name}) => 'dateModified' === name)?.value || 0;
                const {nugId} = nug;
                let updateCount = 0;

                // Skip if the block HTML is too difficult to parse.
                if (!blocksWeCanParseForSentences.includes(block.type)) {
                    return {
                        ...block,
                        dateModified,
                        index,
                        nugId,
                        updateCount,
                    };
                }

                // Mutate the inner HTML to add spans for blocks the user hasn't seen.
                const {innerHtml: originalInnerHtml} = block;
                let innerHtml = originalInnerHtml;

                // Make multiple passes to extract sentences from inner HTML of a block.
                // After each pass, merge into a flat array. It will contain some empty
                // strings but those will be ignored below.
                const rawSentences = [
                    /<\/?li>/,
                    /<\/?p>/,
                    /[\.!?]\s+/,
                ].reduce((acc, regex) => acc.reduce((inner, str) => inner.concat(str.split(regex)), []), [originalInnerHtml]);

                rawSentences
                    .forEach(rawSentence => {
                        // Generate a hash of a normalized string, ignoring minor changes
                        // like tags, puncuation, capitalization, and spacing.
                        const normalizedSentence = rawSentence.replace(/<([^>]+)>/g, '').replace(/[^\w]/g, '').toLowerCase();

                        if (!normalizedSentence) {
                            return;
                        }

                        // Add to list of currently seen hashes.
                        const hash = hashCode(normalizedSentence);
                        currentSentenceHashes.push(hash);

                        // If the user has been here before and they have not seen this
                        // sentence, wrap it in a span.
                        if (previousSentenceHashes.length && !previousSentenceHashes.includes(hash)) {
                            innerHtml = innerHtml.replace(rawSentence, `<span class="${styles.unseen}">${rawSentence}</span>`);

                            // Try to keep punctuation inside the span.
                            innerHtml = innerHtml.replace(/<\/span>([\.!?])/g, '$1</span>');

                            updateCount = updateCount + 1;
                        }
                    });

                return {
                    ...block,
                    dateModified,
                    innerHtml,
                    nugId,
                    updateCount,
                };
            }),
            recentBlocks: [],
            topic: nug?.topics?.nodes[0]?.name || 'Unknown',
            updateDate: parseDateGmt(nug.modifiedGmt),
        },
    }), {});

    // Flatten the nugs into an array of blocks. Remove some block types that we
    // don't want to represent in the summary, like headings.
    const blocks = Object.values(nugsHashMap).reduce((acc, nug) => {
        const blocksWithNugs = nug.blocks.map(block => ({
            ...block,
            nugId: nug.nugId,
        }));

        return acc.concat(blocksWithNugs);
    }, []).filter(block => !blocksToExcludeFromBriefing.includes(block.type));

    // Sort blocks by last modified date.
    blocks.sort((a, b) => b.dateModified - a.dateModified);

    // If all recent updates were in a single nug, that makes for a boring
    // briefing. Put a cap on how many blocks can be pulled from any one briefing.
    // Also set an upper limit on how many nugs can be in the briefing, regardless
    // of date.
    const perNugLimit = 5;

    // Set a lower and upper limit for how many nugs to display on the landing
    // page. The lower limit comes into play if there haven't been any updates in
    // the last two weeks.
    const lowerLimit = 10;
    const upperLimit = 20;

    // Iterate over the sorted blocks until we reach the "recent" date cut off of
    // two weeks ago or we reach an overall maximum. Add the blocks to the "recent
    // blocks" array in the nugs hash map.
    let count = 0;
    blocks.some(block => {
        const updateDate = new Date(block.dateModified * 1000);

        // If we've reached the cutoff, no need to look further.
        if (count >= lowerLimit && updateDate < twoWeeksAgo || count >= upperLimit) {
            return true;
        }

        const currentNug = nugsHashMap[block.nugId];

        // If this block belongs to a nug that has already reached the per-nug limit,
        // skip it.
        if (currentNug.recentBlocks.length >= perNugLimit) {
            return false;
        }

        // For some block types, also push in the previous block. Make sure that the
        // block doesn't already exist as a recent block.
        if (0 !== block.index && blocksNeedingContext.includes(block.type)) {
            const previousBlock = currentNug.blocks[block.index - 1];

            if (!currentNug.recentBlocks.some(({id}) => id === previousBlock.id)) {
                currentNug.recentBlocks.push(previousBlock);
                count = count + 1;
            }
        }

        // Push in the block and increment the count, but first make sure it wasn't
        // already added above as a "previous block".
        if (!currentNug.recentBlocks.some(({id}) => id === block.id)) {
            currentNug.recentBlocks.push(block);
            count = count + 1;
        }

        return false;
    });

    // Group nugs by topic to aid in representing the Table of Contents.
    const nugsByTopic = Object.values(nugsHashMap).reduce((acc, nug) => {
        // If not yet added to the accumulator, create a representation of the topic
        // topic with an array of nugs, which we will add to as we go.
        if (!acc.hasOwnProperty(nug.topic)) {
            Object.assign(acc, {[nug.topic]: []});
        }

        acc[nug.topic].push(nug);

        return acc;
    }, {});

    // Create a trimmed array of the nugs with recently updated blocks.
    const nugBriefings = Object.values(nugsHashMap)
        .filter(nug => nug.recentBlocks.length)
        .sort((a, b) => b.updateDate - a.updateDate);

    return {
        currentSentenceHashes,
        nugBriefings,
        nugsByTopic,
        nugsHashMap,
    };
}

export default function useLivingBriefingNugs() {
    const relatedGuideSlugs = ['economy-2021', 'movie-theaters-avoid-extinction', 'eat', 'delivery', 'fitness-boom', 'sneakers'];
    const {data: guidesBySlug} = useGuidesBySlugQuery({
        variables: {slug: relatedGuideSlugs, perPage: relatedGuideSlugs.length},
        ssr: true,
    });
    const relatedGuides = guidesBySlug?.guides?.nodes;
    const {data: nugsByTag} = useNugsByTagQuery({
        variables: {slug: ['living-briefing-coronavirus'], perPage: 50},
    });
    const nugs = nugsByTag?.nugs?.nodes;

    // We keep track of both the "last" state of the user and the current state. We
    // don't want to update the "last" state until enough time has passed (so that
    // we don't mark sentences as read as the user reads them).
    const currentTime = Math.round(Date.now() / 1000); // UNIX epoch
    const initialLocalStorageValue = {
        currentHashes: [],
        lastUpdated: currentTime,
        readHashes: undefined,
    };

    const [seen, updateSeen] = useLocalStorageState('living-briefing-coronavirus', initialLocalStorageValue);

    const {
        currentHashes: previouslySavedCurrentHashes,
        lastUpdated,
        readHashes,
    } = seen;

    // NOTE: While readHashes is an arrays of hashes, it's important to leave its
    // default / initial value as undefined. That way useMemo does not rerun since
    // [] !== [].
    const {currentSentenceHashes, ...data} = useMemo(() => getLatestBlocks(nugs, readHashes), [nugs, readHashes]);

    const [, updateHashes] = useReducer(() => {
        if (currentTime - lastUpdated > sixteenHoursInSeconds) {
            updateSeen({
                currentHashes: currentSentenceHashes,
                lastUpdated: currentTime,
                readHashes: previouslySavedCurrentHashes,
            });
            return;
        }

        updateSeen({
            currentHashes: currentSentenceHashes,
            lastUpdated,
            readHashes,
        });
    });

    useEffect(() => {
        updateHashes();
    }, [currentSentenceHashes, updateHashes]);

    return {
        ...data,
        relatedGuides,
    };
}
