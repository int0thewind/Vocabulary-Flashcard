import React from 'react';
import { Typography } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { appAuth } from '../../src/firebase';

// TODO: factor loading into the page.

function User() {
  const [user] = useAuthState(appAuth);
  return (
    <Typography variant="h2" color="textPrimary">
      {`${user?.displayName} signed in!`}
    </Typography>
  );
}

export default User;
