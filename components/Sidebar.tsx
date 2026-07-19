import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { colors, fonts, layout, radius, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';
import { sx } from '@/lib/sx';

const LINKS = [
  { href: '/home', label: 'Focus', mark: '01' },
  { href: '/tasks', label: 'Board', mark: '02' },
  { href: '/connections', label: 'Connect', mark: '03' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.sidebar}>
      <View style={styles.brandBlock}>
        <NestLogo size={28} showWordmark={false} />
        <NestText variant="brand" style={styles.word}>
          Nest
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
              <NestText variant="meta" style={sx(styles.mark, active && styles.markActive)}>
                {link.mark}
              </NestText>
              <NestText variant="body" style={sx(styles.linkLabel, active && styles.linkLabelActive)}>
                {link.label}
              </NestText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <NestText variant="meta" numberOfLines={1} style={styles.email}>
          {user?.name?.split(' ')[0] || user?.email}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.xs,
    marginBottom: space.xxl,
  },
  word: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.6,
  },
  nav: {
    flex: 1,
    gap: space.xxs,
  },
  link: {
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  linkActive: {
    backgroundColor: colors.leafSoft,
  },
  mark: {
    fontFamily: fonts.bodyBold,
    color: colors.inkSoft,
    minWidth: 22,
  },
  markActive: {
    color: colors.leaf,
  },
  linkLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.inkMuted,
  },
  linkLabelActive: {
    color: colors.leafDeep,
    fontFamily: fonts.bodyBold,
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
