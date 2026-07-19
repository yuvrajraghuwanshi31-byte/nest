import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { colors, fonts, layout, radius, space } from '@/constants/theme';
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
    <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(20)}>
      <Pressable
        onPress={() => onComplete(task.id)}
        style={({ pressed }) => StyleSheet.flatten([styles.row, pressed && styles.pressed])}>
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
            <NestText variant="meta" numberOfLines={1}>
              {task.reason}
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
    alignItems: 'flex-start',
    gap: space.sm,
    minHeight: layout.rowMinHeight,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    marginBottom: space.xs,
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
  },
  checkWrap: {
    paddingTop: 2,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.leaf,
    backgroundColor: colors.surfaceRaised,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.xs,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
});
