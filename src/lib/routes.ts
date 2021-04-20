/**
 * Routing Module.
 *
 * This module defines which button text should be connected to which endpoint in this app.
 *
 * @author Hanzhi Yin.
 * @since  0.1.0
 */

type RouteType = {
  caption: string,
  link: string,
};

export const appTopBarRoutesSignedIn: RouteType[] = [
  { caption: 'Dashboard', link: '/user' },
  { caption: 'Setting', link: '/user/setting' },
  { caption: 'Sign Out', link: '/signout' },
];

export const appTopBarRoutesSignedOut: RouteType[] = [
  { caption: 'Sign In', link: '/signin' },
];
