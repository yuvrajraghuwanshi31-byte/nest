import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { friendlyAuthError, getFirebaseAuth } from './firebase';

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub = () => {};
    try {
      const auth = getFirebaseAuth();
      unsub = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser ? mapUser(firebaseUser) : null);
        setReady(true);
      });
    } catch (e) {
      console.error(e);
      setReady(true);
    }
    return () => unsub();
  }, []);

  const signUp = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const normalized = email.trim().toLowerCase();
      if (!name.trim()) throw new Error('Name is required.');
      if (!normalized.includes('@')) throw new Error('Enter a valid email.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');

      try {
        const auth = getFirebaseAuth();
        const cred = await createUserWithEmailAndPassword(auth, normalized, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        setUser(mapUser(cred.user, name.trim()));
      } catch (e) {
        throw new Error(friendlyAuthError(e));
      }
    },
    [],
  );

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const normalized = email.trim().toLowerCase();
    try {
      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, normalized, password);
      setUser(mapUser(cred.user));
    } catch (e) {
      throw new Error(friendlyAuthError(e));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(getFirebaseAuth());
      setUser(null);
    } catch (e) {
      throw new Error(friendlyAuthError(e));
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, signUp, signIn, signOut }),
    [user, ready, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function mapUser(firebaseUser: FirebaseUser, fallbackName?: string): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || fallbackName || 'Nest user',
    email: firebaseUser.email || '',
  };
}
