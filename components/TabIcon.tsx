import { StyleSheet, View, type ColorValue } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius } from '@/constants/theme';
import { sx } from '@/lib/sx';

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
    <View style={sx(styles.wrap, { borderColor: color, backgroundColor: colors.surfaceRaised })}>
      <NestText variant="meta" style={sx(styles.label, { color })}>
        {LABELS[name]}
      </NestText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 13,
  },
});
