import React from 'react';
import {
  Box, Container, IconButton, makeStyles, Typography, Tooltip, Button,
} from '@material-ui/core';
import { Add, Refresh } from '@material-ui/icons';
import withUserSignedIn, { WithUserSignedInProps } from 'src/HOC/withUserSignedIn';
import AddWordDialog from '../../src/dialog/AddWordDialog';

const userPageStyle = makeStyles((theme) => ({
  button: { marginLeft: theme.spacing(1) },
}));

function User({ user }: WithUserSignedInProps) {
  const classes = userPageStyle();
  const [userDialogState, setUserDialogState] = React.useState({
    firstDialogOpen: false,
  });

  const openFirstDialog = () => setUserDialogState((s) => ({ ...s, firstDialogOpen: true }));
  const closeFirstDialog = () => setUserDialogState((s) => ({ ...s, firstDialogOpen: false }));

  return (
    <Container maxWidth="md" fixed>
      <Box padding={1}>
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
          <div style={{ flex: 1 }} />
          <Button startIcon={<Add />} variant="contained" color="primary" onClick={openFirstDialog}>
            Add
          </Button>
        </Box>

        <AddWordDialog
          firstDialogOpen={userDialogState.firstDialogOpen}
          closeFirstDialog={closeFirstDialog}
        />

      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
