import { ReactNode, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, space } from '@/constants/theme';

const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

/** Soft enter on mount — staggered with `delay`. */
export function Enter({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withTiming(1, { duration: 720, easing: easeOut }),
    );
  }, [delay, t]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [
      { translateY: interpolate(t.value, [0, 1], [28, 0]) },
      { scale: interpolate(t.value, [0, 1], [0.98, 1]) },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

type RevealProps = {
  scrollY: SharedValue<number>;
  start: number;
  range?: number;
  fadeOut?: boolean;
  children: ReactNode;
  style?: ViewStyle;
};

/** Scroll-driven reveal: rises into focus as it enters the viewport. */
export function Reveal({
  scrollY,
  start,
  range,
  fadeOut = false,
  children,
  style,
}: RevealProps) {
  const { height: vh } = useWindowDimensions();
  const focusRange = range ?? vh * 0.4;

  const animatedStyle = useAnimatedStyle(() => {
    const inStart = start - vh * 0.72;
    const peak = start - vh * 0.18;
    const hold = start + focusRange * 0.55;
    const out = start + focusRange;

    const opacity = fadeOut
      ? interpolate(
          scrollY.value,
          [inStart, peak, hold, out],
          [0, 1, 1, 0.15],
          Extrapolation.CLAMP,
        )
      : interpolate(scrollY.value, [inStart, peak], [0, 1], Extrapolation.CLAMP);

    const translateY = interpolate(
      scrollY.value,
      [inStart, peak],
      [40, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

/** @deprecated Prefer Reveal */
export const FocusBlock = Reveal;

type StickySceneProps = {
  scrollY: SharedValue<number>;
  start: number;
  screens?: number;
  children: (progress: SharedValue<number>) => ReactNode;
};

/** Pinned stage driven by scroll progress 0→1. */
export function StickyScene({ scrollY, start, screens = 1.55, children }: StickySceneProps) {
  const { height: vh } = useWindowDimensions();
  const runway = Math.max(vh * screens, vh * 1.2);

  const progress = useDerivedValue(() =>
    interpolate(scrollY.value, [start, start + runway], [0, 1], Extrapolation.CLAMP),
  );

  return (
    <View style={{ height: runway, backgroundColor: 'transparent' }}>
      <View style={[styles.sticky, { height: vh }]}>{children(progress)}</View>
    </View>
  );
}

/** Line that sharpens into focus within a sticky scene. */
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
    const peak = from + (to - from) * 0.4;
    const opacity = interpolate(
      progress.value,
      [from, peak, to],
      [0.12, 1, 0.2],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(progress.value, [from, peak], [22, 0], Extrapolation.CLAMP);
    const blurLike = interpolate(progress.value, [from, peak], [0.97, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale: blurLike }],
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

/** Ambient vertical drift for background layers. */
export function ParallaxLayer({
  scrollY,
  speed = 0.25,
  children,
  style,
}: {
  scrollY: SharedValue<number>;
  speed?: number;
  children: ReactNode;
  style?: ViewStyle;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * speed }],
  }));

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
  },
});
