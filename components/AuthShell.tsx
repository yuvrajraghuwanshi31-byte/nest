import { Link } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { colors, space } from '@/constants/theme';

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
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + space.xl,
            paddingBottom: insets.bottom + space.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.panel}>
          <Link href="/">
            <NestLogo size={36} />
          </Link>
          <NestText variant="title">{title}</NestText>
          <NestText variant="subtitle">{subtitle}</NestText>
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
    maxWidth: 440,
    gap: space.md,
  },
  form: {
    gap: space.md,
    marginTop: space.sm,
  },
  footer: {
    marginTop: space.sm,
    gap: space.sm,
  },
});
