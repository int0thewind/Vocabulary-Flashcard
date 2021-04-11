import React from 'react';
import {
  Box, Button, Container, IconButton, Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import withUserSignedIn, { WithUserSignedInProps } from 'src/component/withUserSignedIn';
import AddWordsDialog from 'src/dialog/AddWordsDialog';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function User({ user }: WithUserSignedInProps) {
  const [addWordDialogOpen, setAddWordDialogOpen] = React.useState(false);
  const openAddWordDialog = () => setAddWordDialogOpen(true);
  const closeAddWordDialog = () => setAddWordDialogOpen(false);
  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        <Typography color="textPrimary" variant="h5">
          Manage Words
        </Typography>

        {/* Pannel */}
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
          <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={openAddWordDialog}>
            Add
          </Button>
          <IconButton><RefreshIcon /></IconButton>
        </Box>

        <AddWordsDialog open={addWordDialogOpen} onClose={closeAddWordDialog} />

        {/* Vocabulary Grid */}
        {/* <Box>
          <DataGrid
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box> */}
      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
