import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';

function UserNotSignIn() {
  const router = useRouter();
  React.useEffect(() => { router.push('/signin'); });
  return (
    <Box>
      <Typography variant="h2" color="textPrimary" gutterBottom>
        You are not signed in.
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Not redirecting? Click
        {' '}
        <Link href="/signin">here</Link>
        .
      </Typography>
    </Box>
  );
}

export default UserNotSignIn;
