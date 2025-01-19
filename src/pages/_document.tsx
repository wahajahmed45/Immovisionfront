'use client'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="shortcut icon" href="/img/favicon.png" type="image/x-icon"/>
          {/* External CSS files */}
          <link rel="stylesheet" href="/css/font-icons.css"/>
          <link rel="stylesheet" href="/css/nice-select2.css"/>
          <link rel="stylesheet" href="/css/animate.css"/>
          <link rel="stylesheet" href="/css/swiper-bundle.min.css"/>
          <link rel="stylesheet" href="/css/glightbox.css"/>
          <link rel="stylesheet" href="/css/style.css"/>
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