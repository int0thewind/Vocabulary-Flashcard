/**
 * App Top Bar Component.
 *
 * This component defines the app's global top bar.
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

import React from 'react';
import Link from 'next/link';
import 'firebase/auth';
import {
  AppBar, Button, Drawer, Hidden, IconButton, Toolbar, Typography, List,
  ListItem, ListItemText, useTheme, useMediaQuery, Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuthState } from 'react-firebase-hooks/auth';
import { appTopBarRoutesSignedIn, appTopBarRoutesSignedOut } from '../lib/routes';
import { appAuth } from '../lib/firebase';

/**
 * App top bar component.
 * This app top bar would be hung on the top of all the pages in this web app.
 *
 * It displayes different routing buttons depends on user log in
 * responsively by the viewport's width.
 */
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
