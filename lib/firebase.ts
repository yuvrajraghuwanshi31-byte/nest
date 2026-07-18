import { FirebaseError, initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

function assertConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(
      `Firebase is not configured. Missing: ${missing.join(', ')}. Add EXPO_PUBLIC_FIREBASE_* values to .env`,
    );
  }
}

export function getFirebaseApp() {
  assertConfig();
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let auth: Auth | null = null;

export function getFirebaseAuth() {
  if (auth) return auth;
  auth = getAuth(getFirebaseApp());
  return auth;
}

export function friendlyAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with that email already exists.';
      case 'auth/invalid-email':
        return 'Enter a valid email.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again in a bit.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return error.message;
    }
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}
