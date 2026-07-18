import type { Connection } from './types';

export const DEMO_CONNECTIONS: Connection[] = [
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
    lastSyncLabel: 'Sign in to sync',
  },
];
