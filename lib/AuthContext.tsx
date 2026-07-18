import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = User & { passwordHash: string };

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const USERS_KEY = 'nest.users';
const SESSION_KEY = 'nest.session';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sessionRaw = await AsyncStorage.getItem(SESSION_KEY);
        if (sessionRaw) {
          const session = JSON.parse(sessionRaw) as User;
          setUser(session);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const signUp = useCallback(async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const normalized = email.trim().toLowerCase();
    if (!name.trim()) throw new Error('Name is required.');
    if (!normalized.includes('@')) throw new Error('Enter a valid email.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    const users = await readUsers();
    if (users.some((u) => u.email === normalized)) {
      throw new Error('An account with that email already exists.');
    }

    const passwordHash = await hashPassword(password);
    const nextUser: StoredUser = {
      id: Crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      passwordHash,
    };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]));
    const session = publicUser(nextUser);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }, []);

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const normalized = email.trim().toLowerCase();
    const users = await readUsers();
    const match = users.find((u) => u.email === normalized);
    if (!match) throw new Error('No account found for that email.');

    const passwordHash = await hashPassword(password);
    if (passwordHash !== match.passwordHash) {
      throw new Error('Incorrect password.');
    }

    const session = publicUser(match);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
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

async function readUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

async function hashPassword(password: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `nest:${password}`);
}

function publicUser(user: StoredUser): User {
  return { id: user.id, name: user.name, email: user.email };
}
