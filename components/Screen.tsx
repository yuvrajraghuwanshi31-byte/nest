import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, space } from '@/constants/theme';
import { useWideLayout } from '@/hooks/useWideLayout';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const wide = useWideLayout();

  const body = (
    <View
      style={[
        styles.inner,
        {
          paddingTop: wide ? space.xl : insets.top + space.md,
          paddingBottom: wide ? space.xl : insets.bottom + 96,
          maxWidth: layout.maxWidth,
        },
      ]}>
      {children}
    </View>
  );

  return (
    <View style={styles.flex}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.scrollContent]}>{body}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.mist },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    paddingHorizontal: space.lg,
    gap: space.lg,
  },
});
