import React from 'react';
import { formatDate, oneDayInMilliseconds, parseDateGmt } from 'helpers/dates';

function Dateline ( props: { dateGmt: string | null, modifiedGmt?: string | null | undefined, className?: string } ) {
	const { className, dateGmt, modifiedGmt } = props;

	if ( !dateGmt ) {
		return null;
	}

	const showUpdatedOn = modifiedGmt && parseDateGmt( modifiedGmt ).valueOf() - oneDayInMilliseconds > parseDateGmt( dateGmt ).valueOf();

	return (
		<>
			{'Published '}<time dateTime={parseDateGmt( dateGmt ).toISOString()}>{formatDate( dateGmt, { human: true } )}</time>
			{
				modifiedGmt && showUpdatedOn && (
					<>
						<span className={className}>
							Last updated on <time dateTime={parseDateGmt( modifiedGmt ).toISOString()}>{formatDate( modifiedGmt, { human: true } )}</time>
						</span>
					</>
				)
			}
		</>
	);
}

export default Dateline;
