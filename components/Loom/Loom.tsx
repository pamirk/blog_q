import React from 'react';
import {Helmet} from 'react-helmet-async';
import SafeEmbed from 'components/SafeEmbed/SafeEmbed';

export default function Loom(props: {
    isAmp: boolean,
    postId: number,
    url: string,
}) {
    if (props.isAmp) {
        // Extract the id from the url.
        const matches = props.url.match(/\/share\/([^/]+)$/);

        // If for some reason this URL doesn't conform, render nothing.
        if (!matches) {
            return null;
        }

        const [, id] = matches;

        return (
            <p>
                <Helmet>
                    <script async={undefined} custom-element="amp-iframe"
                            src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
                </Helmet>
                <amp-iframe
                    frameBorder="0"
                    height="345"
                    sandbox="allow-scripts allow-same-origin"
                    src={`https://www.loom.com/embed/${id}`}
                    width="640"
                >
                </amp-iframe>
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
