export type TaskSource = 'schoology' | 'craft';

export type Task = {
  id: string;
  title: string;
  courseOrList?: string;
  dueAt: string | null;
  source: TaskSource;
  completed: boolean;
  notes?: string;
  estimatedMinutes?: number;
};

export type ConnectionStatus = 'connected' | 'disconnected' | 'demo';

export type Connection = {
  id: 'schoology' | 'craft';
  name: string;
  description: string;
  status: ConnectionStatus;
  lastSyncLabel: string;
};
