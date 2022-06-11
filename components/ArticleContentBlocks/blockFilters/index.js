import ads from './ads';
import footnotes from './footnotes';
import meteredPaywall from './meteredPaywall';
import paywall from './paywall';
import sponsor from './sponsor';

// Filters allow us to conditionally add blocks (e.g., inline ads) based on the
// articles props. They will be applied in the order they appear in the array.
export default [
	ads,
	footnotes,
	paywall,
	sponsor,
	meteredPaywall,
];
