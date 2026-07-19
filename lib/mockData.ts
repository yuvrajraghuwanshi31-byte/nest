import type { Connection } from './types';

export const DEMO_CONNECTIONS: Connection[] = [
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
    lastSyncLabel: 'Add your API URL above',
  },
];
