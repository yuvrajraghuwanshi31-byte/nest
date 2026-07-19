import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, radius, shadow, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';
import { useTasks } from '@/lib/TasksContext';
import { useWideLayout } from '@/hooks/useWideLayout';
import { sx } from '@/lib/sx';

export default function ConnectionsScreen() {
  const {
    connections,
    loading,
    syncError,
    craftApiUrl,
    saveCraftApiUrl,
    refresh,
  } = useTasks();
  const { signOut } = useAuth();
  const wide = useWideLayout();
  const [draftUrl, setDraftUrl] = useState(craftApiUrl);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    setDraftUrl(craftApiUrl);
  }, [craftApiUrl]);

  const onSaveAndSync = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      await saveCraftApiUrl(draftUrl);
      setSaveOk(true);
      await refresh();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Could not save Craft URL.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <NestText variant="label">Connections</NestText>
        <NestText variant="title">Bring your tools into Nest</NestText>
        <NestText variant="subtitle">
          Link Craft to pull todos into your focus list. Schoology is coming soon.
        </NestText>
      </View>

      <View style={styles.setupCard}>
        <NestText variant="label">Craft</NestText>
        <NestText variant="body" style={styles.setupLine}>
          In Craft, open Imagine → Add API Connection → copy the API URL. Paste it below and save.
        </NestText>

        <TextField
          label="API URL"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          value={draftUrl}
          onChangeText={(text) => {
            setDraftUrl(text);
            setSaveOk(false);
          }}
          placeholder="https://connect.craft.do/links/…/api/v1"
        />

        <Button
          label={saving || loading ? 'Saving…' : 'Save & sync'}
          onPress={onSaveAndSync}
          disabled={saving || loading}
        />

        {saveOk && !saveError ? (
          <NestText variant="meta" style={styles.ok}>
            Connected and syncing.
          </NestText>
        ) : null}
        {saveError ? (
          <NestText variant="meta" style={styles.error}>
            {saveError}
          </NestText>
        ) : null}
      </View>

      <View style={styles.list}>
        {connections.map((connection, index) => (
          <Animated.View
            key={connection.id}
            entering={FadeInDown.delay(index * 80).springify()}
            style={styles.card}>
            <View style={styles.cardTop}>
              <NestText variant="body" style={styles.name}>
                {connection.name}
              </NestText>
              <View
                style={sx(styles.badge, {
                  backgroundColor: badgeBg(connection.status, connection.id),
                })}>
                <NestText
                  variant="meta"
                  style={{
                    color: badgeColor(connection.status, connection.id),
                    fontFamily: fonts.bodyBold,
                  }}>
                  {statusLabel(connection.status)}
                </NestText>
              </View>
            </View>
            <NestText variant="subtitle">{connection.description}</NestText>
            <NestText variant="meta">{connection.lastSyncLabel}</NestText>
          </Animated.View>
        ))}
      </View>

      {syncError ? (
        <NestText variant="meta" style={styles.error}>
          {syncError}
        </NestText>
      ) : null}

      <Button
        label={loading ? 'Syncing…' : 'Sync now'}
        variant="secondary"
        onPress={() => refresh()}
        disabled={loading || saving}
      />

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

function statusLabel(status: 'connected' | 'disconnected' | 'demo') {
  if (status === 'connected') return 'Connected';
  if (status === 'demo') return 'Soon';
  return 'Not connected';
}

function badgeBg(status: 'connected' | 'disconnected' | 'demo', id: string) {
  if (status === 'connected') return colors.leafSoft;
  if (id === 'schoology') return '#E8F1F7';
  return colors.urgentSoft;
}

function badgeColor(status: 'connected' | 'disconnected' | 'demo', id: string) {
  if (status === 'connected') return colors.leafDeep;
  if (id === 'schoology') return colors.schoology;
  return colors.urgent;
}

const styles = StyleSheet.create({
  header: {
    gap: space.xs,
  },
  setupCard: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: space.lg,
    gap: space.md,
    ...shadow.soft,
  },
  setupLine: {
    color: colors.inkMuted,
    lineHeight: 24,
  },
  list: {
    gap: space.sm,
  },
  card: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: space.lg,
    gap: space.xs,
    ...shadow.soft,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.xs,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
  },
  badge: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  error: {
    color: colors.urgent,
  },
  ok: {
    color: colors.leafDeep,
    fontFamily: fonts.bodyBold,
  },
});
