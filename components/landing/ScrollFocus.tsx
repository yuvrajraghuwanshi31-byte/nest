import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, space } from '@/constants/theme';

type FocusProps = {
  scrollY: SharedValue<number>;
  start: number;
  range?: number;
  fadeOut?: boolean;
  children: ReactNode;
  style?: ViewStyle;
};

/** Snappier focus-in: triggers earlier, shorter travel. */
export function FocusBlock({
  scrollY,
  start,
  range,
  fadeOut = true,
  children,
  style,
}: FocusProps) {
  const { height: vh } = useWindowDimensions();
  const focusRange = range ?? vh * 0.35;

  const animatedStyle = useAnimatedStyle(() => {
    const inStart = start - vh * 0.55;
    const peak = start - vh * 0.12;
    const hold = start + focusRange * 0.45;
    const out = start + focusRange;

    const opacity = fadeOut
      ? interpolate(
          scrollY.value,
          [inStart, peak, hold, out],
          [0.2, 1, 1, 0.28],
          Extrapolation.CLAMP,
        )
      : interpolate(scrollY.value, [inStart, peak], [0.2, 1], Extrapolation.CLAMP);

    const translateY = interpolate(
      scrollY.value,
      [inStart, peak],
      [28, 0],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(scrollY.value, [inStart, peak], [0.985, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

type StickySceneProps = {
  scrollY: SharedValue<number>;
  start: number;
  screens?: number;
  children: (progress: SharedValue<number>) => ReactNode;
};

/**
 * Pinned stage with tighter runway. Content sits mid-viewport without huge dead air.
 */
export function StickyScene({ scrollY, start, screens = 1.45, children }: StickySceneProps) {
  const { height: vh } = useWindowDimensions();
  const runway = Math.max(vh * screens, vh * 1.15);

  const progress = useDerivedValue(() =>
    interpolate(scrollY.value, [start, start + runway], [0, 1], Extrapolation.CLAMP),
  );

  return (
    <View style={{ height: runway, backgroundColor: colors.mist }}>
      <View style={[styles.sticky, { height: vh }]}>{children(progress)}</View>
    </View>
  );
}

/** Line focus windows are shorter so lines snap in quicker. */
export function FocusLine({
  progress,
  from,
  to,
  children,
  style,
}: {
  progress: SharedValue<number>;
  from: number;
  to: number;
  children: ReactNode;
  style?: ViewStyle;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const peak = from + (to - from) * 0.35;
    const opacity = interpolate(
      progress.value,
      [from, peak, to],
      [0.18, 1, 0.22],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(progress.value, [from, peak], [18, 0], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  sticky: {
    position: 'sticky' as 'relative',
    top: 0,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.xxl,
    overflow: 'hidden',
    backgroundColor: colors.mist,
  },
});
