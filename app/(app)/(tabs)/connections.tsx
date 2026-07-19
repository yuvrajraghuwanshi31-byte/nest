import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, radius, space } from '@/constants/theme';
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
        <NestText variant="title">Control school + todos from Nest</NestText>
        <NestText variant="subtitle">
          Paste your Craft API URL here to pull real todos. Schoology connects next.
        </NestText>
      </View>

      <View style={styles.setupCard}>
        <NestText variant="label">Craft API URL</NestText>
        <NestText variant="body" style={styles.setupLine}>
          In Craft: Imagine (sidebar) → Add API Connection → copy the API URL at the top. It looks
          like https://connect.craft.do/links/…/api/v1
        </NestText>

        <TextField
          label="Your Craft API URL"
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
          label={saving || loading ? 'Saving & syncing…' : 'Save & sync Craft'}
          onPress={onSaveAndSync}
          disabled={saving || loading}
        />

        {saveOk && !saveError ? (
          <NestText variant="meta" style={styles.ok}>
            Craft URL saved.
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
        label={loading ? 'Syncing…' : 'Sync Craft now'}
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
  if (status === 'demo') return 'Demo';
  return 'Offline';
}

function badgeBg(status: 'connected' | 'disconnected' | 'demo', id: string) {
  if (status === 'connected') return '#1A2A22';
  if (id === 'schoology') return '#152430';
  return '#2A1818';
}

function badgeColor(status: 'connected' | 'disconnected' | 'demo', id: string) {
  if (status === 'connected') return colors.leaf;
  if (id === 'schoology') return colors.schoology;
  return colors.urgent;
}

const styles = StyleSheet.create({
  header: {
    gap: space.xs,
  },
  setupCard: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.sm,
  },
  setupLine: {
    color: colors.inkSoft,
    lineHeight: 22,
  },
  list: {
    gap: space.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.xs,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.xs,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: space.xs,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  error: {
    color: colors.urgent,
  },
  ok: {
    color: colors.leaf,
  },
});
