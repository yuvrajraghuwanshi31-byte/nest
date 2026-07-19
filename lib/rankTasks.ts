import type { Task } from './types';

export type RankedTask = Task & {
  rankScore: number;
  urgency: 'overdue' | 'today' | 'soon' | 'later';
  reason: string;
};

export function rankTasks(tasks: Task[], now = new Date()): RankedTask[] {
  return tasks
    .filter((t) => !t.completed)
    .map((task) => scoreTask(task, now))
    .sort((a, b) => b.rankScore - a.rankScore);
}

export function briefingLine(ranked: RankedTask[]): string {
  if (ranked.length === 0) return 'You’re clear — nothing urgent right now.';

  const overdue = ranked.filter((t) => t.urgency === 'overdue').length;
  const today = ranked.filter((t) => t.urgency === 'today').length;

  if (overdue > 0) {
    return `You have ${overdue} overdue and ${today} due today. Start with the top item.`;
  }
  if (today > 0) {
    return `Focus on ${today} thing${today === 1 ? '' : 's'} due today. Here’s the order.`;
  }
  return `Nothing due today — ${ranked.length} upcoming. Knock out the quick wins first.`;
}

function scoreTask(task: Task, now: Date): RankedTask {
  const due = task.dueAt ? new Date(task.dueAt) : null;
  const minutes = task.estimatedMinutes ?? 30;
  let rankScore = 0;
  let urgency: RankedTask['urgency'] = 'later';
  let reason = 'On your list';

  if (!due) {
    rankScore = 20 - Math.min(minutes, 60) / 10;
    reason = 'No due date — easy to clear';
  } else {
    const hours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hours < 0) {
      urgency = 'overdue';
      rankScore = 200 + Math.min(Math.abs(hours), 72);
      reason = 'Overdue — do this first';
    } else if (isSameDay(due, now)) {
      urgency = 'today';
      rankScore = 140 - hours;
      reason = hours < 6 ? 'Due later today' : 'Due today';
    } else if (hours < 48) {
      urgency = 'soon';
      rankScore = 80 - hours / 2;
      reason = 'Coming up soon';
    } else {
      urgency = 'later';
      rankScore = 40 - hours / 24;
      reason = 'Upcoming';
    }

    // Prefer quick wins when similarly urgent
    rankScore += Math.max(0, 20 - minutes) / 4;
  }

  if (task.source === 'schoology') rankScore += 3;

  return { ...task, rankScore, urgency, reason };
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export type DayBucket = 'overdue' | 'today' | 'upcoming' | 'someday';

export const DAY_BUCKET_LABELS: Record<DayBucket, string> = {
  overdue: 'Overdue',
  today: 'Today',
  upcoming: 'Upcoming',
  someday: 'Someday',
};

export function bucketForTask(task: RankedTask): DayBucket {
  if (task.urgency === 'overdue') return 'overdue';
  if (task.urgency === 'today') return 'today';
  if (task.urgency === 'soon' || (task.dueAt && task.urgency === 'later')) return 'upcoming';
  return 'someday';
}

/** Group ranked tasks into day-board sections (empty sections omitted). */
export function groupTasksByDay(ranked: RankedTask[]): { bucket: DayBucket; label: string; tasks: RankedTask[] }[] {
  const order: DayBucket[] = ['overdue', 'today', 'upcoming', 'someday'];
  const map: Record<DayBucket, RankedTask[]> = {
    overdue: [],
    today: [],
    upcoming: [],
    someday: [],
  };

  for (const task of ranked) {
    map[bucketForTask(task)].push(task);
  }

  return order
    .filter((bucket) => map[bucket].length > 0)
    .map((bucket) => ({
      bucket,
      label: DAY_BUCKET_LABELS[bucket],
      tasks: map[bucket],
    }));
}

export function formatDue(dueAt: string | null, now = new Date()): string {
  if (!dueAt) return 'No due date';
  const due = new Date(dueAt);
  const hours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hours < 0) {
    const ago = Math.abs(hours);
    if (ago < 24) return `Overdue by ${Math.round(ago)}h`;
    return `Overdue by ${Math.round(ago / 24)}d`;
  }
  if (hours < 6) return `Due in ${Math.max(1, Math.round(hours))}h`;
  if (isSameDay(due, now)) {
    return `Today · ${due.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }
  return due.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
