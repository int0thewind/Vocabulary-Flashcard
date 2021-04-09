import React from 'react';
import { Typography } from '@material-ui/core';
import PageLoading from 'src/component/PageLoading';
import PageError from 'src/component/PageError';
import PageUserNotSignedIn from 'src/component/PageUserNotSignedIn';
import { useFirebaseUser } from 'src/lib/firebase';

function User() {
  const [user, loading, error] = useFirebaseUser();
  if (loading) return <PageLoading />;
  if (error) return <PageError message={error.message} code={error.code} />;
  if (!user) return <PageUserNotSignedIn />;
  return (
    <Typography variant="h1" color="textPrimary">
      User Signed In
    </Typography>
  );
}

export default User;
