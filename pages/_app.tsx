/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { FirebaseAppProvider } from 'reactfire';
import { Theme, ThemeProvider } from '@material-ui/core';
import environment from '../src/environment';
import AppTopBar from '../src/component/AppTopBar';
import { darkTheme, lightTheme } from '../src/lib/theme';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = React.useState<Theme>(darkTheme);
  const mediaChangeListener = (e: MediaQueryListEvent) => {
    setTheme(e.matches ? darkTheme : lightTheme);
  };

  React.useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(matchMedia.matches ? darkTheme : lightTheme);
    matchMedia.addEventListener('change', mediaChangeListener);
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <style>
          {`html,body{margin:0}body{background-color:${theme.palette.background.default}}`}
        </style>
        <meta name="theme-color" content={theme.palette.primary.main} />
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
