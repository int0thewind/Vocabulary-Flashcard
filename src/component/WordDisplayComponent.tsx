/**
 * Word Display Component
 *
 * This component displays a word's specific information
 * and offers options to delete or edit the word.
 *
 * @author Hanzhi Yin
 * @since 0.1.0
 */

import React from 'react';
import {
  ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button,
  DialogContentText, Checkbox, Paper, makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { deleteWord, getAWord } from '../lib/firebase';
import Word from '../type/Word';
import { useFlag } from '../lib/hooks';

type Props = {
  word: string,
  refresh: () => void,
};

const wordDisplayComponentStyle = makeStyles(({
  wordPaper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  wordButton: {
    width: '100%',
    height: '100%',
  },
}));

/**
 * A clickable component, could be displayed on '/user' endpoint as a grid.
 * It offers a button to show word specific information.
 *
 * The opened dialog can prompt user to delete or edit the word information.
 *
 * Each display component can also be checked, with the `name` attribute to be the word.
 * By putting this component under a HTMLFormElement, word checked state can be tracked.
 *
 * @param word
 * @param refresh
 */
function WordDisplayComponent({ word, refresh }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = wordDisplayComponentStyle();
  const [wordDialogOpen, openWordDialog, closeWordDialog] = useFlag();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [deleteConfirmDialogOpen, _openDeleteConfirmDialog, closeDeleteConfirmDialog] = useFlag();
  const openDeleteConfirmDialog = () => {
    closeWordDialog();
    _openDeleteConfirmDialog();
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [editDialogOpen, _openEditDialog, closeEditDialog] = useFlag();
  const openEditDialog = () => {
    closeWordDialog();
    _openEditDialog();
  };

  const [wordData, setWordData] = React.useState<Word | null>(null);

  const submitToDelete = () => {
    deleteWord(word).then(() => {
      enqueueSnackbar(`"${word}" successfully deleted.`, { variant: 'success' });
      refresh();
    }).catch(() => {
      enqueueSnackbar(`Failed to delete "${word}".`, { variant: 'error' });
    });
  };

  React.useEffect(() => {
    getAWord(word).then(setWordData);
  }, [word]);

  return (
    <>
      {/* The word button and checkbox. */}
      <Paper className={classes.wordPaper} elevation={2}>
        <Checkbox name={word} color="primary" />
        <ButtonBase onClick={openWordDialog} className={classes.wordButton}>
          <Typography variant="body1" color="textPrimary">{word}</Typography>
        </ButtonBase>
      </Paper>

      {/* TODO: Finish word display dialog. */}
      <Dialog open={wordDialogOpen} onClose={closeWordDialog}>
        <DialogTitle>{word}</DialogTitle>
        <DialogContent>{JSON.stringify(wordData)}</DialogContent>
        <DialogActions>
          <Button onClick={openEditDialog}>Edit Word</Button>
          <Button onClick={openDeleteConfirmDialog} color="secondary">Delete Word</Button>
        </DialogActions>
      </Dialog>

      {/* Word delete confirm dialog */}
      <Dialog open={deleteConfirmDialogOpen} onClose={closeDeleteConfirmDialog}>
        <DialogTitle>{`Delete ${word}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete "${word}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmDialog}>Cancel</Button>
          <Button onClick={submitToDelete} color="secondary">Delete Word</Button>
        </DialogActions>
      </Dialog>

      {/* TODO: Finish word edit dialog. */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>{`Edit "${word}"`}</DialogTitle>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WordDisplayComponent;
