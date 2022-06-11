import React from 'react';
import { Helmet } from 'react-helmet-async';
import SafeEmbed from 'components/SafeEmbed/SafeEmbed';

export default function Twitter ( props: {
	isAmp: boolean,
	postId: number,
	url: string,
} ) {
	if ( props.isAmp ) {
		// Extract the tweet id from the url
		const matches = props.url.match( /\/status\/([0-9]*)$/ );

		// If for some reason this URL doesn't conform, render nothing.
		if ( ! matches ) {
			return null;
		}

		const [ , id ] = matches;

		// width and height here seem useless, but AMP won't validate without them ¯\_(ツ)_/¯
		return (
			<p>
				<Helmet>
					<script async={undefined} custom-element="amp-twitter" src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js"></script>
				</Helmet>
				<amp-twitter
					width="640"
					height="360"
					layout="responsive"
					data-tweetid={id}
				>
				</amp-twitter>
			</p>
		);
	}

	return (
		<SafeEmbed
			postId={props.postId}
			url={props.url}
		/>
	);
}
