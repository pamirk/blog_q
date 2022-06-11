import React from 'react';
import { daysFromToday, parseDateGmt } from 'helpers/dates';

// Note: rendered server side -- component is subject to caching
export const DateWarning = ( { className, dateGmt }: { className?: string; dateGmt?: string | null; } ) => {
	if ( ! dateGmt ) {
		return null;
	}
	const articleOlderThanTwoYears = daysFromToday( parseDateGmt( dateGmt ) ) >= 731;
	// 731 = (365 * 2) + 1 in case one of the years is a leap year
	if ( articleOlderThanTwoYears ) {
		return <span className={className}>This article is more than 2 years old.</span>;
	}

	return null;
};

export default DateWarning;
