import React from 'react';
import Link from 'next/link';
import 'firebase/auth';
import {
  AppBar, Button, Drawer, Hidden, IconButton, Toolbar, Typography, List,
  ListItem, ListItemText, useTheme, useMediaQuery, Divider, Avatar, Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuthState } from 'react-firebase-hooks/auth';
import { appTopBarRoutesSignedIn, appTopBarRoutesSignedOut } from '../lib/routes';
import { appAuth } from '../firebase';

function AppTopBar() {
  const [user, loading, error] = useAuthState(appAuth);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const toggleDrawer = () => setDrawerOpen((pre) => !pre);

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  React.useEffect(() => {
    if (isSmUp) setDrawerOpen(false);
  }, [isSmUp]);

  const drawerSignedIn = (
    <Drawer anchor="top" open={drawerOpen} onClose={closeDrawer}>
      <List>
        {appTopBarRoutesSignedIn.map((val) => (
          <ListItem button key={val.caption}>
            <Link href={val.link}>
              <ListItemText onClick={closeDrawer}>{val.caption}</ListItemText>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
  const drawerSignedOut = (
    <Drawer anchor="top" open={drawerOpen} onClose={closeDrawer}>
      <List>
        {appTopBarRoutesSignedOut.map((val) => (
          <ListItem button key={val.caption}>
            <Link href={val.link}>
              <ListItemText onClick={closeDrawer}>{val.caption}</ListItemText>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
  const buttonSignedIn = appTopBarRoutesSignedIn.map((val) => (
    <Link href={val.link} key={val.caption}>
      <Button color="inherit">{val.caption}</Button>
    </Link>
  ));
  const buttonSignedOut = appTopBarRoutesSignedOut.map((val) => (
    <Link href={val.link} key={val.caption}>
      <Button color="inherit">{val.caption}</Button>
    </Link>
  ));

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Hidden smUp>
          <IconButton onClick={toggleDrawer} color="inherit" style={{ marginRight: theme.spacing(2) }}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        {!(loading || error) && (user ? drawerSignedIn : drawerSignedOut)}

        <Link href="/">
          <Typography variant="h6" style={{ cursor: 'pointer' }}>
            Vocabulary Flashcard
          </Typography>
        </Link>

        <Box flex={1} />

        <Hidden xsDown>
          {!(loading || error) && (user ? buttonSignedIn : buttonSignedOut)}
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default AppTopBar;
