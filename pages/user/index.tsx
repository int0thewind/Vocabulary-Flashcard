import React from 'react';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { InferGetServerSidePropsType } from 'next';
import firebase from 'firebase/app';

export async function getServerSideProps() {
  const user = firebase.auth().currentUser;
  return {
    props: { user },
  };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

function User({ user }: Props) {
  const router = useRouter();
  React.useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);
  return (
    <>
      {user && (
      <Typography variant="h2" color="textPrimary">
        {`${user?.displayName} signed in!`}
      </Typography>
      )}
    </>
  );
}

export default User;
