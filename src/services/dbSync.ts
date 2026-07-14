/**
 * Database Sync Service
 * Synchronizes client context databases state with Supabase (PostgreSQL).
 */

import { supabase } from '../config/supabaseClient';
import { Reminder, Task, Habit, Expense } from '../context/AppContext';

/**
 * Sync Reminder CRUD to PostgreSQL
 */
export async function syncReminderToDb(reminder: Reminder, type: 'insert' | 'update' | 'delete' = 'update') {
  if (type === 'delete') {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminder.id);
    if (error) console.error('[DBSync] Delete reminder error:', error);
    return !error;
  }

  const { error } = await supabase
    .from('reminders')
    .upsert({
      id: reminder.id,
      title: reminder.title,
      category: reminder.category,
      due_date: reminder.dueDate,
      due_time: reminder.dueTime,
      priority: reminder.priority,
      recurrence: reminder.recurrence,
      notification: reminder.notification,
      location: reminder.location,
      notes: reminder.notes,
      completed: reminder.completed,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('[DBSync] Upsert reminder error:', error);
  }
  return !error;
}

/**
 * Sync Task CRUD to PostgreSQL
 */
export async function syncTaskToDb(task: Task, type: 'insert' | 'update' | 'delete' = 'update') {
  if (type === 'delete') {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id);
    if (error) console.error('[DBSync] Delete task error:', error);
    return !error;
  }

  const { error } = await supabase
    .from('tasks')
    .upsert({
      id: task.id,
      title: task.title,
      due_date: task.dueDate,
      due_time: task.dueTime,
      priority: task.priority,
      status: task.status,
      notes: task.notes,
      subtasks: JSON.stringify(task.subtasks), // Store subtasks list as JSONB in Postgres
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('[DBSync] Upsert task error:', error);
  }
  return !error;
}

/**
 * Sync Habit CRUD to PostgreSQL
 */
export async function syncHabitToDb(habit: Habit, type: 'insert' | 'update' | 'delete' = 'update') {
  if (type === 'delete') {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habit.id);
    if (error) console.error('[DBSync] Delete habit error:', error);
    return !error;
  }

  const { error } = await supabase
    .from('habits')
    .upsert({
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      frequency: habit.frequency,
      priority: habit.priority,
      target_goal: habit.targetGoal,
      streak: habit.streak,
      longest_streak: habit.longestStreak,
      history: JSON.stringify(habit.history), // Store heatmap history dates log as JSONB in Postgres
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('[DBSync] Upsert habit error:', error);
  }
  return !error;
}

/**
 * Sync Expense CRUD to PostgreSQL
 */
export async function syncExpenseToDb(expense: Expense, type: 'insert' | 'update' | 'delete' = 'update') {
  if (type === 'delete') {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expense.id);
    if (error) console.error('[DBSync] Delete expense error:', error);
    return !error;
  }

  const { error } = await supabase
    .from('expenses')
    .upsert({
      id: expense.id,
      merchant: expense.merchant,
      amount: expense.amount,
      tax: expense.tax,
      date: expense.date,
      category: expense.category,
      items: JSON.stringify(expense.items), // Store items text array as JSONB in Postgres
      payment_method: expense.paymentMethod,
      ocr_processed: expense.ocrProcessed,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('[DBSync] Upsert expense error:', error);
  }
  return !error;
}
