import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { colors, fonts, radius, shadow, space } from '@/constants/theme';
import { formatDue, type RankedTask } from '@/lib/rankTasks';
import { sx } from '@/lib/sx';

type Props = {
  task: RankedTask;
  index: number;
  onComplete?: (id: string) => void | Promise<void>;
  interactive?: boolean;
};

/** Numbered action in the Focus coach stack. */
export function FocusStackItem({ task, index, onComplete, interactive = true }: Props) {
  const dueColor =
    task.urgency === 'overdue'
      ? colors.urgent
      : task.urgency === 'today'
        ? colors.soon
        : colors.inkSoft;

  const body = (
    <View style={styles.row}>
      <NestText variant="brand" style={styles.num}>
        {index + 1}
      </NestText>
      <View style={styles.body}>
        <NestText variant="body" style={styles.title}>
          {task.title}
        </NestText>
        <View style={styles.metaRow}>
          <NestText variant="meta" style={{ color: dueColor, fontFamily: fonts.bodyBold }}>
            {formatDue(task.dueAt)}
          </NestText>
          <NestText variant="meta">
            {task.source === 'schoology' ? 'Schoology' : 'Craft'}
            {task.courseOrList ? ` · ${task.courseOrList}` : ''}
          </NestText>
        </View>
      </View>
    </View>
  );

  if (!interactive || !onComplete) {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).springify().damping(18)}
        style={styles.card}>
        {body}
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(18)}>
      <Pressable
        onPress={() => onComplete(task.id)}
        style={({ pressed }) => sx(styles.card, pressed && styles.pressed)}>
        {body}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    marginBottom: space.sm,
    ...shadow.soft,
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
    transform: [{ scale: 0.992 }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
  },
  num: {
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1.5,
    color: colors.leaf,
    minWidth: 36,
    fontFamily: fonts.display,
  },
  body: {
    flex: 1,
    gap: 6,
    paddingTop: 4,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    lineHeight: 24,
    color: colors.ink,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
});
