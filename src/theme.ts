import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Blue
    },
    secondary: {
      main: '#10b981', // Green
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
    },
    text: {
      primary: '#0f172a',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 2.25,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.75,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.75,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minWidth: 320,
          minHeight: '100vh',
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
  },
})
