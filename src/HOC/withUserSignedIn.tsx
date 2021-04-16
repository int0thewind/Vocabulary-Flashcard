/**
 * With User Signed In Higher Order Component Module.
 *
 * This module defines the `withUserSignedIn` HOC.
 *
 * @author Hanzhi Yin
 * @version 0.1.0
 */

import React from 'react';
import firebase from 'firebase/app';
import { CircularProgress, Typography } from '@material-ui/core';
import { useFirebaseUser } from 'src/lib/firebase';
import { useRouter } from 'next/dist/client/router';
import { useSnackbar } from 'notistack';
import MiddleCenter from 'src/component/MiddleCenter';

/** Type of UserComponent Prop. Packed with Firebase user. */
export type WithUserSignedInProps = {
  user: firebase.User;
};

type UserComponent = React.FunctionComponent<WithUserSignedInProps>;

/**
 * Inject certain logics and components into a given React Component.
 *
 * User related pages should not be accessible if no user is signed in.
 * Getting users also requires some time, which may be long to wait.
 * This HOC injects user handling components and actions to a given user page component.
 *
 * If the page is still waiting for user state, the page should be loading.
 * If an error occurred, it should be displayed.
 * If no user signed in, the page should be routed to '/signin'.
 * Otherwise, show `UserComponent`.
 *
 * The `UserComponent` must accept `user` to be a React component prop.
 * The `user` prop is an instance of Firebase user, which is guaranteed to be a valid instance.
 *
 * @see useFirebaseUser
 *
 * @param UserComponent The base component to be wrapped upon. It must accept a `user` prop.
 * @returns A new React component with all the logics and components wrapped up.
 */
function withUserSignedIn(UserComponent: UserComponent): React.FunctionComponent {
  return () => {
    const [user, loading, error] = useFirebaseUser();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    React.useEffect(() => {
      if (!(loading || error) && !user) {
        enqueueSnackbar('You are not signed in.', { variant: 'warning' });
        router.push('/signin').then();
      }
      if (error) {
        enqueueSnackbar(`${error.code}: ${error.message}`, { variant: 'error' });
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
    return <UserComponent user={user} />;
  };
}

export default withUserSignedIn;
