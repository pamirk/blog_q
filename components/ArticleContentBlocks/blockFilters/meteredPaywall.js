import {PAYWALL_BLOCKS_LIMIT} from '../../../config/membership';

// Truncate the content for the paywall.
const meteredPaywall = (blocks, {paywallType}) => {
    if (paywallType) {
        return blocks.slice(0, PAYWALL_BLOCKS_LIMIT);
    }

    return blocks;
};
export default meteredPaywall;