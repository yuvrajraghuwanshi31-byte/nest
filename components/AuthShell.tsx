import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { colors, radius, shadow, space } from '@/constants/theme';
import { sx } from '@/lib/sx';

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
      <LinearGradient
        colors={['#E8F0EA', colors.mist, '#F7F2EA']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={sx(styles.content, {
          paddingTop: insets.top + space.xxl,
          paddingBottom: insets.bottom + space.xxl,
        })}
        keyboardShouldPersistTaps="handled">
        <View style={styles.panel}>
          <Pressable onPress={() => router.push('/')} hitSlop={8}>
            <NestLogo size={34} />
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
    maxWidth: 420,
    gap: space.lg,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.xl,
    ...shadow.lift,
  },
  heading: {
    gap: space.xs,
  },
  form: {
    gap: space.md,
  },
  footer: {
    marginTop: space.xxs,
    alignItems: 'center',
  },
});
