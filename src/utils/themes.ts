// utils/themes.ts
// Theme definitions with CSS variables for slide styling and colorblind-safe chart colors

export const themes = {
  light: {
    '--slide-bg': '#ffffff',
    '--slide-text': '#1a1a1a',
    '--slide-accent': '#3b82f6',
    '--slide-muted': '#6b7280',
    // Okabe-Ito colorblind-safe palette
    '--chart-1': '#0072B2',
    '--chart-2': '#E69F00',
    '--chart-3': '#009E73',
    '--chart-4': '#CC79A7',
    '--chart-5': '#56B4E9',
  },
  dark: {
    '--slide-bg': '#1a1a1a',
    '--slide-text': '#f5f5f5',
    '--slide-accent': '#60a5fa',
    '--slide-muted': '#9ca3af',
    '--chart-1': '#56B4E9',
    '--chart-2': '#E69F00',
    '--chart-3': '#009E73',
    '--chart-4': '#CC79A7',
    '--chart-5': '#0072B2',
  },
  corporate: {
    '--slide-bg': '#1e3a5f',
    '--slide-text': '#ffffff',
    '--slide-accent': '#38bdf8',
    '--slide-muted': '#94a3b8',
    '--chart-1': '#38bdf8',
    '--chart-2': '#fbbf24',
    '--chart-3': '#34d399',
    '--chart-4': '#f472b6',
    '--chart-5': '#818cf8',
  },
  warm: {
    '--slide-bg': '#fffbeb',
    '--slide-text': '#292524',
    '--slide-accent': '#f97316',
    '--slide-muted': '#78716c',
    '--chart-1': '#f97316',
    '--chart-2': '#0072B2',
    '--chart-3': '#10b981',
    '--chart-4': '#8b5cf6',
    '--chart-5': '#ec4899',
  },
  nature: {
    '--slide-bg': '#f0fdf4',
    '--slide-text': '#14532d',
    '--slide-accent': '#10b981',
    '--slide-muted': '#6b7280',
    '--chart-1': '#10b981',
    '--chart-2': '#0072B2',
    '--chart-3': '#f59e0b',
    '--chart-4': '#8b5cf6',
    '--chart-5': '#ec4899',
  },
  highcontrast: {
    '--slide-bg': '#000000',
    '--slide-text': '#ffffff',
    '--slide-accent': '#fbbf24',
    '--slide-muted': '#d1d5db',
    '--chart-1': '#fbbf24',
    '--chart-2': '#38bdf8',
    '--chart-3': '#4ade80',
    '--chart-4': '#f472b6',
    '--chart-5': '#ffffff',
  },
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeColors = typeof themes[ThemeName];

export const DEFAULT_THEME: ThemeName = 'light';

// Theme button metadata for UI
export const themeButtons: { name: ThemeName; label: string; color: string }[] = [
  { name: 'light', label: 'Light', color: '#ffffff' },
  { name: 'dark', label: 'Dark', color: '#1a1a1a' },
  { name: 'corporate', label: 'Corporate', color: '#1e3a5f' },
  { name: 'warm', label: 'Warm', color: '#fffbeb' },
  { name: 'nature', label: 'Nature', color: '#f0fdf4' },
  { name: 'highcontrast', label: 'High Contrast', color: '#000000' },
];

// Helper: returns theme colors, defaults to light for invalid values
export function getTheme(name: string | undefined): ThemeColors {
  if (name && name in themes) {
    return themes[name as ThemeName];
  }
  return themes[DEFAULT_THEME];
}

// Helper: check if a theme name is valid
export function isValidTheme(name: string | undefined): name is ThemeName {
  return typeof name === 'string' && name in themes;
}
