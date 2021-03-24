import { createMuiTheme } from '@material-ui/core';
import { teal, deepPurple } from '@material-ui/core/colors';

const paletteScheme = {
  primary: { main: teal[700] },
  secondary: { main: deepPurple.A400 },
};

export const lightTheme = createMuiTheme({
  palette: { type: 'light', ...paletteScheme },
});

export const darkTheme = createMuiTheme({
  palette: { type: 'dark', ...paletteScheme },
});
