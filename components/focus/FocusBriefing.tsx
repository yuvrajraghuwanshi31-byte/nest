import { StyleSheet, View } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, space } from '@/constants/theme';

type Props = {
  greeting: string;
  briefing: string;
  plainWords?: string | null;
  compact?: boolean;
};

/** Large coach briefing — Nest speaks first. */
export function FocusBriefing({ greeting, briefing, plainWords, compact }: Props) {
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <NestText variant="meta" style={styles.greeting}>
        {greeting}
      </NestText>
      {plainWords ? (
        <NestText variant="brand" style={[styles.plain, compact && styles.plainCompact]}>
          {plainWords}
        </NestText>
      ) : (
        <NestText variant="title" style={[styles.briefing, compact && styles.briefingCompact]}>
          {briefing}
        </NestText>
      )}
      {plainWords ? (
        <NestText variant="subtitle" style={styles.sub}>
          {briefing}
        </NestText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
    maxWidth: 560,
  },
  wrapCompact: {
    maxWidth: '100%',
  },
  greeting: {
    color: colors.inkSoft,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 14,
  },
  plain: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.8,
    color: colors.ink,
  },
  plainCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
  briefing: {
    fontSize: 28,
    lineHeight: 34,
  },
  briefingCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  sub: {
    marginTop: space.xxs,
    maxWidth: 420,
  },
});
