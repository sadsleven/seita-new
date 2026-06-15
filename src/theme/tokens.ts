/**
 * Raw design-system token values, mirrored from `tokens/*.css`. theme.ts wires
 * these into MUI; CSS bits can also read them via `var(--token)` (see
 * styles/global.css). Keep this file in sync with the design system.
 */
export const colors = {
  brand: {
    cyan: '#29ABE2',
    cyanLight: '#6FCFEC',
    navy: '#003596',
    navyDeep: '#002A77',
  },
  primary: {
    50: '#E8F1FD',
    100: '#C7DEFB',
    200: '#93BFF6',
    300: '#5C9CF0',
    400: '#2C7FEA',
    500: '#0A66C2',
    600: '#085AAD',
    700: '#064A8F',
    800: '#053A70',
    900: '#032A52',
  },
  secondary: {
    400: '#1B4FB0',
    500: '#003596',
    600: '#002C7E',
    700: '#002266',
  },
  neutral: {
    0: '#FFFFFF',
    25: '#FAFBFC',
    50: '#F4F4F4',
    100: '#ECEEF1',
    200: '#DCE0E5',
    300: '#C4CAD2',
    400: '#9AA3AE',
    500: '#6C757D',
    600: '#515A63',
    700: '#3B434B',
    800: '#2A3038',
    900: '#1A2332',
  },
  success: { 50: '#E7F4EA', 500: '#2E7D32', 600: '#226628' },
  warning: { 50: '#FBF0E0', 500: '#C77700', 600: '#A55F00' },
  error: { 50: '#FBE9E9', 500: '#C62828', 600: '#A21F1F' },
  info: { 50: '#E3F2F9', 500: '#0277BD', 600: '#015E94' },
  accent: { teal: '#0F9D8C', teal50: '#E4F5F2' },
  surface: {
    canvas: '#F4F4F4',
    card: '#FFFFFF',
    sunken: '#F2F2F2',
    brandSoft: '#EAF1FB', // active nav pill, login aside, soft panels
    overlay: 'rgba(16, 24, 40, 0.55)',
  },
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const sizing = {
  controlSm: 40,
  controlMd: 48,
  controlLg: 56,
  inputHeight: 56,
  tapMin: 48,
  appbarHeight: 68,
  contentMax: 1240,
} as const;

export const shadows = {
  e1: '0 1px 2px rgba(16,24,40,.06),0 1px 3px rgba(16,24,40,.08)',
  e2: '0 2px 4px rgba(16,24,40,.06),0 4px 8px rgba(16,24,40,.08)',
  e3: '0 4px 8px rgba(16,24,40,.07),0 8px 18px rgba(16,24,40,.10)',
  e4: '0 8px 16px rgba(16,24,40,.09),0 16px 32px rgba(16,24,40,.12)',
  focus: '0 0 0 3px #93BFF6',
} as const;

export const motion = {
  easeStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easeEmphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  fast: 120,
  base: 200,
  slow: 320,
} as const;

export const fontFamily =
  "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
