import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_SUPABASE_URL = 'https://ymfqedgdbxouctsbhgql.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_MTX9WM16_EkahQ8EWT5TzQ_mXfUakgb';

type SupabaseExtra = {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
};

function readExtra(): SupabaseExtra {
  const constants = Constants as typeof Constants & {
    manifest?: { extra?: SupabaseExtra };
    manifest2?: { extra?: SupabaseExtra };
  };

  return (
    constants.expoConfig?.extra ??
    constants.manifest2?.extra ??
    constants.manifest?.extra ??
    {}
  );
}

const extra = readExtra();

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ||
  extra.supabaseUrl?.trim() ||
  DEFAULT_SUPABASE_URL;

const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  extra.supabasePublishableKey?.trim() ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

/** SSR-safe storage: no-op on server, AsyncStorage in browser/native. */
const authStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return Promise.resolve();
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return Promise.resolve();
    return AsyncStorage.removeItem(key);
  },
};

if (!isSupabaseConfigured) {
  console.warn(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Restart Expo after editing .env.',
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
