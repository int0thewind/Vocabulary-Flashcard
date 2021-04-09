import React from 'react';
import { Typography } from '@material-ui/core';
import { useFirebaseUser } from '../../src/lib/firebase';

// TODO: factor loading into the page.

function User() {
  const [user, loading, error] = useFirebaseUser();
  return (
    <Typography variant="h2" color="textPrimary">
      {`${user?.displayName} signed in!`}
    </Typography>
  );
}

export default User;
