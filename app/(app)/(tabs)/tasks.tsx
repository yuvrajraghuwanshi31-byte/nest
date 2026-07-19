import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { TaskRow } from '@/components/TaskRow';
import { colors, fonts, radius, space } from '@/constants/theme';
import { useTasks } from '@/lib/TasksContext';
import type { TaskSource } from '@/lib/types';
import { sx } from '@/lib/sx';

type Filter = 'all' | TaskSource;

export default function TasksScreen() {
  const { ranked, completeTask } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return ranked;
    return ranked.filter((t) => t.source === filter);
  }, [filter, ranked]);

  return (
    <Screen>
      <View style={styles.header}>
        <NestText variant="label">Everything</NestText>
        <NestText variant="title">All tasks in one place</NestText>
        <NestText variant="subtitle">
          Schoology assignments and Craft todos, merged and sorted by what matters.
        </NestText>
      </View>

      <View style={styles.filters}>
        {(
          [
            ['all', 'All'],
            ['schoology', 'Schoology'],
            ['craft', 'Craft'],
          ] as const
        ).map(([value, label]) => {
          const active = filter === value;
          return (
            <Pressable
              key={value}
              onPress={() => setFilter(value)}
              style={sx(styles.chip, active && styles.chipActive)}>
              <NestText
                variant="meta"
                style={sx(styles.chipText, active && styles.chipTextActive)}>
                {label}
              </NestText>
            </Pressable>
          );
        })}
      </View>

      <View>
        {filtered.map((task, index) => (
          <TaskRow key={task.id} task={task} index={index} onComplete={completeTask} />
        ))}
        {filtered.length === 0 ? (
          <NestText variant="subtitle">No open tasks in this filter.</NestText>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space.xs,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  chip: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    color: colors.inkMuted,
  },
  chipTextActive: {
    color: colors.black,
  },
});
