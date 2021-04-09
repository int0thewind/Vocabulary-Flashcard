import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

function PageLoading() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h1" color="textPrimary">
        Loading...
      </Typography>
      <CircularProgress />
    </Box>
  );
}

export default PageLoading;
