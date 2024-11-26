import Document, {Head, Html, Main, NextScript} from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

                    <link rel="icon" href="/images/logo.svg"/>
                    <meta name="title" content="Omni Social: Your AI Content Creation Genius"/>
                    <meta name="description" content="Omni Social is an open-source AI tool, providing powerful AI-driven content generation for marketers,
            writers, and businesses. Discover the potential of AI-powered content creation with Omni Social"/>
                    <meta property="og:site_name" content="Jema.ai"/>

                    <meta property="og:title" content="Omni Social: Your AI Content Creation Genius"/>
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:title" content="Generate any UI component in seconds."/>
                    <meta
                        name="twitter:description"
                        content="Omni Social is an open-source tool, providing powerful AI-driven content generation for marketers, writers, and businesses."
                    />
                    <meta
                        property="og:image"
                        content="/"
                    />
                    <meta
                        name="twitter:image"
                        content="/"
                    />
                
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
