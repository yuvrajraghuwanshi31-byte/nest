import { StyleSheet, View, type ColorValue } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius } from '@/constants/theme';

const LABELS = {
  next: 'N',
  tasks: 'T',
  connect: 'C',
} as const;

export function TabIcon({
  name,
  color,
}: {
  name: keyof typeof LABELS;
  color: ColorValue;
}) {
  return (
    <View style={[styles.wrap, { borderColor: color }]}>
      <NestText variant="meta" style={[styles.label, { color }]}>
        {LABELS[name]}
      </NestText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    lineHeight: 12,
  },
});
