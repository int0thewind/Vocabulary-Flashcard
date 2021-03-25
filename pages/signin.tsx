import React from 'react';
import { Box, Typography, CircularProgress } from '@material-ui/core';
import firebase from 'firebase/app';
import { useRouter } from 'next/dist/client/router';
import 'firebaseui/dist/firebaseui.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { appAuth } from '../src/firebase';

export default function SignIn() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(appAuth);
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
        return false; // Stop firebaseui to redirect for us.
      },
    },
  };
  let ui: firebaseui.auth.AuthUI = null;

  React.useEffect(() => {
    if (!(user || loading || error)) {
      import('firebaseui').then((firebaseui) => {
        if (!ui) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
          ui = new firebaseui.auth.AuthUI(appAuth);
          ui.start(fbUIRef.current, uiConfig);
        }
      });
    }
    return () => { if (ui) ui.delete(); };
  }, [ui, user, loading, error]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h1" color="textPrimary" gutterBottom>
        Sign In
      </Typography>
      {loading && <CircularProgress />}
      <div id="firebase-ui" ref={fbUIRef} />
      {user && (
      <Typography color="textSecondary">
        You have already signed in.
      </Typography>
      )}
      {error && (
      <Typography color="error">
        An error occurred when trying to sign in.
        {`${error.code}: ${error.message}`}
      </Typography>
      )}
    </Box>
  );
}
