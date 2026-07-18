import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { colors, fonts, space } from '@/constants/theme';
import { formatDue, type RankedTask } from '@/lib/rankTasks';

type Props = {
  task: RankedTask;
  index: number;
  onComplete: (id: string) => void | Promise<void>;
  showReason?: boolean;
};

export function TaskRow({ task, index, onComplete, showReason = true }: Props) {
  const urgencyColor =
    task.urgency === 'overdue'
      ? colors.urgent
      : task.urgency === 'today'
        ? colors.soon
        : colors.inkSoft;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(18)}>
      <Pressable
        onPress={() => onComplete(task.id)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={styles.checkWrap}>
          <View style={styles.check} />
        </View>

        <View style={styles.content}>
          <View style={styles.topLine}>
            <NestText variant="label" style={{ color: sourceColor(task.source) }}>
              {task.source === 'schoology' ? 'Schoology' : 'Craft'}
              {task.courseOrList ? ` · ${task.courseOrList}` : ''}
            </NestText>
            <NestText variant="meta" style={{ color: urgencyColor, fontFamily: fonts.bodyBold }}>
              {formatDue(task.dueAt)}
            </NestText>
          </View>

          <NestText variant="body" style={styles.title}>
            {index + 1}. {task.title}
          </NestText>

          {showReason ? (
            <NestText variant="meta">{task.reason}
              {task.estimatedMinutes ? ` · ~${task.estimatedMinutes}m` : ''}
            </NestText>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function sourceColor(source: RankedTask['source']) {
  return source === 'schoology' ? colors.schoology : colors.craft;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: space.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
  checkWrap: {
    paddingTop: 4,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.leaf,
    backgroundColor: colors.surfaceRaised,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.sm,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    lineHeight: 24,
  },
});
