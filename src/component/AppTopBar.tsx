import React from 'react';
import Link from 'next/link';
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
                <Link href="/signout">
                  <ListItemText>Sign Out</ListItemText>
                </Link>
              </ListItem>
            ) : (
              <ListItem button>
                <Link href="/signin">
                  <ListItemText>Sign In</ListItemText>
                </Link>
              </ListItem>
            )}
          </List>
        </Drawer>

        <Link href="/">
          <Typography variant="h6" className={classes.title}>
            Vocabulary Flashcard
          </Typography>
        </Link>

        <Hidden xsDown>
          {user ? (
            <Link href="/signout">
              <Button color="inherit">Sign Out</Button>
            </Link>
          ) : (
            <Link href="/signin">
              <Button color="inherit">Sign In</Button>
            </Link>
          )}
        </Hidden>

      </Toolbar>
    </AppBar>
  );
}

export default AppTopBar;
