import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius, space } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled, style }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          (pressed || disabled) && styles.dim,
          style,
        ])
      }>
      <NestText
        variant="body"
        style={StyleSheet.flatten([
          styles.label,
          variant === 'primary' && styles.labelOnPrimary,
          variant === 'secondary' && styles.labelOnSecondary,
          variant === 'ghost' && styles.labelOnGhost,
        ])}>
        {label}
      </NestText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.ink,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  dim: {
    opacity: 0.65,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  labelOnPrimary: {
    color: colors.black,
  },
  labelOnSecondary: {
    color: colors.ink,
  },
  labelOnGhost: {
    color: colors.leaf,
  },
});
