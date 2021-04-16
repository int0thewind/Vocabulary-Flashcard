import React from 'react';
import {
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  DialogContentText,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { deleteWordFromUser, getWordFromUser } from '../lib/firebase';
import Word from '../type/Word';

type Props = {
  word: string,
};

function WordDisplayComponent({ word }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [wordDialogOpen, setWordDialogOpen] = React.useState(false);
  const closeWordDialog = () => setWordDialogOpen(false);
  const openWordDialog = () => setWordDialogOpen(true);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = React.useState(false);
  const closeDeleteConfirmDialog = () => setDeleteConfirmDialogOpen(false);
  const openDeleteConfirmDialog = () => {
    closeWordDialog();
    setDeleteConfirmDialogOpen(true);
  };
  const [wordData, setWordData] = React.useState<Word | null>(null);

  const deleteWord = () => {
    deleteWordFromUser(word).then(() => {
      enqueueSnackbar(`"${word}" successfully deleted.`, { variant: 'success' });
    }).catch(() => {
      enqueueSnackbar(`Failed to delete "${word}".`, { variant: 'error' });
    });
  };

  React.useEffect(() => {
    getWordFromUser(word).then(setWordData);
  }, [word]);

  const buttonClick = () => openWordDialog();
  return (
    <>
      <ButtonBase onClick={buttonClick}>
        <Typography variant="body1" color="textPrimary">
          {word}
        </Typography>
      </ButtonBase>

      <Dialog open={wordDialogOpen} onClose={closeWordDialog}>
        <DialogTitle>{word}</DialogTitle>
        <DialogContent>
          {JSON.stringify(wordData)}
        </DialogContent>
        <DialogActions>
          <Button onClick={openDeleteConfirmDialog} color="secondary">Delete Word</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmDialogOpen} onClose={closeDeleteConfirmDialog}>
        <DialogTitle>{`Delete ${word}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            {' "'}
            {word}
            {'" '}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmDialog}>Cancel</Button>
          <Button onClick={deleteWord} color="secondary">Delete Word</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default WordDisplayComponent;
