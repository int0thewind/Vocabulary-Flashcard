import React from 'react';
import {
  Dialog, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';

function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void; }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Help</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To show the definition, click the card or press space.
          <ul>
            <li>
              <b>Easy</b>
              : This word is easy for you. Its next due would one week later.
            </li>
            <li>
              <b>Medium</b>
              : This word is intermediate for you. Its next due would three days later.
            </li>
            <li>
              <b>Hard</b>
              : This word is hard for you. Its next due would one day later.
            </li>
            <li>
              <b>Again</b>
              : You does not recognize this word. It would stay in the session.
            </li>
          </ul>
          When learning, you can also click the button to change the order of words
          to random or ordered.
          <br />
          Please note that a learn session would not update the due date of words
          before it is finished.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default HelpDialog;
