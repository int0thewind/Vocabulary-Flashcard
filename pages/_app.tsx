/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { FirebaseAppProvider } from 'reactfire';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import environment from '../src/environment';
import AppTopBar from '../src/component/AppTopBar';

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => setDarkMode(e.matches));
  }, []);

  const theme = createMuiTheme({
    palette: { type: isDarkMode ? 'dark' : 'light' },
  });

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <style>
          {`html,body {margin: 0} body {background-color: ${theme.palette.background.default}}`}
        </style>
        {/* TODO: Set PWA primary color. Need to import theme object */}
        {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
      </Head>
      <ThemeProvider theme={theme}>
        <FirebaseAppProvider firebaseConfig={environment.firebaseConfig}>
          <AppTopBar />
          <Component {...pageProps} />
        </FirebaseAppProvider>
      </ThemeProvider>
    </>
  );
}
