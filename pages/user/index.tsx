/* eslint-disable no-param-reassign */
import React from 'react';
import {
  Box, Container, IconButton, makeStyles, Typography, Tooltip,
} from '@material-ui/core';
import { Add, Refresh } from '@material-ui/icons';
import withUserSignedIn, { WithUserSignedInProps } from 'src/HOC/withUserSignedIn';

const userPageStyle = makeStyles((theme) => ({
  button: { marginLeft: theme.spacing(1) },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function User({ user }: WithUserSignedInProps) {
  const classes = userPageStyle();

  return (
    <Container maxWidth="md" fixed>
      <Box padding={1}>
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Manage Words
        </Typography>

        {/* Pannel */}
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" flexWrap="wrap">
          <Tooltip title="Add Words" placement="bottom">
            <IconButton className={classes.button} color="primary">
              <Add />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh" placement="bottom">
            <IconButton className={classes.button} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
