import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NestText } from '@/components/NestText';
import { colors, space } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops' }} />
      <View style={styles.container}>
        <NestText variant="title">This screen doesn’t exist.</NestText>
        <Link href="/" style={styles.link}>
          <NestText variant="body" style={styles.linkText}>
            Back to Nest
          </NestText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
    backgroundColor: colors.mist,
    gap: space.md,
  },
  link: {
    marginTop: space.sm,
    paddingVertical: space.sm,
  },
  linkText: {
    color: colors.leaf,
  },
});
