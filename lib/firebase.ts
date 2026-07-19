import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

type FirebaseExtra = {
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppId?: string;
  firebaseMeasurementId?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as FirebaseExtra;

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim() ||
    extra.firebaseApiKey ||
    'AIzaSyAxVUsAe4egOCN3AGPJaQKuE7fVUVAlruE',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ||
    extra.firebaseAuthDomain ||
    'nest-2d549.firebaseapp.com',
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    extra.firebaseProjectId ||
    'nest-2d549',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    extra.firebaseStorageBucket ||
    'nest-2d549.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ||
    extra.firebaseMessagingSenderId ||
    '906535704218',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID?.trim() ||
    extra.firebaseAppId ||
    '1:906535704218:web:fa98a160de0cc76b2b3123',
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() ||
    extra.firebaseMeasurementId ||
    'G-D93D6JFFM6',
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!firebaseConfig.apiKey || !firebaseConfig.appId) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

/** Analytics only runs in the browser (not SSR / native). */
export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  if (analytics) return analytics;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  analytics = getAnalytics(firebaseApp);
  return analytics;
}

export function getFirebaseAnalytics(): Analytics | null {
  return analytics;
}
