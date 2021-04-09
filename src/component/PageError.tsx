import { Typography, Box } from '@material-ui/core';
import React from 'react';

type Props = {
  code: string,
  message: string,
};

function PageError({ code, message }: Props) {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h1" gutterBottom color="textPrimary" align="center">
        An Error Occurred
      </Typography>
      <Typography variant="body1" color="error" align="center">
        {`${code}: ${message}`}
      </Typography>
    </Box>
  );
}

export default PageError;
