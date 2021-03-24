import React from 'react';
import { Typography } from '@material-ui/core';
import { useAuth } from 'reactfire';

export default function SignOut() {
  const auth = useAuth();
  React.useEffect(() => {
    auth.signOut().then(() => { window.location.href = '/'; });
  });
  return (
    <Typography color="textPrimary">
      Signing Out...
    </Typography>
  );
}
