import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { DaySection } from '@/components/tasks/DaySection';
import { colors, fonts, radius, space } from '@/constants/theme';
import { groupTasksByDay } from '@/lib/rankTasks';
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

  const sections = useMemo(() => groupTasksByDay(filtered), [filtered]);

  let runningIndex = 0;

  return (
    <Screen>
      <View style={styles.header}>
        <NestText variant="label">Board</NestText>
        <NestText variant="title">Your day</NestText>
        <NestText variant="subtitle">
          Grouped by when it matters — overdue first, then today, then what can wait.
        </NestText>
      </View>

      <View style={styles.filters}>
        {(
          [
            ['all', 'All'],
            ['craft', 'Craft'],
            ['schoology', 'Schoology'],
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

      {sections.length === 0 ? (
        <View style={styles.empty}>
          <NestText variant="title" style={styles.emptyTitle}>
            Nothing here
          </NestText>
          <NestText variant="subtitle">You’re clear in this view.</NestText>
        </View>
      ) : (
        sections.map((section) => {
          const start = runningIndex;
          runningIndex += section.tasks.length;
          return (
            <DaySection
              key={section.bucket}
              label={section.label}
              tasks={section.tasks}
              onComplete={completeTask}
              startIndex={start}
            />
          );
        })
      )}
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
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'transparent',
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
    color: colors.white,
    fontFamily: fonts.bodyBold,
  },
  empty: {
    paddingVertical: space.xxl,
    gap: space.xs,
  },
  emptyTitle: {
    fontSize: 24,
  },
});
