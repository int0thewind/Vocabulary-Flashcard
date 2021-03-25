/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import { ServerStyleSheets, Theme, withTheme } from '@material-ui/core/styles';

/**
 * Content copied from
 * https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
 * to resolve SSR themeing error
 */
class MyDocument extends Document<{ theme: Theme }> {
  render() {
    return (
      <Html lang="en" style={{ margin: 0 }}>
        <Head />
        <body style={{ margin: 0, backgroundColor: this.props.theme.palette.background.default }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

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

export default withTheme(MyDocument);
