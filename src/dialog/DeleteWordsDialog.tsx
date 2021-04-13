import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select,
  DialogContentText, TextField, ListSubheader, MenuItem,
} from '@material-ui/core';
import React from 'react';
import axios from 'axios';

type Props = {
  open: boolean;
  uid: string,
  onClose: () => void;
};

type SourceType = 'MW' | 'Oxford';

type DialogStateType = {
  source: SourceType,
  input: string
};

function DeleteWordsDialog(props: Props) {
  const { open, onClose, uid } = props;
  const [dialogState, setDialogState] = React.useState<DialogStateType>({
    source: 'MW',
    input: '',
  });
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
  const submit = () => {
    // eslint-disable-next-line no-console
    console.table(dialogState);
    const words = dialogState.input.split(',');
    words.map(async (word) => {
      const vocResp = await axios.delete('/api/vocabularies', {
        params: {
          word,
          uid,
          vocabulary: 'default',
        },
      });
      console.log(vocResp);
    });
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Words</DialogTitle>
      <DialogContent>
        <FormControl>
          <InputLabel>Select Source</InputLabel>
          <Select defaultValue="MW" onChange={onSelectChange}>
            <ListSubheader>Auto Query</ListSubheader>
            <MenuItem value="MW">Merriam-Webster</MenuItem>
            <MenuItem value="Oxford">Oxford</MenuItem>
            <ListSubheader>Manual</ListSubheader>
          </Select>
        </FormControl>
        <TextField fullWidth multiline rows={2} placeholder="Input words" variant="outlined" onChange={onInputChange} />
        <DialogContentText>
          Input words to add. To add multiple words, separate them with comma (,).
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={onClose}>Cancel</Button>
        <Button variant="text" color="secondary" onClick={submit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteWordsDialog;
