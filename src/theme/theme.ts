import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors, radius, sizing, shadows, motion, fontFamily } from './tokens';

/* Extend the MUI palette with SEITA brand-only hues (cyan / navy / teal) and a
   soft brand surface used by the active nav pill and the login aside. */
declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      cyan: string;
      cyanLight: string;
      navy: string;
      navyDeep: string;
      teal: string;
      tealSoft: string;
      soft: string;
    };
  }
  interface PaletteOptions {
    brand?: Palette['brand'];
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      dark: colors.primary[600],
      light: colors.primary[300],
      contrastText: '#fff',
    },
    secondary: {
      main: colors.secondary[500],
      dark: colors.secondary[700],
      contrastText: '#fff',
    },
    success: { main: colors.success[500], dark: colors.success[600], contrastText: '#fff' },
    warning: { main: colors.warning[500], dark: colors.warning[600], contrastText: '#fff' },
    error: { main: colors.error[500], dark: colors.error[600], contrastText: '#fff' },
    info: { main: colors.info[500], dark: colors.info[600], contrastText: '#fff' },
    background: { default: colors.surface.canvas, paper: colors.surface.card },
    text: { primary: colors.neutral[900], secondary: colors.neutral[500] },
    divider: colors.neutral[200],
    brand: {
      cyan: colors.brand.cyan,
      cyanLight: colors.brand.cyanLight,
      navy: colors.brand.navy,
      navyDeep: colors.brand.navyDeep,
      teal: colors.accent.teal,
      tealSoft: colors.accent.teal50,
      soft: colors.surface.brandSoft,
    },
  },

  typography: {
    fontFamily,
    htmlFontSize: 16,
    // Body starts at 17px; controls/labels never drop below 15px (a11y).
    body1: { fontSize: '1.0625rem', lineHeight: 1.5 },
    body2: { fontSize: '0.9375rem', lineHeight: 1.5 },
    h1: { fontSize: '2.125rem', fontWeight: 900, lineHeight: 1.15 },
    h2: { fontSize: '1.625rem', fontWeight: 900, lineHeight: 1.2 },
    h3: { fontSize: '1.3125rem', fontWeight: 800, lineHeight: 1.3 },
    h4: { fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.3 },
    h5: { fontSize: '1rem', fontWeight: 700 },
    h6: { fontSize: '0.9375rem', fontWeight: 700 },
    subtitle1: { fontSize: '1.1875rem', lineHeight: 1.55 },
    subtitle2: { fontSize: '0.9375rem', fontWeight: 700, color: colors.neutral[500] },
    caption: { fontSize: '0.8125rem', color: colors.neutral[500] },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    button: { fontWeight: 700, textTransform: 'none', fontSize: '1.0625rem' },
  },

  shape: { borderRadius: radius.md },
  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.surface.canvas,
          color: colors.neutral[800],
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: false },
      styleOverrides: {
        root: {
          minHeight: sizing.controlMd,
          borderRadius: radius.md,
          fontWeight: 700,
          letterSpacing: '0.01em',
          paddingInline: 22,
          transition: `background ${motion.fast}ms ${motion.easeStandard}, box-shadow ${motion.fast}ms ${motion.easeStandard}`,
        },
        sizeSmall: { minHeight: sizing.controlSm, fontSize: '0.9375rem', paddingInline: 16 },
        sizeLarge: { minHeight: sizing.controlLg, fontSize: '1.1875rem', paddingInline: 30 },
        containedPrimary: { boxShadow: shadows.e1 },
        outlined: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          backgroundColor: colors.surface.card,
          fontSize: '1.0625rem',
          minHeight: sizing.inputHeight,
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: colors.neutral[300],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.neutral[400] },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary[500],
            boxShadow: shadows.focus,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 700, color: colors.neutral[900], fontSize: '1rem' },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          boxShadow: shadows.e2,
          border: `1px solid ${colors.neutral[100]}`,
        },
      },
    },

    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.pill, fontWeight: 700, fontSize: '0.8125rem' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.neutral[900],
          fontSize: '0.8125rem',
          borderRadius: radius.sm,
          padding: '6px 10px',
        },
      },
    },

    MuiDialog: {
      styleOverrides: { paper: { borderRadius: radius.lg, boxShadow: shadows.e4 } },
    },

    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem', minHeight: 56 },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
export type AppTheme = typeof theme;
