import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { DEMO_CONNECTIONS } from './mockData';
import {
  completeCraftTask,
  craftItemToTask,
  craftTaskId,
  fetchCraftConnection,
  fetchCraftTasks,
  normalizeCraftApiUrl,
} from './craft';
import { briefingLine, rankTasks, type RankedTask } from './rankTasks';
import type { Connection, Task } from './types';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';

type TasksContextValue = {
  tasks: Task[];
  ranked: RankedTask[];
  briefing: string;
  connections: Connection[];
  loading: boolean;
  syncError: string | null;
  craftApiUrl: string;
  craftUrlReady: boolean;
  setCraftApiUrl: (url: string) => void;
  saveCraftApiUrl: (url: string) => Promise<void>;
  refresh: () => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  reopenTask: (id: string) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [craftTasks, setCraftTasks] = useState<Task[]>([]);
  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});
  const [connections, setConnections] = useState<Connection[]>(DEMO_CONNECTIONS);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [craftApiUrl, setCraftApiUrlState] = useState('');
  const [craftUrlReady, setCraftUrlReady] = useState(false);

  const setCraftApiUrl = useCallback((url: string) => {
    setCraftApiUrlState(url);
  }, []);

  const saveCraftApiUrl = useCallback(
    async (url: string) => {
      if (!user) throw new Error('Sign in to save your Craft URL.');
      const normalized = normalizeCraftApiUrl(url);
      if (!normalized) throw new Error('Paste your Craft API URL.');
      if (!normalized.includes('connect.craft.do')) {
        throw new Error('That doesn’t look like a Craft API URL. It should include connect.craft.do');
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            name: user.name || 'Nest user',
            craft_api_url: normalized,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' },
        )
        .select('id')
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Could not save Craft URL to your profile. Try signing out and back in.');
      setCraftApiUrlState(normalized);
    },
    [user],
  );

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setSyncError(null);
    try {
      const url = craftApiUrl || null;
      const [items, connection] = await Promise.all([
        fetchCraftTasks(url),
        fetchCraftConnection(url).catch(() => null),
      ]);
      setCraftTasks(items.map(craftItemToTask));
      setConnections([
        {
          id: 'schoology',
          name: 'Schoology',
          description: 'Assignments, due dates, and course work from your classes.',
          status: 'disconnected',
          lastSyncLabel: 'Coming soon',
        },
        {
          id: 'craft',
          name: 'Craft',
          description: 'Todos sync both ways so Nest stays your single place to act.',
          status: 'connected',
          lastSyncLabel: connection?.space?.name
            ? `Synced · ${connection.space.name}`
            : `Synced · ${items.length} open task${items.length === 1 ? '' : 's'}`,
        },
      ]);
    } catch (e) {
      setCraftTasks([]);
      setSyncError(e instanceof Error ? e.message : 'Could not sync Craft.');
      setConnections([
        {
          id: 'schoology',
          name: 'Schoology',
          description: 'Assignments, due dates, and course work from your classes.',
          status: 'disconnected',
          lastSyncLabel: 'Coming soon',
        },
        {
          id: 'craft',
          name: 'Craft',
          description: 'Todos sync both ways so Nest stays your single place to act.',
          status: 'disconnected',
          lastSyncLabel: 'Couldn’t sync — check your API URL',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user, craftApiUrl]);

  // Load saved Craft URL from the user profile.
  useEffect(() => {
    let mounted = true;

    if (!user) {
      setCraftApiUrlState('');
      setCraftUrlReady(true);
      setCraftTasks([]);
      setLocalCompleted({});
      setConnections(DEMO_CONNECTIONS);
      setSyncError(null);
      return () => {
        mounted = false;
      };
    }

    setCraftUrlReady(false);
    void supabase
      .from('profiles')
      .select('craft_api_url')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        const saved = typeof data?.craft_api_url === 'string' ? data.craft_api_url : '';
        setCraftApiUrlState(saved || process.env.EXPO_PUBLIC_CRAFT_API_URL?.trim() || '');
        setCraftUrlReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  // Sync when user + URL are ready.
  useEffect(() => {
    if (!user || !craftUrlReady) return;
    void refresh();
  }, [user, craftUrlReady, craftApiUrl, refresh]);

  const tasks = useMemo(() => {
    return craftTasks.map((t) => ({
      ...t,
      completed: localCompleted[t.id] ?? t.completed,
    }));
  }, [craftTasks, localCompleted]);

  const ranked = useMemo(() => rankTasks(tasks), [tasks]);
  const briefing = useMemo(() => briefingLine(ranked), [ranked]);

  const completeTask = useCallback(
    async (id: string) => {
      setLocalCompleted((prev) => ({ ...prev, [id]: true }));
      if (id.startsWith('craft:')) {
        try {
          await completeCraftTask(craftTaskId(id), craftApiUrl || null);
        } catch (e) {
          setLocalCompleted((prev) => ({ ...prev, [id]: false }));
          setSyncError(e instanceof Error ? e.message : 'Could not update Craft task.');
        }
      }
    },
    [craftApiUrl],
  );

  const reopenTask = useCallback((id: string) => {
    setLocalCompleted((prev) => ({ ...prev, [id]: false }));
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        ranked,
        briefing,
        connections,
        loading,
        syncError,
        craftApiUrl,
        craftUrlReady,
        setCraftApiUrl,
        saveCraftApiUrl,
        refresh,
        completeTask,
        reopenTask,
      }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
