import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select,
  DialogContentText, TextField, ListSubheader, MenuItem,
} from '@material-ui/core';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

type SourceType = 'MW' | 'Oxford';

type DialogStateType = {
  source: SourceType,
  input: string
};

function AddWordsDialog(props: Props) {
  const { open, onClose } = props;
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

export default AddWordsDialog;
