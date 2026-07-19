/**
 * Nest design system — warm paper canvas, charcoal type, forest accent.
 * Calm, finished product aesthetic (not demo / not pure black).
 */
export const colors = {
  // Type
  ink: '#1C1B19',
  inkMuted: '#5C5954',
  inkSoft: '#8A857C',

  // Brand accent
  leaf: '#2F6A4F',
  leafDeep: '#245540',
  leafSoft: '#E6F0EA',
  leafWash: 'rgba(47, 106, 79, 0.12)',

  // Surfaces
  mist: '#F4F1EB',
  mistDeep: '#EBE6DD',
  surface: '#FFFcf7',
  surfaceRaised: '#FFFFFF',
  surfaceHover: '#F7F3EC',

  // Lines
  line: '#E4DFD6',
  lineStrong: '#CFC8BB',

  // Status
  urgent: '#C23B2E',
  urgentSoft: '#F8E8E6',
  soon: '#B86A12',
  soonSoft: '#F8EEDF',
  schoology: '#2F6F9A',
  craft: '#5B4F8A',

  white: '#FFFFFF',
  black: '#0A0A0A',
};

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_600SemiBold_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
};

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const type = {
  brand: { size: 44, line: 48, tracking: -1.2 },
  display: { size: 36, line: 42, tracking: -0.8 },
  title: { size: 28, line: 34, tracking: -0.5 },
  body: { size: 16, line: 24, tracking: 0 },
  subtitle: { size: 16, line: 24, tracking: 0 },
  label: { size: 11, line: 14, tracking: 1.2 },
  meta: { size: 13, line: 18, tracking: 0 },
};

export const layout = {
  maxWidth: 1080,
  sidebarWidth: 248,
  breakpoint: 900,
  contentPad: space.lg,
  rowMinHeight: 56,
};

export const shadow = {
  soft: {
    shadowColor: '#1C1B19',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
  },
  lift: {
    shadowColor: '#1C1B19',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 6,
  },
};
