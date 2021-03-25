import React from 'react';
import { Box, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import { useRouter } from 'next/dist/client/router';
import 'firebaseui/dist/firebaseui.css';
import { appAuth } from '../src/firebase';

export default function SignIn() {
  const router = useRouter();
  const fbUIRef: React.LegacyRef<HTMLDivElement> = React.useRef();
  const uiConfig = {
    signInSuccessUrl: '/user',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult() {
        router.push('/user');
        return false; // Do not let firebaseui to redirect for us.
      },
    },
  };
  let ui: firebaseui.auth.AuthUI = null;

  React.useEffect(() => {
    if (appAuth.currentUser) router.push('/');

    import('firebaseui').then((firebaseui) => {
      if (!ui) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ui = new firebaseui.auth.AuthUI(appAuth);
        ui.start(fbUIRef.current, uiConfig);
      }
    });

    return () => { if (ui) ui.delete(); };
  });

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h2" color="textPrimary" gutterBottom>
        Sign In
      </Typography>
      <div id="firebase-ui" ref={fbUIRef} />
    </Box>
  );
}
