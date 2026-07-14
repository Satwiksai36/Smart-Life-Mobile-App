import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  loadAllUserData,
  upsertReminder, removeReminder,
  upsertTask, removeTask,
  upsertExpense, removeExpense, upsertBudget,
  upsertHabit, removeHabit,
  upsertNote, removeNote,
  upsertNotification, clearAllNotifications,
} from '../services/db';
import { queryAiAssistant, type ChatMessage } from '../services/aiService';

// ==========================================
// 1. Interfaces & Types
// ==========================================
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  name: string;
  size: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  notes: string;
  subtasks: SubTask[];
  attachments: Attachment[];
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notification: boolean;
  location?: string;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Expense {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  gst: number;
  tax: number;
  paymentMethod: string;
  category: string;
  items: ReceiptItem[];
  notes: string;
  ocrProcessed?: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  priority: 'high' | 'medium' | 'low';
  targetGoal: number;
  history: { [date: string]: boolean };
  streak: number;
  longestStreak: number;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  voiceNotes: string[];
  images: string[];
  updatedAt: string;
}

export interface ActionPayload {
  type: 'task' | 'habit' | 'budget';
  payload: any;
  label: string;
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: ActionPayload[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  category: 'system' | 'task' | 'reminder' | 'expense' | 'habit';
}

export interface UserProfile {
  name: string;
  email: string;
  photo: string;
  membership: 'free' | 'pro';
  bio: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notificationsEnabled: boolean;
  biometricsEnabled: boolean;
}

interface BudgetLimits {
  [category: string]: number;
}

// ==========================================
// 2. Context Structure Definition
// ==========================================
interface AppContextType {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  user: UserProfile;
  settings: AppSettings;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
  updateSettings: (updatedSettings: Partial<AppSettings>) => void;

  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed' | 'createdAt'>) => void;
  updateReminder: (id: string, updated: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderCompletion: (id: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  budgets: BudgetLimits;
  updateBudgetLimit: (category: string, amount: number) => void;

  ocrProcessing: boolean;
  simulatedOcrScan: (imageName: string) => Promise<Omit<Expense, 'id' | 'createdAt'>>;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'history' | 'streak' | 'longestStreak' | 'createdAt'>) => void;
  updateHabit: (id: string, updated: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCheck: (id: string, date: string) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updated: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  chatHistory: Message[];
  sendChatMessage: (messageText: string) => Promise<void>;
  clearChatHistory: () => void;
  importAiAction: (action: ActionPayload) => void;

  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (title: string, body: string, category: AppNotification['category']) => void;

  refreshApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==========================================
// 3. Helper — unique id generator
// ==========================================
const uid = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

const DEFAULT_PHOTO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4sbohlB_SOS0FjxpVFgjtIlGjAiilx6Q_WhZjy7IXpPYtMJcU0ne7kLOkwooJCkW7trcOgOZie4HMQ7WtrDfIr0OBZv3HFpWSVMnrHUYtStd1YXPOMteaC5-7nxmuqpL4MaIfWF4ESjowXMkRlVCgOo11ZISepMddLEfGDJFUr91gdGMAdUS9MP3PUeVrLYwSuZ_bQUVNeelxOFRaOAw0PfQ5JjY7girBQymfj2MWaBM8UxdEGILP2g';

const DEFAULT_BUDGETS: BudgetLimits = {
  Food: 12000, Travel: 16000, Bills: 32000,
  Shopping: 20000, Entertainment: 12000, Custom: 24000,
};

// ==========================================
// 4. Provider Component
// ==========================================
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // ── Auth state ──────────────────────────────────────────────
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // true while Firebase resolves session

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : {
      name: 'Guest', email: '', photo: DEFAULT_PHOTO, membership: 'free',
      bio: 'SmartLife member.'
    };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('sm_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light', language: 'en', notificationsEnabled: true, biometricsEnabled: true,
    };
  });

  // ── Data state ──────────────────────────────────────────────
  const [reminders,     setReminders]     = useState<Reminder[]>([]);
  const [tasks,         setTasks]         = useState<Task[]>([]);
  const [expenses,      setExpenses]      = useState<Expense[]>([]);
  const [budgets,       setBudgets]       = useState<BudgetLimits>(DEFAULT_BUDGETS);
  const [habits,        setHabits]        = useState<Habit[]>([]);
  const [notes,         setNotes]         = useState<Note[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [chatHistory,   setChatHistory]   = useState<Message[]>([{
    sender: 'ai',
    text: "Hi! I'm Aura, your AI Productivity Coach powered by Google Gemini. How can I help you today? 🚀",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);

  // Keep ref to userId for use inside callbacks
  const userIdRef = useRef<string | null>(null);

  // ── Firebase Auth listener ───────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        userIdRef.current = fbUser.uid;
        setFirebaseUser(fbUser);
        setIsLoggedIn(true);

        // Sync user profile from Firebase
        const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
        const localUser = localStorage.getItem('sm_user');
        const parsedLocal = localUser ? JSON.parse(localUser) : {};
        setUser(prev => ({
          ...prev,
          name: displayName,
          email: fbUser.email || '',
          photo: parsedLocal.photo || fbUser.photoURL || DEFAULT_PHOTO,
          bio: parsedLocal.bio || 'SmartLife member.',
        }));

        // Load all data from Supabase
        try {
          const data = await loadAllUserData(fbUser.uid);

          // Prefer Supabase data; fall back to localStorage if Supabase returned empty
          setReminders(data.reminders.length > 0 ? data.reminders : JSON.parse(localStorage.getItem('sm_reminders') || '[]'));
          setTasks(data.tasks.length > 0 ? data.tasks : JSON.parse(localStorage.getItem('sm_tasks') || '[]'));
          setExpenses(data.expenses.length > 0 ? data.expenses : JSON.parse(localStorage.getItem('sm_expenses') || '[]'));
          setBudgets(Object.keys(data.budgets).length > 0 ? data.budgets : JSON.parse(localStorage.getItem('sm_budgets') || JSON.stringify(DEFAULT_BUDGETS)));
          setHabits(data.habits.length > 0 ? data.habits : JSON.parse(localStorage.getItem('sm_habits') || '[]'));
          setNotes(data.notes.length > 0 ? data.notes : JSON.parse(localStorage.getItem('sm_notes') || '[]'));
          setNotifications(data.notifications.length > 0 ? data.notifications : JSON.parse(localStorage.getItem('sm_notifications') || '[]'));
        } catch (err) {
          console.warn('[AppContext] Supabase load failed — using localStorage cache', err);
          setReminders(JSON.parse(localStorage.getItem('sm_reminders') || '[]'));
          setTasks(JSON.parse(localStorage.getItem('sm_tasks') || '[]'));
          setExpenses(JSON.parse(localStorage.getItem('sm_expenses') || '[]'));
          setBudgets(JSON.parse(localStorage.getItem('sm_budgets') || JSON.stringify(DEFAULT_BUDGETS)));
          setHabits(JSON.parse(localStorage.getItem('sm_habits') || '[]'));
          setNotes(JSON.parse(localStorage.getItem('sm_notes') || '[]'));
          setNotifications(JSON.parse(localStorage.getItem('sm_notifications') || '[]'));
        }
      } else {
        userIdRef.current = null;
        setFirebaseUser(null);
        setIsLoggedIn(false);
        // Clear data on logout
        setReminders([]); setTasks([]); setExpenses([]);
        setBudgets(DEFAULT_BUDGETS); setHabits([]); setNotes([]);
        setNotifications([]);
      }
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── localStorage sync (cache) ───────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    localStorage.setItem('sm_user',          JSON.stringify(user));
    localStorage.setItem('sm_settings',      JSON.stringify(settings));
    localStorage.setItem('sm_reminders',     JSON.stringify(reminders));
    localStorage.setItem('sm_tasks',         JSON.stringify(tasks));
    localStorage.setItem('sm_expenses',      JSON.stringify(expenses));
    localStorage.setItem('sm_budgets',       JSON.stringify(budgets));
    localStorage.setItem('sm_habits',        JSON.stringify(habits));
    localStorage.setItem('sm_notes',         JSON.stringify(notes));
    localStorage.setItem('sm_notifications', JSON.stringify(notifications));
  }, [isLoggedIn, user, settings, reminders, tasks, expenses, budgets, habits, notes, notifications]);

  // ── Theme application ───────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  // ==========================================
  // 5. Auth Operations (Firebase)
  // ==========================================
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged above will set state
      return true;
    } catch (error: any) {
      console.error('[Auth] Login failed:', error.code);
      throw error; // re-throw so Login.tsx can display Firebase error message
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // onAuthStateChanged handles the rest
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    // Clear all localStorage keys
    ['sm_user','sm_settings','sm_reminders','sm_tasks','sm_expenses',
     'sm_budgets','sm_habits','sm_notes','sm_notifications','sm_chatHistory'].forEach(k => localStorage.removeItem(k));
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUser = (updatedUser: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const updateSettings = (updatedSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updatedSettings }));
  };

  // ==========================================
  // 6. CRUD Operations (Supabase + localStorage)
  // ==========================================

  // Helper: write to Supabase in background (non-blocking)
  const syncToDb = async (fn: () => Promise<void>) => {
    if (!userIdRef.current) return;
    try { await fn(); } catch (e) { console.warn('[DB Sync]', e); }
  };

  // ── REMINDERS ──────────────────────────────────────────────
  const addNotification = (title: string, body: string, category: AppNotification['category']) => {
    const newNotif: AppNotification = {
      id: uid('notif'), title, body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false, category,
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      if (userIdRef.current) syncToDb(() => upsertNotification(userIdRef.current!, newNotif));
      return updated;
    });
  };

  const addReminder = (reminder: Omit<Reminder, 'id' | 'completed' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder, id: uid('rem'), completed: false, createdAt: new Date().toISOString(),
    };
    setReminders(prev => [newReminder, ...prev]);
    syncToDb(() => upsertReminder(userIdRef.current!, newReminder));
    if (newReminder.notification) {
      addNotification('Reminder Set', `"${newReminder.title}" scheduled for ${newReminder.dueDate}`, 'reminder');
    }
  };

  const updateReminder = (id: string, updated: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const next = { ...r, ...updated };
        syncToDb(() => upsertReminder(userIdRef.current!, next));
        return next;
      }
      return r;
    }));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    syncToDb(() => removeReminder(id));
  };

  const toggleReminderCompletion = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const next = { ...r, completed: !r.completed };
        if (next.completed) addNotification('Reminder Done ✅', `"${r.title}" marked complete.`, 'reminder');
        syncToDb(() => upsertReminder(userIdRef.current!, next));
        return next;
      }
      return r;
    }));
  };

  // ── TASKS ──────────────────────────────────────────────────
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: uid('task'), createdAt: new Date().toISOString() };
    setTasks(prev => [newTask, ...prev]);
    syncToDb(() => upsertTask(userIdRef.current!, newTask));
    addNotification('Task Created 📝', `"${newTask.title}" added to your board.`, 'task');
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const next = { ...t, ...updated };
        syncToDb(() => upsertTask(userIdRef.current!, next));
        return next;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    syncToDb(() => removeTask(id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        const next = { ...t, status: nextStatus as Task['status'] };
        syncToDb(() => upsertTask(userIdRef.current!, next));
        return next;
      }
      return t;
    }));
  };

  const toggleSubtaskCompletion = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const next = {
          ...t,
          subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s),
        };
        syncToDb(() => upsertTask(userIdRef.current!, next));
        return next;
      }
      return t;
    }));
  };

  // ── EXPENSES ────────────────────────────────────────────────
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = { ...expense, id: uid('exp'), createdAt: new Date().toISOString() };
    setExpenses(prev => [newExpense, ...prev]);
    syncToDb(() => upsertExpense(userIdRef.current!, newExpense));
    addNotification('Expense Logged 💸', `₹${newExpense.amount} at ${newExpense.merchant}`, 'expense');
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        const next = { ...e, ...updated };
        syncToDb(() => upsertExpense(userIdRef.current!, next));
        return next;
      }
      return e;
    }));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    syncToDb(() => removeExpense(id));
  };

  const updateBudgetLimit = (category: string, amount: number) => {
    setBudgets(prev => {
      const next = { ...prev, [category]: amount };
      syncToDb(() => upsertBudget(userIdRef.current!, category, amount));
      return next;
    });
  };

  // ── HABITS ─────────────────────────────────────────────────
  const addHabit = (habit: Omit<Habit, 'id' | 'history' | 'streak' | 'longestStreak' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit, id: uid('habit'), history: {}, streak: 0, longestStreak: 0, createdAt: new Date().toISOString(),
    };
    setHabits(prev => [newHabit, ...prev]);
    syncToDb(() => upsertHabit(userIdRef.current!, newHabit));
    addNotification('Habit Created 🎯', `Stay consistent with "${newHabit.name}"!`, 'habit');
  };

  const updateHabit = (id: string, updated: Partial<Habit>) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const next = { ...h, ...updated };
        syncToDb(() => upsertHabit(userIdRef.current!, next));
        return next;
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    syncToDb(() => removeHabit(id));
  };

  const toggleHabitCheck = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const alreadyChecked = !!h.history[date];
        const updatedHistory = { ...h.history, [date]: !alreadyChecked };
        let streak = 0;
        let checkDate = new Date(date);
        while (true) {
          const ds = checkDate.toISOString().split('T')[0];
          if (updatedHistory[ds]) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
          else break;
        }
        const next = { ...h, history: updatedHistory, streak, longestStreak: Math.max(h.longestStreak, streak) };
        if (!alreadyChecked) addNotification('Habit Done! 🔥', `${streak}-day streak for "${h.name}"!`, 'habit');
        syncToDb(() => upsertHabit(userIdRef.current!, next));
        return next;
      }
      return h;
    }));
  };

  // ── NOTES ──────────────────────────────────────────────────
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = { ...note, id: uid('note'), updatedAt: new Date().toISOString() };
    setNotes(prev => [newNote, ...prev]);
    syncToDb(() => upsertNote(userIdRef.current!, newNote));
  };

  const updateNote = (id: string, updated: Partial<Note>) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        const next = { ...n, ...updated, updatedAt: new Date().toISOString() };
        syncToDb(() => upsertNote(userIdRef.current!, next));
        return next;
      }
      return n;
    }));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    syncToDb(() => removeNote(id));
  };

  // ── NOTIFICATIONS ──────────────────────────────────────────
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (userIdRef.current) syncToDb(() => clearAllNotifications(userIdRef.current!));
  };

  // ── OCR Simulator (swap with ML Kit later) ─────────────────
  const simulatedOcrScan = (imageName: string): Promise<Omit<Expense, 'id' | 'createdAt'>> => {
    setOcrProcessing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setOcrProcessing(false);
        const keyword = imageName.toLowerCase();
        let merchant = 'Whole Foods Market'; let amount = 6750; let category = 'Food';
        let items: ReceiptItem[] = [
          { name: 'Organic Avocado bag', quantity: 1, price: 550 },
          { name: 'Whole Wheat Sourdough', quantity: 2, price: 720 },
          { name: 'Unsweetened Oat Milk', quantity: 3, price: 1160 },
          { name: 'Atlantic Salmon fillets', quantity: 1, price: 3600 },
        ];
        if (keyword.includes('uber') || keyword.includes('taxi')) {
          merchant = 'Uber Rides Inc.'; amount = 2600; category = 'Travel';
          items = [{ name: 'Uber Comfort Commute', quantity: 1, price: 2600 }];
        } else if (keyword.includes('utility') || keyword.includes('water') || keyword.includes('power')) {
          merchant = 'City Power & Water'; amount = 11600; category = 'Bills';
          items = [{ name: 'Utility Bill - June 2026', quantity: 1, price: 11600 }];
        } else if (keyword.includes('coffee') || keyword.includes('starbucks')) {
          merchant = 'Starbucks Coffee'; amount = 1190; category = 'Food';
          items = [{ name: 'Matcha Latte Grande', quantity: 2, price: 880 }, { name: 'Cookie', quantity: 1, price: 310 }];
        }
        const gst = parseFloat((amount * 0.05).toFixed(2));
        const tax = parseFloat((amount * 0.02).toFixed(2));
        resolve({ merchant, date: new Date().toISOString().slice(0, 10), amount: amount + gst + tax, gst, tax, paymentMethod: 'Credit Card', category, items, notes: 'Scanned via OCR', ocrProcessed: true });
      }, 2500);
    });
  };

  // ==========================================
  // 7. Aura AI Chat (Real Gemini API)
  // ==========================================
  const sendChatMessage = async (messageText: string) => {
    const userMsg: Message = {
      sender: 'user', text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      // Build context-rich system prompt from user's real data
      const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
      const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const activeHabits = habits.length;
      const maxStreak = habits.reduce((m, h) => Math.max(m, h.streak || 0), 0);

      const systemPrompt = `You are Aura, a warm, smart, and concise AI productivity coach inside the SmartLife app. 
You help users manage tasks, habits, expenses, and schedules. Be practical, encouraging, and brief (under 120 words).
User context: Name="${user.name}", Tasks="${tasks.length} total, ${completedTasks} completed", 
Habits="${activeHabits} active, best streak ${maxStreak} days", 
Expenses="₹${totalExpenses.toLocaleString('en-IN')} spent of ₹${totalBudget.toLocaleString('en-IN')} budget", 
Notes="${notes.length} notes". 
Respond in plain text (no markdown). If you suggest adding a task or habit, mention it clearly so the user can use the import button.`;

      // Build conversation history for Gemini (last 10 messages)
      const conversationMessages: ChatMessage[] = [
        { role: 'user', content: systemPrompt },
        { role: 'assistant', content: 'Understood! I am Aura, your productivity coach. I have your context loaded.' },
        ...chatHistory.slice(-8).map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        })),
        { role: 'user', content: messageText },
      ];

      const result = await queryAiAssistant(conversationMessages);
      const aiMsg: Message = {
        sender: 'ai', text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: result.actions,
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: Message = {
        sender: 'ai',
        text: "I'm having trouble connecting to Gemini right now. Please check your internet connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory(prev => [...prev, errMsg]);
    }
  };

  const clearChatHistory = () => {
    setChatHistory([{
      sender: 'ai',
      text: "Chat cleared! I'm Aura — ask me anything about your tasks, habits, budget, or schedule. 🚀",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const importAiAction = (action: ActionPayload) => {
    if (action.type === 'task') { addTask(action.payload); addNotification('AI Import 📌', `Task "${action.payload.title}" added`, 'system'); }
    else if (action.type === 'habit') { addHabit(action.payload); addNotification('AI Import 🎯', `Habit "${action.payload.name}" created`, 'system'); }
    else if (action.type === 'budget') { updateBudgetLimit(action.payload.category, action.payload.amount); addNotification('AI Import 💳', `Budget updated`, 'system'); }
  };

  const refreshApp = () => {};

  return (
    <AppContext.Provider value={{
      isLoggedIn, isAuthLoading, user, settings, login, logout, signUp, resetPassword, updateUser, updateSettings,
      reminders, addReminder, updateReminder, deleteReminder, toggleReminderCompletion,
      tasks, addTask, updateTask, deleteTask, toggleTaskCompletion, toggleSubtaskCompletion,
      expenses, addExpense, updateExpense, deleteExpense, budgets, updateBudgetLimit,
      ocrProcessing, simulatedOcrScan,
      habits, addHabit, updateHabit, deleteHabit, toggleHabitCheck,
      notes, addNote, updateNote, deleteNote,
      chatHistory, sendChatMessage, clearChatHistory, importAiAction,
      notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, addNotification,
      refreshApp,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
