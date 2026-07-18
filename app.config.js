/** @type {import('expo/config').ExpoConfig} */

// Public client credentials — safe in frontend; override via .env when needed.
const DEFAULT_SUPABASE_URL = 'https://ymfqedgdbxouctsbhgql.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_MTX9WM16_EkahQ8EWT5TzQ_mXfUakgb';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

module.exports = ({ config }) => ({
  ...config,
  name: 'Nest',
  slug: 'nest',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/images/nest-logo.png',
  scheme: 'nest',
  userInterfaceStyle: 'dark',
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0A0A0A',
      foregroundImage: './assets/images/nest-logo.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/nest-logo.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/nest-logo.png',
        resizeMode: 'contain',
        backgroundColor: '#0A0A0A',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl,
    supabasePublishableKey,
  },
});
