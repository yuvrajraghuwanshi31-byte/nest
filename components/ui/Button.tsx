import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, space } from '@/constants/theme';

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
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        (pressed || disabled) && styles.dim,
        style,
      ]}>
      <NestText
        variant="body"
        style={[
          styles.label,
          variant === 'primary' && styles.labelOnPrimary,
          variant === 'secondary' && styles.labelOnSecondary,
          variant === 'ghost' && styles.labelOnGhost,
        ]}>
        {label}
      </NestText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: space.lg,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.ink,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  dim: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
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
