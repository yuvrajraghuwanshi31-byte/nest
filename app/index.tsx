import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductPreview } from '@/components/landing/ProductPreview';
import {
  Enter,
  FocusLine,
  ParallaxLayer,
  Reveal,
  StickyScene,
} from '@/components/landing/ScrollFocus';
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

  const navH = insets.top + 60;
  const heroH = Math.max(vh - navH * 0.2, wide ? 720 : 640);

  // Sticky runways
  const sceneOneStart = heroH + navH * 0.5;
  const sceneOneScreens = 1.5;
  const sceneTwoStart = sceneOneStart + vh * sceneOneScreens;
  const sceneTwoScreens = 1.85;
  const afterSticky = sceneTwoStart + vh * sceneTwoScreens;

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
      [0, vh * 0.4, vh * 0.75],
      [1, 0.55, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(scrollY.value, [0, vh * 0.75], [0, -48], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [0, vh * 0.75], [1, 0.97], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const navStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 40], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const hintStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + scrollHint.value * 0.45,
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
      {/* Atmosphere */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#0E1410', colors.mistDeep, '#050505']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <ParallaxLayer scrollY={scrollY} speed={0.18} style={styles.orbWrap}>
          <View style={sx(styles.orb, styles.orbA)} />
          <View style={sx(styles.orb, styles.orbB)} />
        </ParallaxLayer>
      </View>

      {/* Nav */}
      <View style={sx(styles.nav, { paddingTop: insets.top + space.xs })}>
        <Animated.View style={[styles.navBg, navStyle]} />
        <NestLogo size={30} />
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
        {/* —— Hero —— */}
        <View style={sx(styles.hero, { minHeight: heroH, paddingTop: navH + space.md })}>
          <Animated.View style={[sx(styles.heroGrid, wide && styles.heroGridWide), heroStyle]}>
            <View style={sx(styles.heroCopy, wide && styles.heroCopyWide)}>
              <Enter delay={40}>
                <NestLogo size={wide ? 56 : 48} showWordmark={false} />
              </Enter>
              <Enter delay={120}>
                <NestText variant="brand" style={sx(styles.brand, wide && styles.brandWide)}>
                  Nest
                </NestText>
              </Enter>
              <Enter delay={220}>
                <NestText variant="title" style={sx(styles.headline, wide && styles.headlineWide)}>
                  Know what to do next.
                </NestText>
              </Enter>
              <Enter delay={320}>
                <NestText variant="subtitle" style={styles.support}>
                  Schoolwork and Craft todos, ranked into one calm list for your MacBook and phone.
                </NestText>
              </Enter>
              <Enter delay={420}>
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
            </View>

            <Enter delay={380} style={wide ? styles.previewCol : styles.previewColMobile}>
              <ProductPreview wide={wide} />
            </Enter>
          </Animated.View>

          <Animated.View style={[styles.scrollHint, hintStyle]}>
            <NestText variant="meta" style={styles.scrollHintText}>
              Scroll
            </NestText>
            <View style={styles.scrollLine} />
          </Animated.View>
        </View>

        {/* —— Sticky: one place —— */}
        <StickyScene scrollY={scrollY} start={sceneOneStart} screens={sceneOneScreens}>
          {(progress) => (
            <View style={styles.stickyInner}>
              <FocusLine progress={progress} from={0} to={0.38}>
                <NestText variant="label" style={styles.focusLabel}>
                  One place
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.05} to={0.52}>
                <NestText
                  variant="title"
                  style={sx(styles.focusTitle, wide && styles.focusTitleWide)}>
                  Schoology and Craft,{'\n'}finally together.
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.2} to={0.75}>
                <NestText variant="subtitle" style={styles.focusBody}>
                  Stop bouncing between tabs. Nest pulls assignments and todos into a single focus
                  list — ready on your laptop, the same on your phone.
                </NestText>
              </FocusLine>
            </View>
          )}
        </StickyScene>

        {/* —— Sticky: plain words —— */}
        <StickyScene scrollY={scrollY} start={sceneTwoStart} screens={sceneTwoScreens}>
          {(progress) => (
            <View style={styles.stickyInner}>
              <FocusLine progress={progress} from={0} to={0.28}>
                <NestText variant="label" style={styles.focusLabel}>
                  In plain words
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.04} to={0.3}>
                <NestText
                  variant="title"
                  style={sx(styles.focusTitle, wide && styles.focusTitleWide)}>
                  It tells you what to do.
                </NestText>
              </FocusLine>

              <View style={styles.stack}>
                <FocusLine progress={progress} from={0.18} to={0.48}>
                  <NestText variant="body" style={styles.stackLine}>
                    Finish the lab report.
                  </NestText>
                </FocusLine>
                <FocusLine progress={progress} from={0.36} to={0.66}>
                  <NestText variant="body" style={styles.stackLine}>
                    Outline the DBQ.
                  </NestText>
                </FocusLine>
                <FocusLine progress={progress} from={0.54} to={0.88}>
                  <NestText variant="body" style={styles.stackLine}>
                    Clear your Craft inbox.
                  </NestText>
                </FocusLine>
              </View>
            </View>
          )}
        </StickyScene>

        {/* —— After sticky —— */}
        <View style={styles.after}>
          <Reveal scrollY={scrollY} start={afterSticky + 40} fadeOut={false}>
            <NestText variant="label" style={styles.focusLabel}>
              Connected
            </NestText>
            <NestText variant="title" style={styles.sectionTitle}>
              Craft is live. Schoology is next.
            </NestText>
            <NestText variant="subtitle" style={styles.sectionBody}>
              Your Craft tasks already sync into Nest. Mark one done here and it updates there —
              one place to act.
            </NestText>
          </Reveal>

          <Reveal
            scrollY={scrollY}
            start={afterSticky + vh * 0.28}
            fadeOut={false}
            style={styles.closing}>
            <Animated.View entering={FadeIn.duration(600)}>
              <NestLogo size={44} showWordmark={false} />
            </Animated.View>
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
          </Reveal>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.mistDeep,
  },
  scroll: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mistDeep,
  },
  orbWrap: {
    ...StyleSheet.absoluteFill,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbA: {
    width: 420,
    height: 420,
    top: -80,
    right: -120,
    backgroundColor: 'rgba(111, 168, 135, 0.14)',
  },
  orbB: {
    width: 320,
    height: 320,
    top: 220,
    left: -140,
    backgroundColor: 'rgba(91, 164, 208, 0.08)',
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
    backgroundColor: 'rgba(5, 5, 5, 0.88)',
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
    minHeight: 36,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
  },
  hero: {
    paddingHorizontal: space.lg,
    justifyContent: 'center',
    position: 'relative',
  },
  heroGrid: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    gap: space.xxl,
  },
  heroGridWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.section,
  },
  heroCopy: {
    gap: space.sm,
    maxWidth: 520,
  },
  heroCopyWide: {
    flex: 1,
    maxWidth: 480,
  },
  brand: {
    fontSize: 64,
    lineHeight: 66,
    letterSpacing: -1.6,
    color: colors.ink,
    marginTop: space.xs,
  },
  brandWide: {
    fontSize: 80,
    lineHeight: 82,
    letterSpacing: -2,
  },
  headline: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.ink,
    maxWidth: 420,
    marginTop: space.xs,
  },
  headlineWide: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.7,
  },
  support: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
    maxWidth: 400,
    marginTop: space.xxs,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.md,
  },
  cta: {
    minWidth: 140,
  },
  previewCol: {
    flexShrink: 0,
  },
  previewColMobile: {
    marginTop: space.md,
    alignSelf: 'stretch',
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
    color: colors.inkSoft,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  scrollLine: {
    width: 1,
    height: 28,
    backgroundColor: colors.leaf,
    opacity: 0.7,
  },
  stickyInner: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: space.sm,
  },
  focusLabel: {
    color: colors.leaf,
  },
  focusTitle: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.7,
    maxWidth: 640,
  },
  focusTitleWide: {
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -1.1,
  },
  focusBody: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 480,
    color: colors.inkMuted,
  },
  stack: {
    marginTop: space.lg,
    gap: space.md,
  },
  stackLine: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  after: {
    paddingHorizontal: space.lg,
    paddingTop: space.xxl,
    gap: space.section,
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    maxWidth: 560,
    marginTop: space.xs,
  },
  sectionBody: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 480,
    marginTop: space.xs,
    color: colors.inkMuted,
  },
  closing: {
    gap: space.sm,
    paddingBottom: space.xxl,
    paddingTop: space.lg,
  },
  closingTitle: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.7,
  },
  closingCta: {
    marginTop: space.sm,
    minWidth: 168,
  },
});
