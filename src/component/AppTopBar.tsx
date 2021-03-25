import React from 'react';
import Link from 'next/link';
import 'firebase/auth';
import {
  AppBar, Button, Drawer, Hidden, IconButton, Toolbar, Typography, List,
  ListItem, ListItemText, useTheme, useMediaQuery, Divider, Avatar, Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useUser } from 'reactfire';
import { appTopBarRoutesSignedIn, appTopBarRoutesSignedOut } from '../lib/routes';

function AppTopBar() {
  const user = useUser().data;

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const toggleDrawer = () => setDrawerOpen((pre) => !pre);

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  React.useEffect(() => {
    if (isSmUp) setDrawerOpen(false);
  }, [isSmUp]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Hidden smUp>
          <IconButton onClick={toggleDrawer} color="inherit" style={{ marginRight: theme.spacing(2) }}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Drawer anchor="top" open={drawerOpen} onClose={closeDrawer}>
          <List>
            {(user ? appTopBarRoutesSignedIn : appTopBarRoutesSignedOut).map((val) => (
              <ListItem button key={val.caption}>
                <Link href={val.link}>
                  <ListItemText onClick={closeDrawer}>{val.caption}</ListItemText>
                </Link>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Link href="/">
          <Typography variant="h6" style={{ cursor: 'pointer' }}>
            Vocabulary Flashcard
          </Typography>
        </Link>

        {/* Placeholder */}
        <Box flex={1} />

        <Hidden xsDown>
          {(user ? appTopBarRoutesSignedIn : appTopBarRoutesSignedOut).map((val) => (
            <Link href={val.link} key={val.caption}>
              <Button color="inherit">{val.caption}</Button>
            </Link>
          ))}
          {user && (
            <>
              <Divider orientation="vertical" />
              <Link href="/user">
                <Avatar alt={user.displayName} src={user.photoURL} style={{ cursor: 'pointer' }}>
                  {user.displayName[0].toUpperCase()}
                </Avatar>
              </Link>
            </>
          )}
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default AppTopBar;
