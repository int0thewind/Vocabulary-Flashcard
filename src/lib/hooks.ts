/**
 * React Custom Hooks Module.
 *
 * This module contains React custom hooks, common logics being extracted from components.
 *
 * @author Hanzhi Yin
 * @since 0.1.0
 */

import { useState } from 'react';

/**
 * Custom React hooks that records a binary variable.
 * It exposes two setters in addition to set the variable true or false.
 */
export function useFlag(initialValue?: boolean): [boolean, () => void, () => void] {
  const [flag, setFlag] = useState(initialValue ?? false);
  const flagOn = () => setFlag(true);
  const flagOff = () => setFlag(false);
  return [flag, flagOn, flagOff];
}

/**
 * Custom React hooks that records a binary variable.
 * It exposes a function to alter the binary variable.
 */
export function useToggle(initialValue?: boolean): [boolean, () => void] {
  const [flag, setFlag] = useState(initialValue ?? false);
  const toggle = () => setFlag((v) => !v);
  return [flag, toggle];
}
