import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius, space } from '@/constants/theme';
import { sx } from '@/lib/sx';

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
        style={sx(styles.input, style as object)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
  },
});
