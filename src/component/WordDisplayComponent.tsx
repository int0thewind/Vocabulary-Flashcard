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
  DialogContentText, Checkbox, Paper, makeStyles, Box,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { deleteWord } from '../lib/firebase';
import { Word } from '../type/Word';
import { useFlag } from '../lib/hooks';
import AddOrEditWordForm from './AddOrEditWordForm';

type Props = {
  word: Word,
  refresh: () => void,
};

const wordDisplayComponentStyle = makeStyles((theme) => ({
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
  wordDefinition: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
 */
function WordDisplayComponent({ word, refresh }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = wordDisplayComponentStyle();

  const [wordDialogOpen, openWordDialog, closeWordDialog] = useFlag();
  const [deleteConfirmDialogOpen, openDeleteConfirmDialog, closeDeleteConfirmDialog] = useFlag();
  const switchToDeleteConfirmDialog = () => {
    closeWordDialog();
    openDeleteConfirmDialog();
  };
  // Delete form is within the dialog lifecycle.
  // Only refresh the user dashboard page when the deletion is successful.
  const submitToDelete = () => {
    closeDeleteConfirmDialog();
    deleteWord(word.literal).then(() => {
      enqueueSnackbar(`"${word.literal}" successfully deleted.`, { variant: 'success' });
      refresh();
    }).catch(() => {
      enqueueSnackbar(`Failed to delete "${word.literal}".`, { variant: 'error' });
    });
  };

  const [editDialogOpen, openEditDialog, closeEditDialog] = useFlag();
  const switchToEditDialog = () => {
    closeWordDialog();
    openEditDialog();
  };
  // Edit form is not within the dialog lifecycle.
  // To ensure data is always up-to-date, refresh the user dashboard page on close.
  const endEditProcess = () => {
    closeEditDialog();
    refresh();
  };

  return (
    <>
      {/* The word button and checkbox. */}
      <Paper className={classes.wordPaper} elevation={2}>
        <Checkbox name={word.literal} color="primary" />
        <ButtonBase onClick={openWordDialog} className={classes.wordButton}>
          <Typography variant="body1" color="textPrimary">{word.literal}</Typography>
        </ButtonBase>
      </Paper>

      {/* Word display dialog. */}
      <Dialog open={wordDialogOpen} onClose={closeWordDialog}>
        <DialogTitle>{word.literal}</DialogTitle>
        <DialogContent>
          {word.phoneticSymbol && (
          <Typography variant="h6" color="textSecondary" display="block" gutterBottom>
            {word.phoneticSymbol}
          </Typography>
          )}
          <Typography color="textPrimary">
            {word.definition}
          </Typography>
          {word.sampleSentence && (
            <Paper variant="outlined">
              <Typography>
                Example:
              </Typography>
              <Typography>
                {word.sampleSentence}
              </Typography>
            </Paper>
          )}
          {word.etymology && (
            <Box marginTop={4}>
              <Typography variant="h6" color="textSecondary">
                Etymology
              </Typography>
              <Typography color="textSecondary">
                {word.etymology}
              </Typography>
            </Box>
          )}
          {word.related && (
            <Box overflow="visible">
              {word.related.join(', ')}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWordDialog}>Close</Button>
          <Button onClick={switchToEditDialog}>Edit Word</Button>
          <Button onClick={switchToDeleteConfirmDialog} color="secondary">Delete Word</Button>
        </DialogActions>
      </Dialog>

      {/* Word delete confirm dialog */}
      <Dialog open={deleteConfirmDialogOpen} onClose={closeDeleteConfirmDialog}>
        <DialogTitle>{`Delete ${word.literal}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete "${word.literal}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmDialog}>Cancel</Button>
          <Button onClick={submitToDelete} color="secondary">Delete Word</Button>
        </DialogActions>
      </Dialog>

      {/* Word edit dialog. */}
      <Dialog open={editDialogOpen} onClose={endEditProcess} scroll="paper">
        <DialogTitle>{`Edit "${word.literal}"`}</DialogTitle>
        <DialogContent>
          <AddOrEditWordForm word={word} />
        </DialogContent>
        <DialogActions>
          <Button onClick={endEditProcess}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WordDisplayComponent;
