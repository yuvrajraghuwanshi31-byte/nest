import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius, space } from '@/constants/theme';
import { sx } from '@/lib/sx';

const TASKS = [
  { title: 'Finish the lab report', meta: 'Chemistry · due tonight', tone: colors.urgent },
  { title: 'Outline the DBQ', meta: 'APUSH · tomorrow', tone: colors.soon },
  { title: 'Clear Craft inbox', meta: '3 open · personal', tone: colors.leaf },
] as const;

/** Visual product mock — the Nest focus list, as atmosphere. */
export function ProductPreview({ wide }: { wide?: boolean }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.25,
  }));

  return (
    <View style={sx(styles.wrap, wide && styles.wrapWide)}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <View style={styles.frame}>
        <View style={styles.chrome}>
          <View style={styles.dot} />
          <View style={sx(styles.dot, styles.dotMid)} />
          <View style={sx(styles.dot, styles.dotEnd)} />
          <NestText variant="meta" style={styles.chromeLabel}>
            Do this next
          </NestText>
        </View>

        <NestText variant="label" style={styles.label}>
          In plain words
        </NestText>
        <NestText variant="body" style={styles.brief}>
          You need to finish the lab report, outline the DBQ, and clear Craft.
        </NestText>

        <View style={styles.list}>
          {TASKS.map((task) => (
            <View key={task.title} style={styles.row}>
              <View style={sx(styles.tick, { borderColor: task.tone })} />
              <View style={styles.rowText}>
                <NestText variant="body" style={styles.rowTitle}>
                  {task.title}
                </NestText>
                <NestText variant="meta" style={styles.rowMeta}>
                  {task.meta}
                </NestText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 420,
    position: 'relative',
  },
  wrapWide: {
    maxWidth: 440,
  },
  glow: {
    position: 'absolute',
    top: '12%',
    left: '8%',
    right: '8%',
    bottom: '8%',
    backgroundColor: colors.leafDeep,
    borderRadius: radius.xl,
    opacity: 0.4,
    transform: [{ scale: 1.06 }],
  },
  frame: {
    backgroundColor: colors.mistDeep,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    padding: space.lg,
    gap: space.sm,
    overflow: 'hidden',
  },
  chrome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: space.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lineStrong,
  },
  dotMid: {
    backgroundColor: colors.inkSoft,
  },
  dotEnd: {
    backgroundColor: colors.leaf,
  },
  chromeLabel: {
    marginLeft: 'auto',
    color: colors.inkSoft,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  label: {
    color: colors.leaf,
  },
  brief: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: colors.ink,
    marginBottom: space.xs,
  },
  list: {
    gap: space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingVertical: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  tick: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    marginTop: 2,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.ink,
  },
  rowMeta: {
    color: colors.inkSoft,
  },
});
