import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { colors, fonts, radius, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';
import { useTasks } from '@/lib/TasksContext';
import { useWideLayout } from '@/hooks/useWideLayout';

export default function ConnectionsScreen() {
  const { connections, loading, syncError, refresh } = useTasks();
  const { signOut } = useAuth();
  const wide = useWideLayout();

  return (
    <Screen>
      <View style={styles.header}>
        <NestText variant="label">Connections</NestText>
        <NestText variant="title">Control school + todos from Nest</NestText>
        <NestText variant="subtitle">
          Link Craft to pull your real todos. Schoology connects next — no fake schoolwork in the
          list.
        </NestText>
      </View>

      <View style={styles.setupCard}>
        <NestText variant="label">Craft API setup</NestText>
        <NestText variant="body" style={styles.setupLine}>
          In Craft: open <NestText style={styles.setupEm}>Imagine</NestText> in the sidebar →{' '}
          <NestText style={styles.setupEm}>Add API Connection</NestText> → copy your API URL. You
          can manage connections anytime in Craft Settings → API.
        </NestText>
        <NestText variant="body" style={styles.setupLine}>
          In Nest: stay on this screen (Connections on desktop,{' '}
          <NestText style={styles.setupEm}>Connect</NestText> tab on phone) and tap{' '}
          <NestText style={styles.setupEm}>Sync Craft now</NestText> once your API URL is set up.
        </NestText>
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
                style={[
                  styles.badge,
                  {
                    backgroundColor: badgeBg(connection.status, connection.id),
                  },
                ]}>
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
        onPress={() => refresh()}
        disabled={loading}
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
  setupEm: {
    fontFamily: fonts.bodyBold,
    color: colors.ink,
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
});
