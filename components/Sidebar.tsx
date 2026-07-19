import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { colors, fonts, layout, radius, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';
import { sx } from '@/lib/sx';

const LINKS = [
  { href: '/home', label: 'Focus', hint: 'What to do next' },
  { href: '/tasks', label: 'Tasks', hint: 'Full list' },
  { href: '/connections', label: 'Connections', hint: 'Craft & Schoology' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.sidebar}>
      <View style={styles.brandBlock}>
        <NestLogo size={32} />
        <NestText variant="meta" style={styles.tagline}>
          {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Your focus nest'}
        </NestText>
      </View>

      <View style={styles.nav}>
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Pressable
              key={link.href}
              onPress={() => router.push(link.href)}
              style={sx(styles.link, active && styles.linkActive)}>
              <NestText variant="body" style={sx(styles.linkLabel, active && styles.linkLabelActive)}>
                {link.label}
              </NestText>
              <NestText variant="meta" style={active ? styles.hintActive : styles.hint}>
                {link.hint}
              </NestText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <NestText variant="meta" numberOfLines={1} style={styles.email}>
          {user?.email}
        </NestText>
        <Pressable
          hitSlop={8}
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}>
          <NestText variant="meta" style={styles.signOut}>
            Sign out
          </NestText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: layout.sidebarWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.line,
    backgroundColor: colors.surfaceRaised,
    paddingTop: space.xxl,
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
    justifyContent: 'space-between',
  },
  brandBlock: {
    gap: space.sm,
    paddingHorizontal: space.xs,
    marginBottom: space.xl,
  },
  tagline: {
    color: colors.inkMuted,
  },
  nav: {
    flex: 1,
    gap: space.xxs,
  },
  link: {
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    gap: 2,
  },
  linkActive: {
    backgroundColor: colors.leafSoft,
  },
  linkLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.inkMuted,
  },
  linkLabelActive: {
    color: colors.leafDeep,
    fontFamily: fonts.bodyBold,
  },
  hint: {
    color: colors.inkSoft,
  },
  hintActive: {
    color: colors.leaf,
  },
  footer: {
    paddingHorizontal: space.xs,
    paddingTop: space.md,
    gap: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  email: {
    color: colors.inkSoft,
  },
  signOut: {
    color: colors.leaf,
    fontFamily: fonts.bodyBold,
  },
});
