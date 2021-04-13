/* eslint-disable no-param-reassign */
import React from 'react';
import {
  Box, Container, IconButton, makeStyles, Typography, Tooltip,
} from '@material-ui/core';
import { AddRounded, RefreshRounded } from '@material-ui/icons';
import withUserSignedIn, { WithUserSignedInProps } from 'src/HOC/withUserSignedIn';
import AddWordsDialog from 'src/dialog/AddWordsDialog';

const userPageStyle = makeStyles((theme) => ({
  button: { marginLeft: theme.spacing(1) },
}));

function User({ user }: WithUserSignedInProps) {
  const { uid } = user;
  const classes = userPageStyle();

  const [{ addWordDialogOpen }, setDialogState] = React.useState({
    addWordDialogOpen: false,
  });
  const openAddWordDialog = () => setDialogState((s) => ({ ...s, addWordDialogOpen: true }));
  const closeAddWordDialog = () => setDialogState((s) => ({ ...s, addWordDialogOpen: true }));

  return (
    <Container maxWidth="md" fixed>
      <Box padding={1}>
        <Typography color="textPrimary" variant="h2" gutterBottom>
          Manage Words
        </Typography>

        {/* Pannel */}
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" flexWrap="wrap">
          <Tooltip title="Add Words" placement="top">
            <IconButton onClick={openAddWordDialog} className={classes.button}>
              <AddRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh" placement="top">
            <IconButton className={classes.button}>
              <RefreshRounded />
            </IconButton>
          </Tooltip>
        </Box>

        <AddWordsDialog
          uid={uid}
          open={addWordDialogOpen}
          onClose={closeAddWordDialog}
        />

      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
