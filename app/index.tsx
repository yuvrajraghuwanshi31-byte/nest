import { Redirect, router } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FocusBlock, FocusLine, StickyScene } from '@/components/landing/ScrollFocus';
import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { Button } from '@/components/ui/Button';
import { colors, fonts, layout, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

export default function LandingScreen() {
  const { user, ready } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: vh, width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const wide = width >= layout.breakpoint;

  const navH = insets.top + 64;
  // Spacer (navH) + hero panel (vh - navH) => first sticky starts at vh
  const sceneOneStart = vh;
  const sceneOneScreens = 2.4;
  const sceneTwoStart = sceneOneStart + vh * sceneOneScreens;
  const sceneTwoScreens = 3.1;
  const afterSticky = sceneTwoStart + vh * sceneTwoScreens;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, vh * 0.55, vh * 0.9],
      [1, 0.55, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(scrollY.value, [0, vh * 0.9], [1, 0.92], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [0, vh * 0.9], [0, -40], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const navStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 48], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.leaf} />
      </View>
    );
  }

  if (user) return <Redirect href="/home" />;

  return (
    <View style={styles.root}>
      <View style={[styles.nav, { paddingTop: insets.top + space.sm }]}>
        <Animated.View style={[styles.navBg, navStyle]} />
        <NestLogo size={32} />
        <View style={styles.navActions}>
          <Pressable onPress={() => router.push('/login')}>
            <NestText variant="meta" style={styles.navLink}>
              Sign in
            </NestText>
          </Pressable>
          <Button label="Get Nest" onPress={() => router.push('/signup')} style={styles.navCta} />
        </View>
      </View>

      <Animated.ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: insets.bottom + space.xxl }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}>
        {/* Spacer for fixed nav */}
        <View style={{ height: navH }} />

        {/* Hero — dissolves as you leave */}
        <View style={[styles.hero, { height: vh - navH }]}>
          <Animated.View style={[styles.heroInner, heroStyle]}>
            <Image
              source={require('../assets/images/nest-logo.png')}
              style={styles.heroLogo}
              resizeMode="cover"
              accessibilityLabel="Nest"
            />
            <NestText variant="brand" style={styles.brand}>
              Nest
            </NestText>
            <NestText variant="title" style={styles.headline}>
              Know what to do next.
            </NestText>
            <NestText variant="subtitle" style={styles.support}>
              Schoolwork and Craft todos, ranked into one calm list.
            </NestText>
            <View style={styles.actions}>
              <Button
                label="Create account"
                onPress={() => router.push('/signup')}
                style={styles.cta}
              />
              <Button
                label="Sign in"
                variant="secondary"
                onPress={() => router.push('/login')}
                style={styles.cta}
              />
            </View>
            <NestText variant="meta" style={styles.scrollHint}>
              Scroll
            </NestText>
          </Animated.View>
        </View>

        {/* Sticky story: one place */}
        <StickyScene scrollY={scrollY} start={sceneOneStart} screens={sceneOneScreens}>
          {(progress) => (
            <View style={styles.stickyInner}>
              <FocusLine progress={progress} from={0.02} to={0.45}>
                <NestText variant="label" style={styles.focusLabel}>
                  One place
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.08} to={0.62}>
                <NestText variant="title" style={[styles.focusTitle, wide && styles.focusTitleWide]}>
                  Schoology and Craft,{'\n'}finally together.
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.28} to={0.88}>
                <NestText variant="subtitle" style={styles.focusBody}>
                  Stop bouncing between tabs. Nest pulls everything into a single focus list for
                  your MacBook and phone.
                </NestText>
              </FocusLine>
            </View>
          )}
        </StickyScene>

        {/* Sticky story: do this / this / this */}
        <StickyScene scrollY={scrollY} start={sceneTwoStart} screens={sceneTwoScreens}>
          {(progress) => (
            <View style={styles.stickyInner}>
              <FocusLine progress={progress} from={0.0} to={0.28}>
                <NestText variant="label" style={styles.focusLabel}>
                  In plain words
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.05} to={0.35}>
                <NestText variant="title" style={[styles.focusTitle, wide && styles.focusTitleWide]}>
                  It tells you what to do.
                </NestText>
              </FocusLine>

              <View style={styles.stack}>
                <FocusLine progress={progress} from={0.22} to={0.55}>
                  <NestText variant="body" style={styles.stackLine}>
                    Finish the lab report.
                  </NestText>
                </FocusLine>
                <FocusLine progress={progress} from={0.4} to={0.72}>
                  <NestText variant="body" style={styles.stackLine}>
                    Outline the DBQ.
                  </NestText>
                </FocusLine>
                <FocusLine progress={progress} from={0.58} to={0.9}>
                  <NestText variant="body" style={styles.stackLine}>
                    Clear your Craft inbox.
                  </NestText>
                </FocusLine>
              </View>
            </View>
          )}
        </StickyScene>

        {/* Continuing scroll reveals */}
        <View style={[styles.after, { paddingTop: space.xxl }]}>
          <FocusBlock scrollY={scrollY} start={afterSticky + 40} fadeOut={false}>
            <NestText variant="label">Connected</NestText>
            <NestText variant="title" style={styles.sectionTitle}>
              Craft is live. Schoology is next.
            </NestText>
            <NestText variant="subtitle" style={styles.sectionBody}>
              Your Craft tasks already sync into Nest. Mark one done here and it updates in Craft.
            </NestText>
          </FocusBlock>

          <FocusBlock
            scrollY={scrollY}
            start={afterSticky + vh * 0.55}
            fadeOut={false}
            style={styles.closing}>
            <NestLogo size={52} showWordmark={false} />
            <NestText variant="title" style={styles.closingTitle}>
              Build your Nest.
            </NestText>
            <NestText variant="subtitle" style={styles.sectionBody}>
              Create an account and open your first focus list in under a minute.
            </NestText>
            <Button
              label="Create account"
              onPress={() => router.push('/signup')}
              style={styles.closingCta}
            />
          </FocusBlock>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.mist,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mist,
  },
  nav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.mist,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  navLink: {
    color: colors.inkMuted,
    fontFamily: fonts.bodyMedium,
  },
  navCta: {
    minHeight: 40,
    paddingHorizontal: space.md,
  },
  hero: {
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  heroInner: {
    gap: space.md,
    maxWidth: 560,
  },
  heroLogo: {
    width: 88,
    height: 88,
    borderRadius: 24,
  },
  brand: {
    fontSize: 56,
    lineHeight: 60,
    color: colors.ink,
  },
  headline: {
    fontSize: 44,
    lineHeight: 50,
    color: colors.ink,
    maxWidth: 520,
  },
  support: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.inkMuted,
    maxWidth: 440,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.sm,
  },
  cta: {
    minWidth: 150,
  },
  scrollHint: {
    marginTop: space.xl,
    color: colors.inkSoft,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stickyInner: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: space.md,
  },
  focusLabel: {
    color: colors.leaf,
  },
  focusTitle: {
    fontSize: 40,
    lineHeight: 46,
    maxWidth: 720,
  },
  focusTitleWide: {
    fontSize: 56,
    lineHeight: 62,
  },
  focusBody: {
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 520,
  },
  stack: {
    marginTop: space.lg,
    gap: space.md,
  },
  stackLine: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 42,
    color: colors.ink,
  },
  after: {
    paddingHorizontal: space.lg,
    gap: space.xxl,
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 34,
    lineHeight: 40,
    maxWidth: 640,
    marginTop: space.sm,
  },
  sectionBody: {
    fontSize: 17,
    lineHeight: 28,
    maxWidth: 560,
    marginTop: space.sm,
  },
  closing: {
    gap: space.md,
    paddingVertical: space.xl,
  },
  closingTitle: {
    fontSize: 40,
    lineHeight: 46,
  },
  closingCta: {
    marginTop: space.sm,
    minWidth: 180,
  },
});
