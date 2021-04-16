import React from 'react';
import {
  Box, Container, IconButton, makeStyles, Typography, Tooltip, Button, Grid,
} from '@material-ui/core';
import {
  Add, Refresh, GetApp as Export, Delete,
} from '@material-ui/icons';
import Link from 'next/link';
import withUserSignedIn, { WithUserSignedInProps } from 'src/HOC/withUserSignedIn';

const userPageStyle = makeStyles((theme) => ({
  button: { marginLeft: theme.spacing(1) },
}));

function User({ user }: WithUserSignedInProps) {
  const classes = userPageStyle();

  return (
    <Container maxWidth="md" fixed>
      <Box padding={1}>
        {/* Title */}
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Manage Words
        </Typography>

        {/* Panel */}
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" flexWrap="wrap">
          <Tooltip title="Refresh" placement="bottom">
            <IconButton className={classes.button} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Link href="/user/add">
            <Button startIcon={<Add />} variant="contained" color="primary" className={classes.button}>
              Add
            </Button>
          </Link>

          <div style={{ flex: 1 }} />

          <Button startIcon={<Delete />} variant="contained" color="secondary" className={classes.button}>
            Delete
          </Button>
          <Button startIcon={<Export />} variant="contained" className={classes.button}>
            Export
          </Button>
        </Box>

        {/* Word List */}
        <Grid />
      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
