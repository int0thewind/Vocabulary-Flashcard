import React from 'react';
import { Typography } from '@material-ui/core';
import withUserSignedIn, { WithUserSignedInProps } from 'src/component/withUserSignedIn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function User({ user }: WithUserSignedInProps) {
  return (
    <Typography variant="h1" color="textPrimary">
      User Signed In
    </Typography>
  );
}

export default withUserSignedIn(User);
