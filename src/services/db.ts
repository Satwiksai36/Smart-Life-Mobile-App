/**
 * SmartLife Database Service (Supabase)
 * 
 * All CRUD operations for every data type.
 * Each function:
 *  - Accepts a userId (Firebase UID) for row-level scoping
 *  - Returns data or logs errors gracefully (never throws to UI)
 *  - Falls back silently so localStorage cache still works offline
 */

import { supabase } from '../config/supabase';
import type {
  Reminder, Task, Expense, Habit, Note, AppNotification
} from '../context/AppContext';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function logError(fn: string, error: unknown) {
  console.warn(`[DB:${fn}]`, error);
}

// ─── REMINDERS ───────────────────────────────────────────────────────────────

export async function fetchReminders(userId: string): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { logError('fetchReminders', error); return []; }
  return (data || []).map(r => ({ ...r, id: r.id, createdAt: r.created_at }));
}

export async function upsertReminder(userId: string, reminder: Reminder): Promise<void> {
  const { error } = await supabase.from('reminders').upsert({
    id: reminder.id,
    user_id: userId,
    title: reminder.title,
    category: reminder.category,
    due_date: reminder.dueDate,
    due_time: reminder.dueTime,
    priority: reminder.priority,
    recurrence: reminder.recurrence,
    notification: reminder.notification,
    notes: reminder.notes,
    completed: reminder.completed,
    created_at: reminder.createdAt,
  });
  if (error) logError('upsertReminder', error);
}

export async function removeReminder(id: string): Promise<void> {
  const { error } = await supabase.from('reminders').delete().eq('id', id);
  if (error) logError('removeReminder', error);
}

// ─── TASKS ───────────────────────────────────────────────────────────────────

export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { logError('fetchTasks', error); return []; }
  return (data || []).map(t => ({
    ...t,
    id: t.id,
    dueDate: t.due_date,
    dueTime: t.due_time,
    subtasks: t.subtasks || [],
    attachments: t.attachments || [],
    createdAt: t.created_at,
  }));
}

export async function upsertTask(userId: string, task: Task): Promise<void> {
  const { error } = await supabase.from('tasks').upsert({
    id: task.id,
    user_id: userId,
    title: task.title,
    due_date: task.dueDate,
    due_time: task.dueTime,
    priority: task.priority,
    status: task.status,
    notes: task.notes,
    subtasks: task.subtasks,
    attachments: task.attachments,
    created_at: task.createdAt,
  });
  if (error) logError('upsertTask', error);
}

export async function removeTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) logError('removeTask', error);
}

// ─── EXPENSES ────────────────────────────────────────────────────────────────

export async function fetchExpenses(userId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) { logError('fetchExpenses', error); return []; }
  return (data || []).map(e => ({
    ...e,
    items: e.items || [],
    createdAt: e.created_at,
  }));
}

export async function upsertExpense(userId: string, expense: Expense): Promise<void> {
  const { error } = await supabase.from('expenses').upsert({
    id: expense.id,
    user_id: userId,
    merchant: expense.merchant,
    date: expense.date,
    amount: expense.amount,
    gst: expense.gst,
    tax: expense.tax,
    payment_method: expense.paymentMethod,
    category: expense.category,
    items: expense.items,
    notes: expense.notes,
    ocr_processed: expense.ocrProcessed || false,
    created_at: expense.createdAt,
  });
  if (error) logError('upsertExpense', error);
}

export async function removeExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) logError('removeExpense', error);
}

// ─── BUDGETS ─────────────────────────────────────────────────────────────────

export async function fetchBudgets(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('budgets')
    .select('category, amount')
    .eq('user_id', userId);
  if (error) { logError('fetchBudgets', error); return {}; }
  const result: Record<string, number> = {};
  (data || []).forEach(b => { result[b.category] = b.amount; });
  return result;
}

export async function upsertBudget(userId: string, category: string, amount: number): Promise<void> {
  const { error } = await supabase.from('budgets').upsert({
    user_id: userId,
    category,
    amount,
  }, { onConflict: 'user_id,category' });
  if (error) logError('upsertBudget', error);
}

// ─── HABITS ──────────────────────────────────────────────────────────────────

export async function fetchHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { logError('fetchHabits', error); return []; }
  return (data || []).map(h => ({
    ...h,
    targetGoal: h.target_goal,
    longestStreak: h.longest_streak,
    history: h.history || {},
    createdAt: h.created_at,
  }));
}

export async function upsertHabit(userId: string, habit: Habit): Promise<void> {
  const { error } = await supabase.from('habits').upsert({
    id: habit.id,
    user_id: userId,
    name: habit.name,
    icon: habit.icon,
    frequency: habit.frequency,
    priority: habit.priority,
    target_goal: habit.targetGoal,
    history: habit.history,
    streak: habit.streak,
    longest_streak: habit.longestStreak,
    created_at: habit.createdAt,
  });
  if (error) logError('upsertHabit', error);
}

export async function removeHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id);
  if (error) logError('removeHabit', error);
}

// ─── NOTES ───────────────────────────────────────────────────────────────────

export async function fetchNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) { logError('fetchNotes', error); return []; }
  return (data || []).map(n => ({
    ...n,
    voiceNotes: n.voice_notes || [],
    updatedAt: n.updated_at,
  }));
}

export async function upsertNote(userId: string, note: Note): Promise<void> {
  const { error } = await supabase.from('notes').upsert({
    id: note.id,
    user_id: userId,
    title: note.title,
    content: note.content,
    color: note.color,
    pinned: note.pinned,
    voice_notes: note.voiceNotes,
    images: note.images,
    updated_at: note.updatedAt,
  });
  if (error) logError('upsertNote', error);
}

export async function removeNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) logError('removeNote', error);
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export async function fetchNotifications(userId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(50);
  if (error) { logError('fetchNotifications', error); return []; }
  return data || [];
}

export async function upsertNotification(userId: string, notif: AppNotification): Promise<void> {
  const { error } = await supabase.from('notifications').upsert({
    id: notif.id,
    user_id: userId,
    title: notif.title,
    body: notif.body,
    timestamp: notif.timestamp,
    read: notif.read,
    category: notif.category,
  });
  if (error) logError('upsertNotification', error);
}

export async function clearAllNotifications(userId: string): Promise<void> {
  const { error } = await supabase.from('notifications').delete().eq('user_id', userId);
  if (error) logError('clearAllNotifications', error);
}

// ─── LOAD ALL (called on login) ──────────────────────────────────────────────

export async function loadAllUserData(userId: string) {
  const [reminders, tasks, expenses, budgets, habits, notes, notifications] = await Promise.all([
    fetchReminders(userId),
    fetchTasks(userId),
    fetchExpenses(userId),
    fetchBudgets(userId),
    fetchHabits(userId),
    fetchNotes(userId),
    fetchNotifications(userId),
  ]);
  return { reminders, tasks, expenses, budgets, habits, notes, notifications };
}
