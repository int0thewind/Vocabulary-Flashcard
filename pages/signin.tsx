import React from 'react';
import { Box, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebaseui/dist/firebaseui.css';
import { useAuth } from 'reactfire';

export default function SignIn() {
  const auth = useAuth();
  const firebaseAuthRef: React.LegacyRef<HTMLDivElement> = React.useRef(null);

  React.useEffect(() => {
    let ui: firebaseui.auth.AuthUI | null = null;
    const uiConfig: firebaseui.auth.Config = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };

    import('firebaseui').then((firebaseui) => {
      ui = new firebaseui.auth.AuthUI(auth);
      ui.start(firebaseAuthRef.current, uiConfig);
    });

    return () => { ui.delete(); }; // Cannot return a Promise in `useEffect`
  }, [auth]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h2" color="textPrimary">
        Sign In
      </Typography>
      <div id="firebase-auth" ref={firebaseAuthRef} />
    </Box>
  );
}
