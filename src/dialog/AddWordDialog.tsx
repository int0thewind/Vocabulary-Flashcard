import React from 'react';
import {
  Dialog, DialogContent, DialogTitle, FormControl, TextField, InputLabel, Select, MenuItem,
  ListSubheader, Button, DialogActions, DialogContentText,
} from '@material-ui/core';

type Props = {
  firstDialogOpen: boolean,
  closeFirstDialog: () => void,
};

function AddWordDialog({ firstDialogOpen, closeFirstDialog }: Props) {
  return (
    <>
      <Dialog open={firstDialogOpen} onClose={closeFirstDialog}>
        <DialogTitle>Add Word</DialogTitle>
        <form onChange={} />
        <DialogContent>
          <DialogContent>
            <FormControl>
              <InputLabel>Select Source</InputLabel>
              <Select defaultValue="MW" onChange={onSelectChange}>
                <ListSubheader>Auto Query</ListSubheader>
                <MenuItem value="MW">Merriam-Webster</MenuItem>
                <MenuItem value="Oxford">Oxford</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Input words"
              variant="outlined"
            />
            <DialogContentText>
              Input words to add. To add multiple words, separate them with comma (,).
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeFirstDialog}>Cancel</Button>
            <Button color="primary" onClick={submitQuery}>Submit</Button>
          </DialogActions>

        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddWordDialog;
