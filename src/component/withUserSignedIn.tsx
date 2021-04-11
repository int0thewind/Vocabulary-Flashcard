import React from 'react';
import firebase from 'firebase/app';
import { CircularProgress, Typography } from '@material-ui/core';
import { useFirebaseUser } from 'src/lib/firebase';
import { useRouter } from 'next/dist/client/router';
import { useSnackbar } from 'notistack';
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
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    React.useEffect(() => {
      if (!(loading || error) && !user) {
        enqueueSnackbar('You are not signed in.', {
          variant: 'warning',
        });
        router.push('/signin');
      }
    }, [user, loading, error, router, enqueueSnackbar]);
    if (loading || !user) {
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
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <UserComponent user={user} {...props} />;
  };
}

export default withUserSignedIn;
