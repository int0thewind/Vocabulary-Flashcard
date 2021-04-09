import { Typography, Box } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

function PageUserNotSignedIn() {
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
        You are not Signed In
      </Typography>
      <Typography variant="body1" color="textPrimary">
        Click
        {' '}
        <Link href="/signin">here</Link>
        {' '}
        to sign in.
      </Typography>
    </Box>
  );
}

export default PageUserNotSignedIn;
