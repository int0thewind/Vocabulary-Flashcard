import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import withUserSignedIn, { WithUserSignedInProps } from 'src/component/withUserSignedIn';
import AddWordsDialog from 'src/dialog/AddWordsDialog';
import {
  DataGrid, GridCellParams, GridColDef, GridToolbar,
} from '@material-ui/data-grid';
import axios from 'axios';
import DeleteWordsDialog from '../../src/dialog/DeleteWordsDialog';

type Definitions = [{
  partOfSpeech: string,
  definitions: [{
    definition: string,
    synonyms: [string],
    example: string,
  }],
}];

export interface DefinitionDialogProps {
  open: boolean;
  wordLiteral: string,
  definitions: Definitions;
  onClose: (value: string) => void;
}

function DefinitionDialog(props: DefinitionDialogProps) {
  const {
    onClose, wordLiteral, definitions, open,
  } = props;

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{wordLiteral}</DialogTitle>
      <List style={{ padding: 20 }}>
        {definitions.map(
          (definition) => (
            <>
              <Typography
                component="span"
                variant="h5"
                color="textPrimary"
              >
                {definition.partOfSpeech}
              </Typography>
              {
                                definition.definitions.map((subDef, index) => (
                                  <>
                                    <ListItem alignItems="flex-start">
                                      <ListItemText
                                        primary={`${index + 1}. ${subDef.definition}`}
                                        secondary={(
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                          >
                                            {subDef.example}
                                          </Typography>
                                                )}
                                      />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                  </>
                                ))
                            }
            </>
          ),
        )}
        <ListItem>
          <Button>Forget</Button>
        </ListItem>
      </List>
    </Dialog>
  );
}

export interface WordDefinitionProps {
  wordLiteral: string,
  definitions: Definitions;
}

// Currently I would only show google definitions here
const WordDefinition = (props: WordDefinitionProps) => {
  const { wordLiteral, definitions } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" size="small" onClick={handleClickOpen}>
        See
      </Button>
      <DefinitionDialog
        wordLiteral={wordLiteral}
        definitions={definitions}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function User({ user }: WithUserSignedInProps) {
  const [addWordDialogOpen, setAddWordDialogOpen] = React.useState(false);
  const openAddWordDialog = () => setAddWordDialogOpen(true);
  const closeAddWordDialog = () => setAddWordDialogOpen(false);
  const [deleteWordDialogOpen, setDeleteWordDialogOpen] = React.useState(false);
  const openDeleteWordDialog = () => setDeleteWordDialogOpen(true);
  const closeDeleteWordDialog = () => setDeleteWordDialogOpen(false);

  const [rowData, setRowData] = useState([]);

  useEffect(async () => {
    const response = await axios.get('/api/vocabularies', {
      params: {
        uid: user.uid,
        vocabulary: 'default',
      },
    });

    const words = response.data;

    await Promise.all(
      words.map(async (word: { wordLiteral: string; addedAt }) => {
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
  }, [user.uid]);

  const columns: GridColDef[] = [
    { field: 'wordLiteral', headerName: 'Word', width: 100 },
    { field: 'phonetics', headerName: 'Phonetics', width: 150 },
    {
      field: 'rating', headerName: 'Rating', description: 'How important this word is', width: 100,
    },
    {
      field: 'learning', headerName: 'Learning', description: 'Whether you ara learning this word', width: 100,
    },
    {
      field: 'addedAt', type: 'dateTime', headerName: 'Added At', width: 200,
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
          <IconButton onClick={async () => {
            const response = await axios.get('/api/vocabularies', {
              params: {
                uid: user.uid,
                vocabulary: 'default',
              },
            });

            const words = response.data;

            await Promise.all(
              words.map(async (word: { wordLiteral: string; addedAt }) => {
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
          }}
          >
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={openAddWordDialog}>
            Add
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={openDeleteWordDialog}>
            Delete
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={openAddWordDialog}>
            Update Definitions
          </Button>
        </Box>

        <AddWordsDialog uid={user.uid} open={addWordDialogOpen} onClose={closeAddWordDialog} />
        <DeleteWordsDialog uid={user.uid} open={deleteWordDialogOpen} onClose={closeDeleteWordDialog} />

        <Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              components={{
                Toolbar: GridToolbar,
              }}
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
