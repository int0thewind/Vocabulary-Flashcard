import React from 'react';
import firebase from 'firebase/app';
import { CircularProgress, Typography } from '@material-ui/core';
import { useFirebaseUser } from 'src/lib/firebase';
import Link from 'next/link';
import MiddleCenter from './MiddleCenter';

export type WithUserSignedInProps<P = {}> = P & {
  user: firebase.User;
};

type UserComponent<P = {}> = React.FunctionComponent<WithUserSignedInProps<P>>;

/**
 * A higher order component to inject loading, error,
 * and user not signed in component to a component designed for signed in user.
 */
function withUserSignedIn<P = {}>(UserComponent: UserComponent<P>): React.FunctionComponent<P> {
  return (props: P) => {
    const [user, loading, error] = useFirebaseUser();
    if (loading) {
      return (
        <MiddleCenter>
          <Typography variant="h1" color="textPrimary" align="center">
            Loading...
          </Typography>
          <CircularProgress />
        </MiddleCenter>
      );
    }
    if (error) {
      return (
        <MiddleCenter>
          <Typography variant="h1" gutterBottom color="textPrimary" align="center">
            An Error Occurred
          </Typography>
          <Typography variant="body1" color="error" align="center">
            {`${error.code}: ${error.message}`}
          </Typography>
        </MiddleCenter>
      );
    }
    if (!user) {
      return (
        <MiddleCenter>
          <Typography variant="h1" color="textPrimary" gutterBottom align="center">
            You are not Signed In
          </Typography>
          <Typography variant="body1" color="textPrimary" align="center">
            Click
            {' '}
            <Link href="/signin">here</Link>
            {' '}
            to sign in.
          </Typography>
        </MiddleCenter>
      );
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <UserComponent user={user} {...props} />;
  };
}

export default withUserSignedIn;
