import { StyleSheet, View, type ColorValue } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts } from '@/constants/theme';

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
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mist,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 14,
  },
});
