import { Link, router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { colors, fonts, layout, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

const LINKS = [
  { href: '/home', label: 'Do this next', hint: 'Your ranked focus list' },
  { href: '/tasks', label: 'All tasks', hint: 'Everything in one place' },
  { href: '/connections', label: 'Connections', hint: 'Schoology & Craft' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <Animated.View entering={FadeInLeft.duration(400)} style={styles.sidebar}>
      <View style={styles.brandBlock}>
        <NestLogo size={34} />
        <NestText variant="meta" style={styles.tagline}>
          {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'School + todos, one place.'}
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
                <NestText variant="meta">{link.hint}</NestText>
              </Pressable>
            </Link>
          );
        })}
      </View>

      <View style={styles.footer}>
        <NestText variant="meta">{user?.email}</NestText>
        <Pressable
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}>
          <NestText variant="meta" style={styles.signOut}>
            Sign out
          </NestText>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: layout.sidebarWidth,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    backgroundColor: colors.mistDeep,
    paddingTop: space.xl,
    paddingHorizontal: space.md,
    paddingBottom: space.lg,
    justifyContent: 'space-between',
  },
  brandBlock: {
    gap: space.sm,
    paddingHorizontal: space.sm,
    marginBottom: space.lg,
  },
  tagline: {
    color: colors.inkMuted,
  },
  nav: {
    flex: 1,
    gap: space.sm,
  },
  link: {
    borderRadius: 14,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.sm + 2,
    gap: 2,
  },
  linkActive: {
    backgroundColor: colors.surface,
  },
  linkLabel: {
    fontFamily: fonts.bodyMedium,
    color: colors.inkMuted,
  },
  linkLabelActive: {
    color: colors.ink,
    fontFamily: fonts.bodyBold,
  },
  footer: {
    paddingHorizontal: space.sm,
    paddingTop: space.md,
    gap: space.sm,
  },
  signOut: {
    color: colors.leaf,
    fontFamily: fonts.bodyBold,
  },
});
