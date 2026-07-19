import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { colors, space } from '@/constants/theme';
import { sx } from '@/lib/sx';

/** Quiet entry ritual — mark, title, form. No marketing chrome. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.flex}>
      <ScrollView
        contentContainerStyle={sx(styles.content, {
          paddingTop: insets.top + space.xxl,
          paddingBottom: insets.bottom + space.xxl,
        })}
        keyboardShouldPersistTaps="handled">
        <View style={styles.panel}>
          <Pressable onPress={() => router.push('/')} hitSlop={8} style={styles.brand}>
            <NestLogo size={36} showWordmark={false} />
            <NestText variant="brand" style={styles.word}>
              Nest
            </NestText>
          </Pressable>
          <View style={styles.heading}>
            <NestText variant="title">{title}</NestText>
            <NestText variant="subtitle">{subtitle}</NestText>
          </View>
          <View style={styles.form}>{children}</View>
          <View style={styles.footer}>{footer}</View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.mist },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    alignItems: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 400,
    gap: space.xl,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  word: {
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.8,
  },
  heading: {
    gap: space.xs,
  },
  form: {
    gap: space.md,
  },
  footer: {
    alignItems: 'center',
  },
});
