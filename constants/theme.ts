export const colors = {
  ink: '#F4F4F1',
  inkMuted: '#9A9A93',
  inkSoft: '#6A6A64',
  leaf: '#6FA887',
  leafDeep: '#5C8F6F',
  mist: '#0B0B0B',
  mistDeep: '#050505',
  surface: '#121212',
  surfaceRaised: '#1A1A1A',
  surfaceHover: '#222222',
  line: '#2C2C2C',
  lineStrong: '#3A3A3A',
  urgent: '#F04438',
  soon: '#F79009',
  schoology: '#5BA4D0',
  craft: '#9B8EC4',
  white: '#FFFFFF',
  black: '#000000',
};

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_600SemiBold_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
};

/** 4px base scale — use these instead of one-off values */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
  section: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const type = {
  brand: { size: 40, line: 44, tracking: -0.8 },
  display: { size: 36, line: 40, tracking: -0.6 },
  title: { size: 26, line: 30, tracking: -0.4 },
  body: { size: 15, line: 22, tracking: 0 },
  subtitle: { size: 15, line: 22, tracking: 0 },
  label: { size: 11, line: 14, tracking: 0.8 },
  meta: { size: 12, line: 16, tracking: 0 },
};

export const layout = {
  maxWidth: 1040,
  sidebarWidth: 220,
  breakpoint: 900,
  contentPad: space.lg,
  rowMinHeight: 52,
};
