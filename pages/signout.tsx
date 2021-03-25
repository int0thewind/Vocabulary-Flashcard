import React from 'react';
import { Typography } from '@material-ui/core';
import { useAuth } from 'reactfire';
import { useRouter } from 'next/dist/client/router';

export default function SignOut() {
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    auth.signOut().then(() => { router.push('/'); });
  }, [auth, router]);

  return (
    <Typography color="textPrimary">
      Signing Out...
    </Typography>
  );
}
