import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { FocusBriefing } from '@/components/focus/FocusBriefing';
import { FocusStackItem } from '@/components/focus/FocusStackItem';
import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { colors, radius, shadow, space } from '@/constants/theme';
import { useWideLayout } from '@/hooks/useWideLayout';
import { useTasks } from '@/lib/TasksContext';

export default function DoThisNextScreen() {
  const { ranked, briefing, completeTask, loading, syncError, refresh, craftApiUrl } = useTasks();
  const wide = useWideLayout();
  const stack = ranked.slice(0, 5);
  const topThree = stack.slice(0, 3);
  const plainWords =
    topThree.length > 0
      ? `You need to do ${joinTitles(topThree.map((t) => t.title))}.`
      : null;
  const needsCraft = !loading && !craftApiUrl;
  const clear = !loading && !syncError && ranked.length === 0 && !!craftApiUrl;

  return (
    <Screen>
      <Animated.View entering={FadeIn.duration(350)} style={wide ? styles.split : styles.stack}>
        <View style={wide ? styles.briefCol : undefined}>
          {!wide ? <NestLogo size={28} style={styles.mobileBrand} /> : null}

          {loading && ranked.length === 0 ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator color={colors.leaf} />
              <NestText variant="subtitle">Finding what matters…</NestText>
            </View>
          ) : (
            <FocusBriefing
              greeting={`${greeting()}.`}
              briefing={
                needsCraft
                  ? 'Connect Craft to get your first focus list.'
                  : clear
                    ? 'You’re clear — nothing open right now.'
                    : briefing
              }
              plainWords={needsCraft || clear ? null : plainWords}
            />
          )}

          {syncError ? (
            <View style={styles.errorBlock}>
              <NestText variant="meta" style={styles.errorText}>
                {syncError}
              </NestText>
              <Button label="Try again" onPress={() => refresh()} />
            </View>
          ) : null}

          {needsCraft ? (
            <View style={styles.ctaBlock}>
              <Button label="Connect Craft" onPress={() => router.push('/connections')} />
            </View>
          ) : null}
        </View>

        <View style={wide ? styles.stackCol : styles.stackBlock}>
          {stack.length > 0 ? (
            <>
              <NestText variant="label" style={styles.stackLabel}>
                Do this next
              </NestText>
              {stack.map((task, index) => (
                <FocusStackItem
                  key={task.id}
                  task={task}
                  index={index}
                  onComplete={completeTask}
                />
              ))}
              <NestText variant="meta" style={styles.hint}>
                Tap to mark done — Craft updates automatically.
              </NestText>
            </>
          ) : null}
        </View>
      </Animated.View>
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
  split: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xxl,
  },
  stack: {
    gap: space.xl,
  },
  briefCol: {
    flex: 1,
    maxWidth: 480,
    gap: space.lg,
  },
  stackCol: {
    flex: 1,
    maxWidth: 480,
  },
  stackBlock: {
    marginTop: space.sm,
  },
  mobileBrand: {
    marginBottom: space.sm,
  },
  stackLabel: {
    marginBottom: space.sm,
  },
  loadingBlock: {
    gap: space.sm,
    paddingVertical: space.lg,
  },
  errorBlock: {
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.urgent,
    backgroundColor: colors.urgentSoft,
  },
  errorText: {
    color: colors.urgent,
  },
  ctaBlock: {
    marginTop: space.md,
    alignSelf: 'flex-start',
  },
  hint: {
    marginTop: space.sm,
    color: colors.inkSoft,
  },
});
