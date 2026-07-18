import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { AuthShell } from '@/components/AuthShell';
import { NestText } from '@/components/NestText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see what you need to do next."
      footer={
        <NestText variant="meta" style={styles.footerText}>
          New here?{' '}
          <Link href="/signup" style={styles.link}>
            Create an account
          </Link>
        </NestText>
      }>
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
      <Button label={loading ? 'Signing in…' : 'Sign in'} onPress={onSubmit} disabled={loading} />
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
});
