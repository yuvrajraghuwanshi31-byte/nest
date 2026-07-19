import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChaosLayer } from '@/components/landing/ChaosLayer';
import { FocusStory } from '@/components/landing/FocusStory';
import { Enter, ParallaxLayer, Reveal, StickyScene } from '@/components/landing/ScrollFocus';
import { NestLogo } from '@/components/NestLogo';
import { NestText } from '@/components/NestText';
import { Button } from '@/components/ui/Button';
import { colors, fonts, layout, radius, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';
import { sx } from '@/lib/sx';

export default function LandingScreen() {
  const { user, ready } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: vh, width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const scrollHint = useSharedValue(0);
  const wide = width >= layout.breakpoint;

  const navH = insets.top + 64;
  const heroH = Math.max(vh - 40, wide ? 680 : 580);

  // Story runway: chaos → focus morph (one long sticky)
  const storyStart = heroH;
  const storyScreens = 2.4;
  const actStart = storyStart + vh * storyScreens;

  useEffect(() => {
    scrollHint.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [scrollHint]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, vh * 0.35, vh * 0.7],
      [1, 0.5, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(scrollY.value, [0, vh * 0.7], [0, -36], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  const navStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 32], [0, 1], Extrapolation.CLAMP),
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + scrollHint.value * 0.5,
    transform: [{ translateY: scrollHint.value * 6 }],
  }));

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
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#E4EFE7', colors.mist, '#F7F1E8']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <ParallaxLayer scrollY={scrollY} speed={0.12} style={styles.orbWrap}>
          <View style={sx(styles.orb, styles.orbA)} />
          <View style={sx(styles.orb, styles.orbB)} />
        </ParallaxLayer>
      </View>

      <View style={sx(styles.nav, { paddingTop: insets.top + space.sm })}>
        <Animated.View style={[styles.navBg, navStyle]} />
        <NestLogo size={32} />
        <View style={styles.navActions}>
          <Pressable onPress={() => router.push('/login')} hitSlop={10}>
            <NestText variant="meta" style={styles.navLink}>
              Sign in
            </NestText>
          </Pressable>
          {wide ? (
            <Button label="Get Nest" onPress={() => router.push('/signup')} style={styles.navCta} />
          ) : null}
        </View>
      </View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + space.xxl }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}>
        {/* Hero — brand only, no product card */}
        <View style={sx(styles.hero, { minHeight: heroH, paddingTop: navH })}>
          <Animated.View style={[styles.heroInner, heroStyle]}>
            <Enter delay={60}>
              <NestText variant="brand" style={sx(styles.brand, wide && styles.brandWide)}>
                Nest
              </NestText>
            </Enter>
            <Enter delay={180}>
              <NestText variant="title" style={sx(styles.headline, wide && styles.headlineWide)}>
                Know what to do next.
              </NestText>
            </Enter>
            <Enter delay={280}>
              <NestText variant="subtitle" style={styles.support}>
                School and Craft, ranked into one calm focus list.
              </NestText>
            </Enter>
            <Enter delay={380}>
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
            </Enter>
          </Animated.View>

          <Animated.View style={[styles.scrollHint, hintStyle]}>
            <NestText variant="meta" style={styles.scrollHintText}>
              See how
            </NestText>
            <View style={styles.scrollLine} />
          </Animated.View>
        </View>

        {/* Story — chaos collapses into Focus UI */}
        <StickyScene scrollY={scrollY} start={storyStart} screens={storyScreens}>
          {(progress) => (
            <View style={styles.storyStage}>
              <ChaosLayer progress={progress} />
              <View style={styles.storyCopy} pointerEvents="none">
                <NestText variant="label">The problem</NestText>
                <NestText variant="title" style={sx(styles.storyTitle, wide && styles.storyTitleWide)}>
                  Too many places.{'\n'}No clear next step.
                </NestText>
              </View>
              <FocusStory progress={progress} />
            </View>
          )}
        </StickyScene>

        {/* Act — complete updates Craft */}
        <View style={styles.act}>
          <Reveal scrollY={scrollY} start={actStart + 20} fadeOut={false}>
            <NestText variant="label">Then act</NestText>
            <NestText variant="title" style={styles.actTitle}>
              Mark it done in Nest.{'\n'}It updates in Craft.
            </NestText>
            <NestText variant="subtitle" style={styles.actBody}>
              One list to decide. One tap to finish. Your tools stay in sync.
            </NestText>
          </Reveal>

          <Reveal
            scrollY={scrollY}
            start={actStart + vh * 0.35}
            fadeOut={false}
            style={styles.closing}>
            <NestLogo size={48} showWordmark={false} />
            <NestText variant="title" style={styles.closingTitle}>
              Build your Nest.
            </NestText>
            <NestText variant="subtitle" style={styles.actBody}>
              Create an account and open your first focus list.
            </NestText>
            <Button
              label="Create account"
              onPress={() => router.push('/signup')}
              style={styles.closingCta}
            />
          </Reveal>
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
  scroll: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mist,
  },
  orbWrap: {
    ...StyleSheet.absoluteFill,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbA: {
    width: 400,
    height: 400,
    top: -80,
    right: -120,
    backgroundColor: 'rgba(47, 106, 79, 0.12)',
  },
  orbB: {
    width: 280,
    height: 280,
    top: 200,
    left: -100,
    backgroundColor: 'rgba(184, 150, 90, 0.1)',
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
    backgroundColor: 'rgba(255, 252, 247, 0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
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
    paddingHorizontal: space.lg,
    justifyContent: 'center',
    position: 'relative',
  },
  heroInner: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: space.sm,
    paddingBottom: space.xxl,
  },
  brand: {
    fontSize: 96,
    lineHeight: 96,
    letterSpacing: -3.5,
    color: colors.ink,
  },
  brandWide: {
    fontSize: 128,
    lineHeight: 120,
    letterSpacing: -5,
  },
  headline: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    maxWidth: 400,
  },
  headlineWide: {
    fontSize: 36,
    lineHeight: 42,
  },
  support: {
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 380,
    color: colors.inkMuted,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.md,
  },
  cta: {
    minWidth: 148,
  },
  scrollHint: {
    position: 'absolute',
    bottom: space.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: space.xs,
  },
  scrollHintText: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 11,
    color: colors.inkSoft,
  },
  scrollLine: {
    width: 1.5,
    height: 28,
    backgroundColor: colors.leaf,
  },
  storyStage: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    minHeight: '80%',
  },
  storyCopy: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    zIndex: 2,
    gap: space.xs,
  },
  storyTitle: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  storyTitleWide: {
    fontSize: 44,
    lineHeight: 50,
  },
  act: {
    paddingHorizontal: space.lg,
    paddingTop: space.xxl,
    gap: space.section,
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  actTitle: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.7,
    marginTop: space.xs,
  },
  actBody: {
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 440,
    marginTop: space.xs,
    color: colors.inkMuted,
  },
  closing: {
    gap: space.sm,
    paddingBottom: space.xxl,
  },
  closingTitle: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.7,
  },
  closingCta: {
    marginTop: space.sm,
    minWidth: 180,
  },
});
