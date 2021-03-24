/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from 'next/app';
import { FirebaseAppProvider } from 'reactfire';
import environment from '../src/environment';
import AppTopBar from '../src/component/AppTopBar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={environment.firebaseConfig}>
      <AppTopBar />
      <Component {...pageProps} />
    </FirebaseAppProvider>
  );
}
