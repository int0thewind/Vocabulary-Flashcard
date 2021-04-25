import React from 'react';
import { Box, makeStyles, Paper } from '@material-ui/core';

type Props = React.PropsWithChildren<{}>;

const userToolbarStyle = makeStyles((theme) => ({
  toolbar: { marginBottom: theme.spacing(2) },
  toolbarElement: {
    '& > *': { margin: theme.spacing(1) },
  },
}));

function UserToolbar({ children }: Props) {
  const classes = userToolbarStyle();
  return (
    <Paper className={classes.toolbar} variant="outlined" elevation={3}>
      <Box
        className={classes.toolbarElement}
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        flexWrap="wrap"
      >
        {children}
      </Box>
    </Paper>
  );
}

export default UserToolbar;
