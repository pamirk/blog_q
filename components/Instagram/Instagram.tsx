import React from 'react';
import { Helmet } from 'react-helmet-async';
import SafeEmbed from 'components/SafeEmbed/SafeEmbed';

// Some posts with Instagram embeds for testing:
//
// https://qz.com/quartzy/1703242/how-to-plan-a-bachelorette-party-your-friends-can-actually-afford/
// https://qz.com/690901/with-an-updated-nutrition-facts-label-the-fda-settles-an-eternal-question-why-helvetica/

export default function Instagram ( props: {
	isAmp: boolean,
	postId: number,
	url: string,
} ) {
	if ( props.isAmp ) {
		const matches = props.url.match( /(instagr\.am\/|instagram\.com\/p\/)([\w\d\-_]+)/ );
		if ( ! matches ) {
			return null;
		}

		const [ ,, id ] = matches;
		console.log( id );
		return (
			<>
				<Helmet>
					<script async={undefined} custom-element="amp-instagram" src="https://cdn.ampproject.org/v0/amp-instagram-0.1.js"></script>
				</Helmet>
				<amp-instagram
					data-shortcode={id}
					data-captioned
					width="400"
					height="400"
					layout="responsive"
				/>
			</>
		);
	}

	return (
		<SafeEmbed
			postId={props.postId}
			url={props.url}
		/>
	);
}
