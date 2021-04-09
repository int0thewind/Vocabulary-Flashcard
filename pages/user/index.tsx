import React from 'react';
import { Typography } from '@material-ui/core';
import withUserSignedIn from 'src/component/withUserSignedIn';

function User() {
  return (
    <Typography variant="h1" color="textPrimary">
      User Signed In
    </Typography>
  );
}

export default withUserSignedIn(User);
