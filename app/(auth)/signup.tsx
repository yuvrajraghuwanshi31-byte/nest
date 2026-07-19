import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { NestText } from '@/components/NestText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, space } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

export default function SignupScreen() {
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await signUp({ name, email, password });
      Alert.alert(
        'Connect Craft?',
        'Nest pulls your todos from Craft. In the Craft app, open Imagine in the sidebar → Add API Connection → copy your API URL. Then open Connections in Nest (Connect tab on your phone) and tap Sync Craft now.',
        [
          { text: 'Go to Connections', onPress: () => router.replace('/connections') },
          { text: 'Maybe later', onPress: () => router.replace('/home') },
        ],
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create account.');
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
      title="Create your Nest"
      subtitle="One account for Schoology, Craft, and your daily focus list."
      footer={
        <NestText variant="meta" style={styles.footerText}>
          Already have an account?{' '}
          <Link href="/login" style={styles.link}>
            Sign in
          </Link>
        </NestText>
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
        label="Name"
        autoComplete="name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
      />
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
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
      />
      {error ? (
        <NestText variant="meta" style={styles.error}>
          {error}
        </NestText>
      ) : null}
      <Button
        label={loading ? 'Creating…' : 'Create account'}
        onPress={onSubmit}
        disabled={loading || googleLoading}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.urgent,
  },
  footerText: {
    textAlign: 'center',
  },
  link: {
    color: colors.leaf,
    fontWeight: '700',
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
