import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { TaskRow } from '@/components/TaskRow';
import { Button } from '@/components/ui/Button';
import { colors, fonts, radius, space } from '@/constants/theme';
import { useWideLayout } from '@/hooks/useWideLayout';
import { useTasks } from '@/lib/TasksContext';

export default function DoThisNextScreen() {
  const { ranked, briefing, completeTask, loading, syncError, refresh } = useTasks();
  const wide = useWideLayout();
  const focus = ranked.slice(0, 8);
  const topThree = focus.slice(0, 3);

  return (
    <Screen>
      <Animated.View entering={FadeIn.duration(350)} style={styles.header}>
        {!wide ? <NestLogo size={28} style={styles.mobileBrand} /> : null}
        <NestText variant="label">Do this next</NestText>
        <NestText variant="title" style={styles.headline}>
          {greeting()}, here’s your focus.
        </NestText>
        <NestText variant="subtitle">
          {loading ? 'Pulling your Craft tasks…' : briefing}
        </NestText>
      </Animated.View>

      {syncError ? (
        <View style={styles.errorBlock}>
          <NestText variant="meta" style={styles.errorText}>
            {syncError}
          </NestText>
          <Button label="Try sync again" onPress={() => refresh()} />
        </View>
      ) : null}

      {loading && ranked.length === 0 ? (
        <View style={styles.loadingBlock}>
          <ActivityIndicator color={colors.leaf} />
          <NestText variant="subtitle">Loading your Craft list…</NestText>
        </View>
      ) : null}

      {!loading && topThree.length > 0 ? (
        <View style={styles.speakBlock}>
          <NestText variant="label">In plain words</NestText>
          <NestText variant="body" style={styles.speakLine}>
            You need to do {joinTitles(topThree.map((t) => t.title))}.
          </NestText>
        </View>
      ) : null}

      {!loading && !syncError && ranked.length === 0 ? (
        <View style={styles.speakBlock}>
          <NestText variant="body" style={styles.speakLine}>
            Nothing open in Craft — you’re clear.
          </NestText>
        </View>
      ) : null}

      <View>
        <NestText variant="label" style={styles.listLabel}>
          From your Craft
        </NestText>
        {focus.map((task, index) => (
          <TaskRow
            key={task.id}
            task={task}
            index={index}
            onComplete={completeTask}
            showReason
          />
        ))}
      </View>
    </Screen>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function joinTitles(titles: string[]) {
  if (titles.length === 1) return titles[0];
  if (titles.length === 2) return `${titles[0]}, and ${titles[1]}`;
  return `${titles.slice(0, -1).join(', ')}, and ${titles[titles.length - 1]}`;
}

const styles = StyleSheet.create({
  header: {
    gap: space.xs,
  },
  mobileBrand: {
    marginBottom: space.xxs,
  },
  headline: {
    maxWidth: 560,
  },
  speakBlock: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    gap: space.xs,
  },
  speakLine: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  listLabel: {
    marginBottom: space.xs,
  },
  loadingBlock: {
    gap: space.sm,
    alignItems: 'flex-start',
    paddingVertical: space.sm,
  },
  errorBlock: {
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.urgent,
    backgroundColor: colors.surface,
  },
  errorText: {
    color: colors.urgent,
  },
});
