import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius, space } from '@/constants/theme';

type Chip = {
  label: string;
  top: `${number}%`;
  left?: `${number}%`;
  right?: `${number}%`;
  rotate: string;
  color: string;
};

const CHIPS: Chip[] = [
  { label: 'Schoology', top: '8%', left: '4%', rotate: '-8deg', color: colors.schoology },
  { label: 'Craft inbox', top: '22%', right: '6%', rotate: '6deg', color: colors.craft },
  { label: 'Due tonight', top: '48%', left: '10%', rotate: '4deg', color: colors.urgent },
  { label: '3 tabs open', top: '38%', right: '12%', rotate: '-5deg', color: colors.soon },
  { label: 'Which first?', top: '68%', left: '28%', rotate: '-3deg', color: colors.inkMuted },
];

/** Scattered app chaos that collapses as scroll progress rises. */
export function ChaosLayer({ progress }: { progress: SharedValue<number> }) {
  const layerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.45, 0.7], [1, 0.35, 0], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0, 0.7], [1, 0.92], Extrapolation.CLAMP);
    return { opacity, transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.layer, layerStyle]} pointerEvents="none">
      {CHIPS.map((chip) => (
        <View
          key={chip.label}
          style={[
            styles.chip,
            {
              top: chip.top,
              left: chip.left,
              right: chip.right,
              transform: [{ rotate: chip.rotate }],
              borderColor: chip.color,
            },
          ]}>
          <NestText variant="meta" style={[styles.chipText, { color: chip.color }]}>
            {chip.label}
          </NestText>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
  chip: {
    position: 'absolute',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    backgroundColor: colors.surfaceRaised,
  },
  chipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
});
