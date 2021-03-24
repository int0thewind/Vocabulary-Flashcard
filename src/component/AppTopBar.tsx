import React from 'react';
import 'firebase/auth';
import {
  AppBar, Button, Drawer, Hidden, IconButton, Toolbar, Typography, List,
  ListItem, ListItemText, makeStyles, useTheme, useMediaQuery,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useUser } from 'reactfire';

const useAppTopBarStyle = makeStyles((themes) => ({
  title: { flexGrow: 1 },
  menuIcon: { marginRight: themes.spacing(2) },
}));

function AppTopBar() {
  const user = useUser().data;
  const classes = useAppTopBarStyle();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  React.useEffect(() => {
    if (isSmUp) setDrawerOpen(false);
  }, [isSmUp]);

  return (
    <AppBar position="sticky">
      <Toolbar>

        <Hidden smUp>
          <IconButton onClick={() => setDrawerOpen((pre) => !pre)} color="inherit" className={classes.menuIcon}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List>
            {user ? (
              <ListItem button>
                <ListItemText>Sign Out</ListItemText>
              </ListItem>
            ) : (
              <ListItem button>
                <ListItemText>Sign In</ListItemText>
              </ListItem>
            )}
          </List>
        </Drawer>

        <Typography variant="h6" className={classes.title}>
          Vocabulary Flashcard
        </Typography>

        <Hidden xsDown>
          {user ? (
            <Button color="inherit">Sign Out</Button>
          ) : (
            <Button color="inherit">Sign In</Button>
          )}
        </Hidden>

      </Toolbar>
    </AppBar>
  );
}

export default AppTopBar;
