import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { teal, deepOrange } from '@material-ui/core/colors';

const paletteScheme = {
  primary: { main: teal[700] },
  secondary: { main: deepOrange.A400 },
};

export const lightTheme = responsiveFontSizes(createMuiTheme({
  palette: { type: 'light', ...paletteScheme },
}));

export const darkTheme = responsiveFontSizes(createMuiTheme({
  palette: { type: 'dark', ...paletteScheme },
}));
