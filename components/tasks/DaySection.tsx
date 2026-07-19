import { StyleSheet, View } from 'react-native';

import { NestText } from '@/components/NestText';
import { TaskRow } from '@/components/TaskRow';
import { colors, fonts, space } from '@/constants/theme';
import type { RankedTask } from '@/lib/rankTasks';

type Props = {
  label: string;
  tasks: RankedTask[];
  onComplete: (id: string) => void | Promise<void>;
  startIndex?: number;
};

/** Time-grouped section on the Tasks day board. */
export function DaySection({ label, tasks, onComplete, startIndex = 0 }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <NestText variant="label" style={styles.label}>
          {label}
        </NestText>
        <NestText variant="meta" style={styles.count}>
          {tasks.length}
        </NestText>
      </View>
      {tasks.map((task, i) => (
        <TaskRow
          key={task.id}
          task={task}
          index={startIndex + i}
          onComplete={onComplete}
          showReason={false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: space.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: space.sm,
    paddingBottom: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  label: {
    color: colors.inkMuted,
    letterSpacing: 1.4,
  },
  count: {
    fontFamily: fonts.bodyBold,
    color: colors.inkSoft,
  },
});
