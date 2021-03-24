type RouteType = {
  caption: string,
  link: string,
};

export const appTopBarRoutesSignedIn: RouteType[] = [
  { caption: 'Sign Out', link: '/signout' },
];

export const appTopBarRoutesSignedOut: RouteType[] = [
  { caption: 'Sign In', link: '/signin' },
];
