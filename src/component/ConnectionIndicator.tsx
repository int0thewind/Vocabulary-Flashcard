/**
 * This component defines the connection icon indicator and connection help dialog for connection.
 *
 * @author Gary Liu
 */

import React from 'react';
import {
  Button, Dialog, DialogContent, DialogContentText, DialogTitle, Hidden, IconButton,
} from '@material-ui/core';
import WifiOffOutlinedIcon from '@material-ui/icons/WifiOffOutlined';
import { useNetworkState } from 'react-use';
import dynamic from 'next/dynamic';
import { useFlag } from '../lib/hooks';

function ConnectionIndicator() {
  const connectionStatus = useNetworkState();
  const [isDialogOpen, openDialog, closeDialog] = useFlag();

  // this icon should only be rendered in client side
  if (typeof window === 'undefined' || connectionStatus.online) {
    return null;
  }

  return (
    <>
      {/* for desktop */}
      <Hidden xsDown>
        <Button
          startIcon={<WifiOffOutlinedIcon />}
          onClick={openDialog}
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          No Connection
        </Button>
      </Hidden>

      {/* for mobile */}
      <Hidden smUp>
        <IconButton onClick={openDialog}>
          <WifiOffOutlinedIcon />
        </IconButton>
      </Hidden>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>
          No Internet Connection
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            It seems that you do not have the Internet connection.
            <br />
            <br />
            This app can still work offline.
            Your data and modification would be preserved locally
            and updated to the server when the Internet connection is available.
            <br />
            <br />
            Note that you might not be able to fetch definitions
            from third party APIs without the Internet.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default dynamic(() => Promise.resolve(ConnectionIndicator), {
  ssr: false,
});
