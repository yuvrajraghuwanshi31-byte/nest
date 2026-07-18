import { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { colors } from '@/constants/theme';

type FocusProps = {
  scrollY: SharedValue<number>;
  /** Absolute scroll offset where this block begins focusing */
  start: number;
  /** Scroll distance over which it holds / exits */
  range?: number;
  /** Fade out after peaking */
  fadeOut?: boolean;
  children: ReactNode;
  style?: ViewStyle;
};

/** Soft Apple-style focus: rises and sharpens as it enters the viewport. */
export function FocusBlock({
  scrollY,
  start,
  range,
  fadeOut = true,
  children,
  style,
}: FocusProps) {
  const { height: vh } = useWindowDimensions();
  const focusRange = range ?? vh * 0.5;

  const animatedStyle = useAnimatedStyle(() => {
    const inStart = start - vh * 0.8;
    const peak = start - vh * 0.28;
    const hold = start + focusRange * 0.4;
    const out = start + focusRange;

    const opacity = fadeOut
      ? interpolate(
          scrollY.value,
          [inStart, peak, hold, out],
          [0.1, 1, 1, 0.18],
          Extrapolation.CLAMP,
        )
      : interpolate(scrollY.value, [inStart, peak], [0.1, 1], Extrapolation.CLAMP);

    const translateY = interpolate(
      scrollY.value,
      [inStart, peak],
      [64, 0],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(scrollY.value, [inStart, peak], [0.93, 1], Extrapolation.CLAMP);

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
  /** How many viewport-heights tall the scroll runway is */
  screens?: number;
  children: (progress: SharedValue<number>) => ReactNode;
};

/**
 * Apple-style sticky stage: pin a full-screen panel while the user scrolls
 * through a taller runway. `progress` goes 0→1 across that runway.
 */
export function StickyScene({ scrollY, start, screens = 2, children }: StickySceneProps) {
  const { height: vh } = useWindowDimensions();
  const runway = Math.max(vh * screens, vh);

  const progress = useDerivedValue(() =>
    interpolate(scrollY.value, [start, start + runway], [0, 1], Extrapolation.CLAMP),
  );

  return (
    <View style={{ height: runway, backgroundColor: colors.mist }}>
      <View style={[styles.sticky, { height: vh }]}>{children(progress)}</View>
    </View>
  );
}

/** Line that snaps into focus within a sticky scene at a progress window. */
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
    const mid = (from + to) / 2;
    const opacity = interpolate(
      progress.value,
      [from, mid, to],
      [0.12, 1, 0.16],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(progress.value, [from, mid], [40, 0], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [from, mid], [0.96, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  sticky: {
    position: 'sticky' as 'relative',
    top: 0,
    justifyContent: 'center',
    paddingHorizontal: 24,
    overflow: 'hidden',
    backgroundColor: colors.mist,
  },
});
