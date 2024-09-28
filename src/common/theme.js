import { createTheme } from '@mui/material/styles'
import { merge, fromPairs, clone, mapValues } from 'lodash'
import 'typeface-inter'

// Defines color palette
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      // main: '#0080FF',
      // main: '#25EBE6',
      main: '#0F2C88',
      contrastText: '#000000',
    },
    secondary: {
      // main: '#625BF6',
      main: '#D58410',
      contrastText: '#ffffff',
    },
    text: {
      // primary: "#EAEAEA",
      // primary: "#B0ADA9",
      primary: '#FFFFFF',
      secondary: '#7C7A7B',
    },
    background: {
      // default: "#191919",
      // default: '#19181A',
      default: '#000000',
      // default: '#1C232B',
      paper: '#2F2F2F',
    },
    error: { main: '#DC362E', light: '#FCEBEB' },
    warning: {
      // main: "#3F3600",
      // main: "#E0BF6A",
      main: '#9E810B',
      dark: '#3F3600',
      // dark: "#9E810B",
    },
  },
})

const fontDefault = {
  fontFamily: 'Inter, sans-serif',
  color: theme.palette.text.primary,
  textTransform: 'none',
}

// Defines default styles
theme = createTheme(theme, {
  spacing: (factor) => `${factor * 0.5}em`,
  shape: {
    borderRadius: 5,
  },
  typography: merge(
    {
      ...clone(fontDefault),
      ...fromPairs(
        [
          'root',
          'allVariants',
          'body1',
          'body2',
          'button',
          'caption',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'inherit',
          'overline',
          'subtitle1',
          'subtitle2',
        ].map((variant) => [variant, clone(fontDefault)]),
      ),
    },
    {
      htmlFontSize: '10px',
      fontSize: '1.25em',
    },
    mapValues(
      {
        root: '1.25em',
        body1: '1.5em',
        body2: '1.25em',
        button: '0.875em',
        caption: '0.75em',
        h1: '6em',
        h2: '3.75em',
        h3: '3em',
        h4: '2.125em',
        h5: '1.5em',
        h6: '1.25em',
        overline: '0.75em',
        subtitle1: '1em',
        subtitle2: '0.875em',
      },
      (fontSize) => ({ fontSize: fontSize }),
    ),
  ),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1em',
          padding: '0.25em',
          color: theme.palette.text.primary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          minWidth: 0,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 30,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { color: theme.palette.text.primary },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75em',
        },
        label: {
          overflow: 'hidden',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          padding: '0.25em 0.5em',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
        },
        content: {
          marginTop: '0.25em',
          marginBottom: '0.25em',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      border: 1,
      borderColor: '#303030',
      borderRadius: 10,
      bgcolor: '#121212',
    },
  },
})

export default theme
