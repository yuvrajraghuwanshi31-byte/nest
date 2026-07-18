import { Image, StyleSheet, View, type ImageStyle, type ViewStyle } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, fonts, space } from '@/constants/theme';

type Props = {
  size?: number;
  showWordmark?: boolean;
  wordmarkColor?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

export function NestLogo({
  size = 40,
  showWordmark = true,
  wordmarkColor = colors.ink,
  style,
  imageStyle,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <Image
        source={require('../assets/images/nest-logo.png')}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.28,
          },
          imageStyle,
        ]}
        resizeMode="cover"
        accessibilityLabel="Nest logo"
      />
      {showWordmark ? (
        <NestText variant="brand" style={[styles.wordmark, { color: wordmarkColor, fontSize: size * 0.7, lineHeight: size * 0.78 }]}>
          Nest
        </NestText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  wordmark: {
    fontFamily: fonts.display,
    letterSpacing: -0.6,
  },
});
