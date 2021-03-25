import React from 'react';
import { Box, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import { useRouter } from 'next/dist/client/router';
import { InferGetServerSidePropsType } from 'next';
import FirebaseUI from '../src/component/FirebaseUI';

export function getServerSideProps() {
  const user = firebase.auth().currentUser;
  return {
    props: { user },
  };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SignIn({ user }: Props) {
  const router = useRouter();
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
  React.useEffect(() => {
    if (!user) router.push('/');
  }, [router, user]);

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
      <FirebaseUI uiConfig={uiConfig} />
    </Box>
  );
}
