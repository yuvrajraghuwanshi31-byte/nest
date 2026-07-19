import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, radius, shadow, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';
import { useTasks } from '@/lib/TasksContext';
import { useWideLayout } from '@/hooks/useWideLayout';

type Step = 1 | 2 | 3;

export default function ConnectionsScreen() {
  const { craftApiUrl, saveCraftApiUrl, refresh, loading, syncError, tasks } = useTasks();
  const { signOut } = useAuth();
  const wide = useWideLayout();

  const alreadyConnected = Boolean(craftApiUrl);
  const [step, setStep] = useState<Step>(alreadyConnected ? 3 : 1);
  const [draftUrl, setDraftUrl] = useState(craftApiUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraftUrl(craftApiUrl);
    if (craftApiUrl) setStep(3);
  }, [craftApiUrl]);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveCraftApiUrl(draftUrl);
      await refresh();
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save Craft URL.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <NestText variant="label">Connect</NestText>
        <NestText variant="title">Set up Craft</NestText>
        <View style={styles.steps}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[styles.dot, step >= n && styles.dotActive, step === n && styles.dotCurrent]}
            />
          ))}
        </View>
      </View>

      {step === 1 ? (
        <View style={styles.panel}>
          <NestText variant="brand" style={styles.stepNum}>
            01
          </NestText>
          <NestText variant="title" style={styles.stepTitle}>
            Why Craft?
          </NestText>
          <NestText variant="subtitle" style={styles.stepBody}>
            Nest pulls your todos from Craft, ranks what to do next, and writes completions back —
            so you only decide in one place.
          </NestText>
          <Button label="Continue" onPress={() => setStep(2)} style={styles.primary} />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.panel}>
          <NestText variant="brand" style={styles.stepNum}>
            02
          </NestText>
          <NestText variant="title" style={styles.stepTitle}>
            Paste your API URL
          </NestText>
          <NestText variant="subtitle" style={styles.stepBody}>
            In Craft: Imagine → Add API Connection → copy the URL at the top (ends in /api/v1).
          </NestText>
          <TextField
            label="Craft API URL"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            value={draftUrl}
            onChangeText={setDraftUrl}
            placeholder="https://connect.craft.do/links/…/api/v1"
          />
          {error || syncError ? (
            <NestText variant="meta" style={styles.error}>
              {error || syncError}
            </NestText>
          ) : null}
          <View style={styles.row}>
            <Button label="Back" variant="secondary" onPress={() => setStep(1)} />
            <Button
              label={saving || loading ? 'Connecting…' : 'Save & sync'}
              onPress={onSave}
              disabled={saving || loading}
              style={styles.flexBtn}
            />
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.panel}>
          <NestText variant="brand" style={styles.stepNum}>
            03
          </NestText>
          <NestText variant="title" style={styles.stepTitle}>
            You’re connected
          </NestText>
          <NestText variant="subtitle" style={styles.stepBody}>
            {tasks.length > 0
              ? `${tasks.length} open task${tasks.length === 1 ? '' : 's'} ready in Focus.`
              : 'Craft is linked. New todos will show up in Focus.'}
          </NestText>
          <Button label="Go to Focus" onPress={() => router.push('/home')} style={styles.primary} />
          <Button
            label="Update API URL"
            variant="ghost"
            onPress={() => setStep(2)}
          />
          <Button
            label={loading ? 'Syncing…' : 'Sync now'}
            variant="secondary"
            onPress={() => refresh()}
            disabled={loading}
          />
        </View>
      ) : null}

      <View style={styles.soon}>
        <NestText variant="meta" style={styles.soonLabel}>
          Schoology
        </NestText>
        <NestText variant="body" style={styles.soonTitle}>
          Coming soon
        </NestText>
        <NestText variant="meta">
          Assignments and due dates will land in the same focus stack.
        </NestText>
      </View>

      {!wide ? (
        <Button
          label="Sign out"
          variant="ghost"
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space.sm,
  },
  steps: {
    flexDirection: 'row',
    gap: space.xs,
    marginTop: space.xs,
  },
  dot: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  dotActive: {
    backgroundColor: colors.leafWash,
  },
  dotCurrent: {
    backgroundColor: colors.leaf,
  },
  panel: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.xl,
    gap: space.md,
    ...shadow.soft,
  },
  stepNum: {
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -2,
    color: colors.leaf,
  },
  stepTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  stepBody: {
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 440,
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.xs,
  },
  flexBtn: {
    flex: 1,
  },
  primary: {
    alignSelf: 'flex-start',
    marginTop: space.xs,
  },
  error: {
    color: colors.urgent,
  },
  soon: {
    padding: space.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    gap: space.xxs,
    backgroundColor: colors.surfaceHover,
  },
  soonLabel: {
    color: colors.schoology,
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  soonTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
  },
});
