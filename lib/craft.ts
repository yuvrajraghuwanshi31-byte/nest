import type { Task } from './types';

export type CraftTaskItem = {
  id: string;
  markdown: string;
  taskInfo?: {
    state?: 'todo' | 'done' | 'canceled';
    scheduleDate?: string;
    deadline?: string;
  };
  location?: {
    type?: string;
  };
};

function baseUrl() {
  const url = process.env.EXPO_PUBLIC_CRAFT_API_URL?.replace(/\/$/, '');
  if (!url) throw new Error('Missing EXPO_PUBLIC_CRAFT_API_URL');
  return url;
}

export async function fetchCraftConnection() {
  const res = await fetch(`${baseUrl()}/connection`);
  if (!res.ok) throw new Error(`Craft connection failed (${res.status})`);
  return res.json() as Promise<{
    space?: { name?: string; friendlyDate?: string };
  }>;
}

export async function fetchCraftTasks(): Promise<CraftTaskItem[]> {
  const scopes = ['inbox', 'active', 'upcoming'] as const;
  const results = await Promise.all(
    scopes.map(async (scope) => {
      const res = await fetch(`${baseUrl()}/tasks?scope=${scope}`);
      if (!res.ok) throw new Error(`Craft tasks failed (${res.status})`);
      const data = (await res.json()) as { items?: CraftTaskItem[] };
      return data.items ?? [];
    }),
  );

  const byId = new Map<string, CraftTaskItem>();
  for (const item of results.flat()) {
    if (item.taskInfo?.state === 'done' || item.taskInfo?.state === 'canceled') continue;
    byId.set(item.id, item);
  }
  return [...byId.values()];
}

export async function completeCraftTask(id: string) {
  const res = await fetch(`${baseUrl()}/tasks`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tasksToUpdate: [{ id, taskInfo: { state: 'done' } }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Craft complete failed (${res.status}): ${text}`);
  }
  return res.json();
}

export function craftItemToTask(item: CraftTaskItem): Task {
  return {
    id: `craft:${item.id}`,
    title: titleFromMarkdown(item.markdown),
    courseOrList: item.location?.type ? capitalize(item.location.type) : 'Craft',
    dueAt: dueFromCraft(item),
    source: 'craft',
    completed: item.taskInfo?.state === 'done',
  };
}

function titleFromMarkdown(markdown: string) {
  return markdown
    .replace(/^[-*]\s+\[[ xX]\]\s*/, '')
    .replace(/^#+\s*/, '')
    .trim() || 'Untitled task';
}

function dueFromCraft(item: CraftTaskItem): string | null {
  const raw = item.taskInfo?.deadline || item.taskInfo?.scheduleDate;
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return new Date(`${raw}T17:00:00`).toISOString();
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function craftTaskId(nestId: string) {
  return nestId.startsWith('craft:') ? nestId.slice('craft:'.length) : nestId;
}
