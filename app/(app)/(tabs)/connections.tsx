import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { NestText } from '@/components/NestText';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { colors, fonts, space } from '@/constants/theme';
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
          Craft is live with your real tasks. Schoology connects next — no fake schoolwork in the
          list.
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
    gap: space.sm,
  },
  list: {
    gap: space.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: space.lg,
    gap: space.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.sm,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  error: {
    color: colors.urgent,
  },
});
