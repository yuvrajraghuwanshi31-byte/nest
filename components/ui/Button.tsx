import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius, space } from '@/constants/theme';
import { sx } from '@/lib/sx';

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
        sx(
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          (pressed || disabled) && styles.dim,
          style,
        )
      }>
      <NestText
        variant="body"
        style={sx(
          styles.label,
          variant === 'primary' && styles.labelOnPrimary,
          variant === 'secondary' && styles.labelOnSecondary,
          variant === 'ghost' && styles.labelOnGhost,
        )}>
        {label}
      </NestText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.leaf,
  },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  dim: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  labelOnPrimary: {
    color: colors.white,
  },
  labelOnSecondary: {
    color: colors.ink,
  },
  labelOnGhost: {
    color: colors.leaf,
  },
});
