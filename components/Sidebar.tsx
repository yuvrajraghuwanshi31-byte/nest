import { Link, router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { colors, fonts, layout, radius, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

const LINKS = [
  { href: '/home', label: 'Do this next', hint: 'Ranked focus' },
  { href: '/tasks', label: 'All tasks', hint: 'Everything' },
  { href: '/connections', label: 'Connections', hint: 'Schoology & Craft' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.sidebar}>
      <View style={styles.brandBlock}>
        <NestLogo size={28} />
        <NestText variant="meta" style={styles.tagline}>
          {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'School + todos'}
        </NestText>
      </View>

      <View style={styles.nav}>
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link key={link.href} href={link.href} asChild>
              <Pressable style={[styles.link, active && styles.linkActive]}>
                <NestText
                  variant="body"
                  style={[styles.linkLabel, active && styles.linkLabelActive]}>
                  {link.label}
                </NestText>
                <NestText variant="meta" style={active ? styles.hintActive : undefined}>
                  {link.hint}
                </NestText>
              </Pressable>
            </Link>
          );
        })}
      </View>

      <View style={styles.footer}>
        <NestText variant="meta" numberOfLines={1}>
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
    backgroundColor: colors.mistDeep,
    paddingTop: space.xl,
    paddingHorizontal: space.sm,
    paddingBottom: space.lg,
    justifyContent: 'space-between',
  },
  brandBlock: {
    gap: space.xs,
    paddingHorizontal: space.xs,
    marginBottom: space.md,
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
    gap: 1,
  },
  linkActive: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
  },
  linkLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.inkMuted,
  },
  linkLabelActive: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
  },
  hintActive: {
    color: colors.inkSoft,
  },
  footer: {
    paddingHorizontal: space.xs,
    paddingTop: space.sm,
    gap: space.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  signOut: {
    color: colors.leaf,
    fontFamily: fonts.bodyBold,
  },
});
