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
  ListItem, ListItemText, useTheme, useMediaQuery,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { appTopBarRoutesSignedIn as signInRoute, appTopBarRoutesSignedOut as signOutRoute } from '../lib/routes';
import { useFirebaseUser } from '../lib/firebase';

/**
 * App top bar component.
 * This app top bar would be hung on the top of all the pages in this web app.
 *
 * It displayes different routing buttons responsively by the viewport's width.
 */
function AppTopBar() {
  const [user, loading, error] = useFirebaseUser();

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
          <IconButton onClick={toggleDrawer} color="inherit" style={{ marginRight: theme.spacing(2) }}>
            <MenuIcon />
          </IconButton>
        </Hidden>

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

        {/* Title. Clickable. Route to homepage. */}
        <Link href="/">
          <Typography variant="h6" style={{ cursor: 'pointer' }}>
            Vocabulary Flashcard
          </Typography>
        </Link>

        {/* Placeholder. Push the rest to the very right. */}
        <div style={{ flex: 1 }} />

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
