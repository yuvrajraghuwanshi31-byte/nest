import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { NestText } from '@/components/NestText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn({ email, password });
      router.replace('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start Google sign-in.');
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Pick up your focus list where you left off."
      footer={
        <View style={styles.footerRow}>
          <NestText variant="meta" style={styles.footerText}>
            New here?
          </NestText>
          <Pressable onPress={() => router.push('/signup')} hitSlop={6}>
            <NestText variant="meta" style={styles.link}>
              Create an account
            </NestText>
          </Pressable>
        </View>
      }>
      <Button
        label={googleLoading ? 'Opening Google…' : 'Continue with Google'}
        variant="secondary"
        onPress={onGoogle}
        disabled={loading || googleLoading}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <NestText variant="meta" style={styles.dividerText}>
          or email
        </NestText>
        <View style={styles.dividerLine} />
      </View>

      <TextField
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@school.edu"
      />
      <TextField
        label="Password"
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
      />
      {error ? (
        <NestText variant="meta" style={styles.error}>
          {error}
        </NestText>
      ) : null}
      <Button label={loading ? 'Signing in…' : 'Sign in'} onPress={onSubmit} disabled={loading || googleLoading} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.urgent,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    textAlign: 'center',
  },
  link: {
    color: colors.leaf,
    fontFamily: fonts.bodyBold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginVertical: space.xxs,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lineStrong,
  },
  dividerText: {
    color: colors.inkSoft,
    fontFamily: fonts.bodyMedium,
  },
});
