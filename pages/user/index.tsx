import React from 'react';
import {
  Box, Button, Container, IconButton, Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
  DataGrid, GridCellParams, GridColDef, GridToolbar,
} from '@material-ui/data-grid';
import axios from 'axios';
import withUserSignedIn, { WithUserSignedInProps } from 'src/component/withUserSignedIn';
import AddWordsDialog from 'src/dialog/AddWordsDialog';
import DeleteWordsDialog from 'src/dialog/DeleteWordsDialog';
import { WordDefinition, Definitions } from 'src/component/WordDefinition';

function User({ user }: WithUserSignedInProps) {
  const { uid } = user;

  const [addWordDialogOpen, setAddWordDialogOpen] = React.useState(false);
  const openAddWordDialog = () => setAddWordDialogOpen(true);
  const closeAddWordDialog = () => setAddWordDialogOpen(false);
  const [deleteWordDialogOpen, setDeleteWordDialogOpen] = React.useState(false);
  const openDeleteWordDialog = () => setDeleteWordDialogOpen(true);
  const closeDeleteWordDialog = () => setDeleteWordDialogOpen(false);
  const [rowData, setRowData] = React.useState([]);

  const refreshDataGrid = async () => {
    const response = await axios.get('/api/vocabularies', {
      params: { uid, vocabulary: 'default' },
    });

    const words = response.data;

    await Promise.all(
      words.map(async (word: { wordLiteral: string; addedAt: any }) => {
        word.id = word.wordLiteral;
        word.addedAt = new Date(word.addedAt);
        word.learning = word.learningInfo.learning;

        const wordsResp = await axios.get('/api/words', {
          params: {
            word: word.wordLiteral,
          },
        });

        const googleDef = JSON.parse(wordsResp.data.definitionsFromSources['Google Dictionary'].definition)[0];
        word.phonetics = googleDef.phonetics[0].text;
        word.definitions = googleDef.meanings;
      }),
    );

    setRowData(words);
  };

  React.useEffect(() => { refreshDataGrid(); });

  const columns: GridColDef[] = [
    { field: 'wordLiteral', headerName: 'Word', width: 100 },
    { field: 'phonetics', headerName: 'Phonetics', width: 150 },
    { field: 'rating', headerName: 'Rating', width: 100 },
    {
      field: 'learning', headerName: 'Learning', description: 'Learing this currently?', width: 100,
    },
    {
      field: 'addedAt', type: 'dateTime', headerName: 'Added at', width: 200,
    },
    {
      field: 'definitions',
      headerName: 'Definition(s)',
      sortable: false,
      width: 200,
      renderCell: (params: GridCellParams) => {
        const { id, value } = params;
        return (<WordDefinition wordLiteral={id as string} definitions={value as Definitions} />);
      },
    },
  ];

  return (
    <Container maxWidth="md" fixed>
      <Box padding={2}>
        <Typography color="textPrimary" variant="h5">
          Manage Words
        </Typography>

        {/* Pannel */}
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
          <IconButton onClick={refreshDataGrid}>
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={openAddWordDialog}>
            Add
          </Button>
          <Button variant="contained" startIcon={<DeleteIcon />} color="primary" onClick={openDeleteWordDialog}>
            Delete
          </Button>
          <Button variant="contained" startIcon={<UpdateIcon />} color="primary" onClick={openAddWordDialog}>
            Update Definitions
          </Button>
        </Box>

        <AddWordsDialog
          uid={uid}
          open={addWordDialogOpen}
          onClose={closeAddWordDialog}
        />
        <DeleteWordsDialog
          uid={uid}
          open={deleteWordDialogOpen}
          onClose={closeDeleteWordDialog}
        />

        <Box>
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              components={{ Toolbar: GridToolbar }}
              rows={rowData}
              columns={columns}
              pageSize={5}
              checkboxSelection
            />
          </div>
        </Box>

      </Box>
    </Container>
  );
}

export default withUserSignedIn(User);
