import React from 'react';

type Props = React.PropsWithChildren<{}>;

/**
 * Helper component to bring an HTML element to a page's middle.
 */
function MiddleCenter({ children }: Props) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}

export default MiddleCenter;
