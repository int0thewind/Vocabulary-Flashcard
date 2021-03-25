/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Theme, ThemeProvider } from '@material-ui/core';
import AppTopBar from '../src/component/AppTopBar';
import { darkTheme, lightTheme } from '../src/lib/theme';
import '../src/firebase';

/**
 * Custom app component.
 *
 * The goal of the custom global app component is to bring the theme,
 * the app top bar, and auto dark/light mode alternation to the global level.
 */
export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = React.useState<Theme>(darkTheme);
  const changeTheme = (isDark: boolean) => {
    const themeToSet = isDark ? darkTheme : lightTheme;
    setTheme(themeToSet);
    document.body.style.backgroundColor = themeToSet.palette.background.default;
  };

  React.useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    changeTheme(matchMedia.matches);
    matchMedia.addEventListener('change', (e) => changeTheme(e.matches));
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <ThemeProvider theme={theme}>
        <AppTopBar />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
