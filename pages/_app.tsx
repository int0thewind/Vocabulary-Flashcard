/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Theme, ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { darkTheme, lightTheme } from '../src/lib/theme';
import AppTopBar from '../src/component/AppTopBar';
import { appTitle, appDesc } from '../src/lib/manifest';

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
    const mediaChangeCallback = (e: MediaQueryListEvent) => changeTheme(e.matches);
    matchMedia.addEventListener('change', mediaChangeCallback);
    return () => { matchMedia.removeEventListener('change', mediaChangeCallback); };
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta name="application-name" content={appTitle} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />
        <meta name="description" content={appDesc} />
        {/* <meta name="format-detection" content="telephone=no" /> */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* <meta name="msapplication-config" content="/static/icons/browserconfig.xml" /> */}
        <meta name="msapplication-TileColor" content={theme.palette.primary.main} />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content={theme.palette.primary.main} />

        {/* <link rel="apple-touch-icon" href="/static/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/static/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180"
        href="/static/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167"
        href="/static/icons/touch-icon-ipad-retina.png" /> */}

        {/* <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/icons/favicon-16x16.png"
        /> */}
        <link rel="manifest" href="/static/manifest.json" />
        {/* <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5" /> */}
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" /> */}

        {/* <meta name="twitter:card" content="summary" /> */}
        {/* <meta name="twitter:url" content="https://yourdomain.com" /> */}
        <meta name="twitter:title" content={appTitle} />
        <meta name="twitter:description" content={appDesc} />
        {/* <meta name="twitter:image" content="https://yourdomain.com/static/icons/android-chrome-192x192.png" /> */}
        {/* <meta name="twitter:creator" content="@DavidWShadow" /> */}
        {/* <meta property="og:type" content="website" /> */}
        <meta property="og:title" content={appTitle} />
        <meta property="og:description" content={appDesc} />
        <meta property="og:site_name" content={appTitle} />
        {/* <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="https://yourdomain.com/static/icons/apple-touch-icon.png" /> */}
        <title>{appTitle}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <AppTopBar />
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
