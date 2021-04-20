import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';
import firebase from 'firebase/app';
import { useRouter } from 'next/dist/client/router';
import { appAuth, useFirebaseUser } from 'src/lib/firebase';
import 'firebaseui/dist/firebaseui.css';
import MiddleCenter from 'src/component/MiddleCenter';

export default function SignIn() {
  const router = useRouter();
  const [user, loading, error] = useFirebaseUser();
  const fbUIRef = React.useRef<HTMLDivElement>(null);
  let ui: firebaseui.auth.AuthUI | null = null;

  React.useEffect(() => {
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
    if (!(user || loading || error)) {
      import('firebaseui').then((firebaseui) => {
        if (!ui && fbUIRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
          ui = new firebaseui.auth.AuthUI(appAuth);
          ui.start(fbUIRef.current, uiConfig);
        }
      });
    }
    return () => { if (ui) ui.delete(); };
  }, [ui, user, loading, error]);

  return (
    <MiddleCenter>
      <Typography variant="h1" color="textPrimary" gutterBottom>
        Sign In
      </Typography>

      {loading && <CircularProgress />}

      {!loading && error && (
      <Typography color="error">
        An error occurred when trying to sign in.
        {`${error.code}: ${error.message}`}
      </Typography>
      )}

      {!(loading || error) && user && (
      <Typography color="textSecondary">
        You have already signed in.
      </Typography>
      )}

      <div id="firebase-ui" ref={fbUIRef} />
    </MiddleCenter>
  );
}
