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
import {
  AppBar, Button, Drawer, Hidden, IconButton, Toolbar, Typography, List,
  ListItem, ListItemText, useTheme, useMediaQuery, makeStyles,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { appTopBarRoutesSignedIn as signInRoute, appTopBarRoutesSignedOut as signOutRoute } from '../lib/routes';
import { useFirebaseUser } from '../lib/firebase';
import { appTitle } from '../lib/manifest';
import ConnectionIcon from './ConnectionIndicator';

const appTopBarStyle = makeStyles((theme) => ({
  icon: { marginRight: theme.spacing(2) },
  pointer: { cursor: 'pointer' },
  placeHolder: { flex: 1 },
}));

/**
 * App top bar component.
 * This app top bar would be hung on the top of all the pages in this web app.
 *
 * It displays different routing buttons responsively by the viewport's width.
 */
function AppTopBar() {
  const [user, loading, error] = useFirebaseUser();
  const classes = appTopBarStyle();

  // Drawer opening status control.
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const toggleDrawer = () => setDrawerOpen((pre) => !pre);

  // Close the drawer when the screen is wide enough to display navigation buttons.
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  React.useEffect(() => { if (isSmUp) setDrawerOpen(false); }, [isSmUp]);

  return (
    <AppBar position="sticky">
      <Toolbar>

        {/* Left menu button to open drawer. Only on mobile. */}
        <Hidden smUp>
          <IconButton onClick={toggleDrawer} color="inherit" className={classes.icon}>
            <Menu />
          </IconButton>
        </Hidden>

        {/* Title. Clickable. Route to homepage. */}
        <Link href="/">
          <Typography variant="h6" className={classes.pointer}>
            {appTitle}
          </Typography>
        </Link>

        {/* Placeholder. Push the rest to the very right. */}
        <div className={classes.placeHolder} />

        {/* Connection Indicator */}
        {!(loading || error) && <ConnectionIcon />}

        {/* Routing buttons for mobile devices. */}
        <Drawer anchor="top" open={drawerOpen} onClose={closeDrawer}>
          <List>
            {!(loading || error) && (user ? signInRoute : signOutRoute).map((val) => (
              <ListItem button key={val.caption}>
                <Link href={val.link}>
                  <ListItemText onClick={closeDrawer}>{val.caption}</ListItemText>
                </Link>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Right routing buttons. Only on desktop. */}
        <Hidden xsDown>
          {!(loading || error) && (user ? signInRoute : signOutRoute).map((val) => (
            <Link href={val.link} key={val.caption}>
              <Button color="inherit">{val.caption}</Button>
            </Link>
          ))}
        </Hidden>

      </Toolbar>
    </AppBar>
  );
}

export default AppTopBar;
