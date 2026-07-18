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
} from './craft';
import { briefingLine, rankTasks, type RankedTask } from './rankTasks';
import type { Connection, Task } from './types';
import { useAuth } from './AuthContext';

type TasksContextValue = {
  tasks: Task[];
  ranked: RankedTask[];
  briefing: string;
  connections: Connection[];
  loading: boolean;
  syncError: string | null;
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

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setSyncError(null);
    try {
      const [items, connection] = await Promise.all([
        fetchCraftTasks(),
        fetchCraftConnection().catch(() => null),
      ]);
      setCraftTasks(items.map(craftItemToTask));
      setConnections([
        {
          id: 'schoology',
          name: 'Schoology',
          description: 'Pull assignments, due dates, and course work from your classes.',
          status: 'disconnected',
          lastSyncLabel: 'Not connected yet',
        },
        {
          id: 'craft',
          name: 'Craft',
          description: 'Read and update your todos so Nest stays the single place to act.',
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
          description: 'Pull assignments, due dates, and course work from your classes.',
          status: 'disconnected',
          lastSyncLabel: 'Not connected yet',
        },
        {
          id: 'craft',
          name: 'Craft',
          description: 'Read and update your todos so Nest stays the single place to act.',
          status: 'disconnected',
          lastSyncLabel: 'Sync failed',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCraftTasks([]);
      setLocalCompleted({});
      setConnections(DEMO_CONNECTIONS);
      setSyncError(null);
      return;
    }
    refresh();
  }, [user, refresh]);

  const tasks = useMemo(() => {
    // Real Craft tasks only — Schoology stays empty until that API is connected.
    return craftTasks.map((t) => ({
      ...t,
      completed: localCompleted[t.id] ?? t.completed,
    }));
  }, [craftTasks, localCompleted]);

  const ranked = useMemo(() => rankTasks(tasks), [tasks]);
  const briefing = useMemo(() => briefingLine(ranked), [ranked]);

  const completeTask = useCallback(async (id: string) => {
    setLocalCompleted((prev) => ({ ...prev, [id]: true }));
    if (id.startsWith('craft:')) {
      try {
        await completeCraftTask(craftTaskId(id));
      } catch (e) {
        setLocalCompleted((prev) => ({ ...prev, [id]: false }));
        setSyncError(e instanceof Error ? e.message : 'Could not update Craft task.');
      }
    }
  }, []);

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
