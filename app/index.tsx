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
import { colors, fonts, layout, radius, space, type } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

export default function LandingScreen() {
  const { user, ready } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: vh, width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const wide = width >= layout.breakpoint;

  const navH = insets.top + 56;
  // Shorter sticky runways = continuous scroll, less waiting between beats
  const sceneOneStart = vh;
  const sceneOneScreens = 1.35;
  const sceneTwoStart = sceneOneStart + vh * sceneOneScreens;
  const sceneTwoScreens = 1.7;
  const afterSticky = sceneTwoStart + vh * sceneTwoScreens;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, vh * 0.35, vh * 0.65],
      [1, 0.7, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(scrollY.value, [0, vh * 0.65], [0, -24], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const navStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 28], [0, 1], Extrapolation.CLAMP);
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
      <View style={[styles.nav, { paddingTop: insets.top + space.xs }]}>
        <Animated.View style={[styles.navBg, navStyle]} />
        <NestLogo size={28} />
        <View style={styles.navActions}>
          <Pressable onPress={() => router.push('/login')} hitSlop={8}>
            <NestText variant="meta" style={styles.navLink}>
              Sign in
            </NestText>
          </Pressable>
          <Button label="Get Nest" onPress={() => router.push('/signup')} style={styles.navCta} />
        </View>
      </View>

      <Animated.ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: insets.bottom + space.xl }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}>
        <View style={{ height: navH }} />

        <View style={[styles.hero, { minHeight: Math.min(vh - navH, 640), paddingBottom: space.xxl }]}>
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

        <StickyScene scrollY={scrollY} start={sceneOneStart} screens={sceneOneScreens}>
          {(progress) => (
            <View style={styles.stickyInner}>
              <FocusLine progress={progress} from={0.0} to={0.4}>
                <NestText variant="label" style={styles.focusLabel}>
                  One place
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.06} to={0.55}>
                <NestText variant="title" style={[styles.focusTitle, wide && styles.focusTitleWide]}>
                  Schoology and Craft,{'\n'}finally together.
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.22} to={0.78}>
                <NestText variant="subtitle" style={styles.focusBody}>
                  Stop bouncing between tabs. Nest pulls everything into a single focus list for
                  your MacBook and phone.
                </NestText>
              </FocusLine>
            </View>
          )}
        </StickyScene>

        <StickyScene scrollY={scrollY} start={sceneTwoStart} screens={sceneTwoScreens}>
          {(progress) => (
            <View style={styles.stickyInner}>
              <FocusLine progress={progress} from={0.0} to={0.3}>
                <NestText variant="label" style={styles.focusLabel}>
                  In plain words
                </NestText>
              </FocusLine>
              <FocusLine progress={progress} from={0.04} to={0.32}>
                <NestText variant="title" style={[styles.focusTitle, wide && styles.focusTitleWide]}>
                  It tells you what to do.
                </NestText>
              </FocusLine>

              <View style={styles.stack}>
                <FocusLine progress={progress} from={0.2} to={0.5}>
                  <NestText variant="body" style={styles.stackLine}>
                    Finish the lab report.
                  </NestText>
                </FocusLine>
                <FocusLine progress={progress} from={0.38} to={0.68}>
                  <NestText variant="body" style={styles.stackLine}>
                    Outline the DBQ.
                  </NestText>
                </FocusLine>
                <FocusLine progress={progress} from={0.56} to={0.88}>
                  <NestText variant="body" style={styles.stackLine}>
                    Clear your Craft inbox.
                  </NestText>
                </FocusLine>
              </View>
            </View>
          )}
        </StickyScene>

        <View style={styles.after}>
          <FocusBlock scrollY={scrollY} start={afterSticky + 20} fadeOut={false}>
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
            start={afterSticky + vh * 0.32}
            fadeOut={false}
            style={styles.closing}>
            <NestLogo size={40} showWordmark={false} />
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
    paddingBottom: space.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.mistDeep,
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
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  heroInner: {
    gap: space.sm,
    maxWidth: 520,
  },
  heroLogo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    marginBottom: space.xxs,
  },
  brand: {
    fontSize: 48,
    lineHeight: 50,
    letterSpacing: -1,
    color: colors.ink,
  },
  headline: {
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.7,
    color: colors.ink,
    maxWidth: 480,
  },
  support: {
    fontSize: type.subtitle.size,
    lineHeight: 22,
    color: colors.inkMuted,
    maxWidth: 400,
    marginTop: space.xxs,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.sm,
  },
  cta: {
    minWidth: 136,
  },
  scrollHint: {
    marginTop: space.lg,
    color: colors.inkSoft,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
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
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.6,
    maxWidth: 640,
  },
  focusTitleWide: {
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -0.8,
  },
  focusBody: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 460,
  },
  stack: {
    marginTop: space.md,
    gap: space.sm,
  },
  stackLine: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  after: {
    paddingHorizontal: space.lg,
    paddingTop: space.xl,
    gap: space.section,
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.4,
    maxWidth: 560,
    marginTop: space.xs,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 480,
    marginTop: space.xs,
  },
  closing: {
    gap: space.sm,
    paddingBottom: space.xxl,
  },
  closingTitle: {
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  closingCta: {
    marginTop: space.xs,
    minWidth: 160,
  },
});
