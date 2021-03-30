import React from 'react';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { appAuth } from '../src/lib/firebase';

export default function SignOut() {
  const router = useRouter();

  React.useEffect(() => {
    appAuth.signOut().then(() => { router.push('/'); });
  });

  return (
    <Typography color="textPrimary">
      Signing Out...
    </Typography>
  );
}
