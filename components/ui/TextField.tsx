import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius, space } from '@/constants/theme';

type Props = TextInputProps & {
  label: string;
};

export function TextField({ label, style, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <NestText variant="label">{label}</NestText>
      <TextInput
        placeholderTextColor={colors.inkSoft}
        {...props}
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.xxs,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.sm,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
});
