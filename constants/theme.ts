// Aura Mobile design system tokens from DESIGN.md
export const colors = {
  surface: '#FBF8FC',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F6F2F7',
  surfaceContainer: '#F0EDF1',
  surfaceContainerHigh: '#EAE7EB',
  surfaceContainerHighest: '#E4E1E6',
  onSurface: '#1B1B1E',
  onSurfaceVariant: '#3D4A40',
  outline: '#6C7B6F',
  outlineVariant: '#BBCABD',
  primary: '#006D3E',
  primaryContainer: '#1DBF73',
  onPrimary: '#FFFFFF',
  secondary: '#625595',
  secondaryContainer: '#C6B7FF',
  tertiary: '#732EE4',
  tertiaryContainer: '#B895FF',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  margin: 20,
  gutter: 16,
} as const;

export const rounded = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const elevation = {
  card: {
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
} as const;
