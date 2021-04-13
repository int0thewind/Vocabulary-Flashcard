/**
 * Middle Center Component
 *
 * This component put any element in the center of the screen
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

import React from 'react';

/** Helper component to bring an HTML element to the center of the screen. */
function MiddleCenter({ children }: React.PropsWithChildren<{}>) {
  const style: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  };
  return <div style={style}>{children}</div>;
}

export default MiddleCenter;
