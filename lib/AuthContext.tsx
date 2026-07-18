import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { isSupabaseConfigured, supabase } from './supabase';

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
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setUser(await loadUser(data.session?.user ?? null));
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Avoid awaiting inside the callback; hydrate after event.
      void loadUser(session?.user ?? null).then((next) => {
        if (mounted) setUser(next);
      });
      setReady(true);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
      if (!isSupabaseConfigured) {
        throw new Error(
          'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env, then restart with `npx expo start --web --clear`. On Vercel, set those vars in Project Settings → Environment Variables and redeploy.',
        );
      }
      const normalized = email.trim().toLowerCase();
      if (!name.trim()) throw new Error('Name is required.');
      if (!normalized.includes('@')) throw new Error('Enter a valid email.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');

      const { data, error } = await supabase.auth.signUp({
        email: normalized,
        password,
        options: {
          data: { name: name.trim() },
        },
      });

      if (error) throw new Error(error.message);

      // If email confirmation is required, there may be no session yet.
      if (!data.session) {
        throw new Error(
          'Account created. Check your email to confirm, then sign in. (Or turn off email confirm in Supabase Auth settings for faster testing.)',
        );
      }

      setUser(await loadUser(data.user));
    },
    [],
  );

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env, then restart with `npx expo start --web --clear`. On Vercel, set those vars in Project Settings → Environment Variables and redeploy.',
      );
    }
    const normalized = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    if (error) throw new Error(error.message);
    setUser(await loadUser(data.user));
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
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

type AuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

async function loadUser(user: AuthUser | null): Promise<User | null> {
  if (!user) return null;

  const metaName = user.user_metadata?.name;
  let name =
    typeof metaName === 'string' && metaName.trim()
      ? metaName.trim()
      : user.email?.split('@')[0] || 'Nest user';

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.name?.trim()) name = profile.name.trim();

  return {
    id: user.id,
    name,
    email: user.email ?? '',
  };
}
