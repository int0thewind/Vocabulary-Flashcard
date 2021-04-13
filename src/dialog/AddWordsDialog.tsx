import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select,
  DialogContentText, TextField, ListSubheader, MenuItem,
} from '@material-ui/core';
import { parseMultipleWords } from 'src/utils/string';
import WordQuery from 'src/component/WordQuery';

type Props = {
  // TODO: extirpate uid in props
  open: boolean;
  uid: string,
  onClose: () => void;
};

type SourceType = 'MW' | 'Google' | 'Urban';

type DialogStateType = {
  secondDialogOpen: boolean,
  source: SourceType,
  input: string,
  wordQueries: string[],
};

function AddWordsDialog(props: Props) {
  const { open: firstDialogOpen, onClose: closeFirstDialog, uid } = props;
  const [dialogState, setDialogState] = React.useState<DialogStateType>({
    secondDialogOpen: false,
    source: 'MW',
    input: '',
    wordQueries: [],
  });
  const openSecondDialog = () => setDialogState((s) => ({ ...s, secondDialogOpen: true }));
  const closeSecondDialog = () => setDialogState((s) => ({ ...s, secondDialogOpen: false }));
  const onSelectChange = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    setDialogState((s) => ({
      ...s,
      source: e.target.value as SourceType,
    }));
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDialogState((s) => ({
      ...s,
      input: e.target.value,
    }));
  };
  const submitQuery = () => {
    setDialogState((s) => ({ ...s, wordQueries: parseMultipleWords(dialogState.input) }));
    closeFirstDialog();
    openSecondDialog();
  };
  return (
    <>
      <Dialog open={firstDialogOpen} onClose={closeFirstDialog}>
        <DialogTitle>Add Words</DialogTitle>
        <DialogContent>
          <FormControl>
            <InputLabel>Select Source</InputLabel>
            <Select defaultValue="MW" onChange={onSelectChange}>
              <ListSubheader>Auto Query</ListSubheader>
              <MenuItem value="MW">Merriam-Webster</MenuItem>
              <MenuItem value="Google">Google Dictionary</MenuItem>
              <MenuItem value="Urban">Urban Dictionary</MenuItem>
              <ListSubheader>Manual</ListSubheader>
            </Select>
          </FormControl>
          <TextField fullWidth multiline rows={2} placeholder="Input words" variant="outlined" onChange={onInputChange} />
          <DialogContentText>
            Input words to add. To add multiple words, separate them with comma (,).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFirstDialog}>Cancel</Button>
          <Button color="primary" onClick={submitQuery}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogState.secondDialogOpen}
        onClose={closeSecondDialog}
        disableBackdropClick
        disableEscapeKeyDown
        scroll="paper"
      >
        <DialogTitle>Processing</DialogTitle>
        <DialogContent>
          {dialogState.wordQueries.map((w) => (
            <WordQuery word={w} uid={uid} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={closeSecondDialog}>Suspend to Background</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddWordsDialog;
