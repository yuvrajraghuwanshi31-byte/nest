import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, fonts, type } from '@/constants/theme';

type Variant = 'brand' | 'title' | 'subtitle' | 'body' | 'label' | 'meta';

const styles: Record<Variant, TextStyle> = {
  brand: {
    fontFamily: fonts.display,
    fontSize: type.brand.size,
    lineHeight: type.brand.line,
    letterSpacing: type.brand.tracking,
    color: colors.ink,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: type.title.size,
    lineHeight: type.title.line,
    letterSpacing: type.title.tracking,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: type.subtitle.size,
    lineHeight: type.subtitle.line,
    letterSpacing: type.subtitle.tracking,
    color: colors.inkMuted,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: type.body.size,
    lineHeight: type.body.line,
    letterSpacing: type.body.tracking,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: type.label.size,
    lineHeight: type.label.line,
    letterSpacing: type.label.tracking,
    color: colors.inkSoft,
    textTransform: 'uppercase',
  },
  meta: {
    fontFamily: fonts.bodyMedium,
    fontSize: type.meta.size,
    lineHeight: type.meta.line,
    letterSpacing: type.meta.tracking,
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
