import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <meta data-rh="true" property="title" content="Latest Business News Live" />
                <meta data-rh="true" property="og:title" content="Latest Business News Live" />
                <meta data-rh="true" name="robots" content="max-image-preview:large" />
                <meta data-rh="true" name="description" content="We are a guide to the new global economy for people in business who are excited by change. We cover business, economics, markets, finance, technology, science, design, and fashion." />
                <meta data-rh="true" property="og:description" content="We are a guide to the new global economy for people in business who are excited by change. We cover business, economics, markets, finance, technology, science, design, and fashion." />
                <meta data-rh="true" property="og:image" content="https://cms.qz.com/wp-content/uploads/2018/07/quartz-og.jpg" />
                <meta data-rh="true" name="twitter:image" content="https://cms.qz.com/wp-content/uploads/2020/04/qz-icon.jpg" />
                <meta data-rh="true" name="twitter:card" content="summary" />
                <link data-rh="true" rel="manifest" href="/public/meta/manifest.json" />
                <meta name="google-site-verification" content="qHgYb5h95pPyOXscK4Vng6UuYXjhWBqsZHn9h2G7tTw" />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    )
}
