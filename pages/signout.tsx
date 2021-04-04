import React from 'react';
import { CircularProgress, Typography, Box } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { appAuth } from '../src/lib/firebase';

export default function SignOut() {
  const router = useRouter();

  React.useEffect(() => {
    appAuth.signOut().then(() => { router.push('/'); });
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
      <Typography variant="h1" color="textPrimary" gutterBottom>
        Signing Out...
      </Typography>
      <CircularProgress />
    </Box>
  );
}
