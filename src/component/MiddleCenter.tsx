/**
 * Middle Center Component
 *
 * This component put any element in the center of the screen
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

import { makeStyles } from '@material-ui/core';
import React from 'react';

const middleCenterStyle = makeStyles({
  middleCenter: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

/** Helper component to bring an HTML element to the center of the screen. */
function MiddleCenter({ children }: React.PropsWithChildren<{}>) {
  const classes = middleCenterStyle();
  return <div className={classes.middleCenter}>{children}</div>;
}

export default MiddleCenter;
