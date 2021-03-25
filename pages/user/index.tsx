import React from 'react';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import { InferGetServerSidePropsType } from 'next';
import { appAuth } from '../../src/firebase';

export async function getServerSideProps() {
  const user = appAuth.currentUser;
  return {
    props: { user },
  };
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

function User({ user }: Props) {
  const router = useRouter();
  React.useEffect(() => {
    if (user === null) router.push('/');
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
