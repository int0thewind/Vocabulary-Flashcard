/**
 * React Custom Hooks Module.
 *
 * This module contains React custom hooks, common logics being extracted from components.
 *
 * @author Hanzhi Yin
 * @since 0.1.0
 */

import React from 'react';

/**
 * Custom React hooks that records a binary variable.
 * It exposes two setters in addition to set the variable true or false.
 *
 * A common usage would be recording a dialog's open or close state.
 */
export function useFlag(initialValue?: boolean): [boolean, () => void, () => void] {
  const [flag, setFlag] = React.useState(initialValue ?? false);
  const flagOn = () => setFlag(true);
  const flagOff = () => setFlag(false);
  return [flag, flagOn, flagOff];
}

// Temporary placeholder to suppress ESLint default export error.
export const temp = 3;
