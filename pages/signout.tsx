import React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { appAuth } from 'src/lib/firebase';
import MiddleCenter from 'src/component/MiddleCenter';

export default function SignOut() {
  const router = useRouter();

  React.useEffect(() => {
    appAuth.signOut().then(() => { router.push('/'); });
  });

  return (
    <MiddleCenter>
      <Typography variant="h1" color="textPrimary" gutterBottom>
        Signing Out...
      </Typography>
      <CircularProgress />
    </MiddleCenter>
  );
}
