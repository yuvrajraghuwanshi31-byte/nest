import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/lib/AuthContext';

export default function AuthLayout() {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (user) return <Redirect href="/home" />;

  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
