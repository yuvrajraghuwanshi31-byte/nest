import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { FocusStackItem } from '@/components/focus/FocusStackItem';
import { NestText } from '@/components/NestText';
import { colors, fonts, radius, shadow, space } from '@/constants/theme';
import type { RankedTask } from '@/lib/rankTasks';

const DEMO_TASKS: RankedTask[] = [
  {
    id: 'demo-1',
    title: 'Finish the lab report',
    courseOrList: 'Chemistry',
    dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    source: 'schoology',
    completed: false,
    rankScore: 150,
    urgency: 'today',
    reason: 'Due later today',
  },
  {
    id: 'demo-2',
    title: 'Outline the DBQ',
    courseOrList: 'APUSH',
    dueAt: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(),
    source: 'schoology',
    completed: false,
    rankScore: 90,
    urgency: 'soon',
    reason: 'Coming up soon',
  },
  {
    id: 'demo-3',
    title: 'Clear Craft inbox',
    courseOrList: 'Personal',
    dueAt: null,
    source: 'craft',
    completed: false,
    rankScore: 40,
    urgency: 'later',
    reason: 'No due date',
  },
];

/** Focus UI that crystallizes as scroll progress rises (landing story). */
export function FocusStory({ progress }: { progress: SharedValue<number> }) {
  const stageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.25, 0.55, 1], [0, 1, 1], Extrapolation.CLAMP);
    const translateY = interpolate(progress.value, [0.25, 0.6], [48, 0], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0.25, 0.6], [0.94, 1], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }, { scale }] };
  });

  const briefStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.4, 0.65], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <Animated.View style={[styles.stage, stageStyle]}>
      <Animated.View style={briefStyle}>
        <NestText variant="label">In plain words</NestText>
        <NestText variant="brand" style={styles.plain}>
          Finish the lab report, outline the DBQ, then clear Craft.
        </NestText>
      </Animated.View>
      <View style={styles.stack}>
        {DEMO_TASKS.map((task, index) => (
          <FocusStackItem key={task.id} task={task} index={index} interactive={false} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    maxWidth: 520,
    gap: space.lg,
    alignSelf: 'center',
  },
  plain: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.ink,
    marginTop: space.xs,
    marginBottom: space.sm,
  },
  stack: {
    backgroundColor: colors.mistDeep,
    borderRadius: radius.xl,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.lift,
  },
});
