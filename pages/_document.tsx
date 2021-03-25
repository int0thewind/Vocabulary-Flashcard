/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

/*
Content copied from
https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
to resolve SSR themeing error
*/

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" style={{ margin: 0 }}>
        <Head />
        <body style={{ margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// TODO: may resolve _app style to _document with withStyle?

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
