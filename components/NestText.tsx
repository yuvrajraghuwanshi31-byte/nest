import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, fonts } from '@/constants/theme';

type Variant = 'brand' | 'title' | 'subtitle' | 'body' | 'label' | 'meta';

const styles: Record<Variant, TextStyle> = {
  brand: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.inkSoft,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  meta: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkSoft,
  },
};

export function NestText({
  variant = 'body',
  style,
  ...props
}: TextProps & { variant?: Variant }) {
  return <Text {...props} style={[styles[variant], style]} />;
}
