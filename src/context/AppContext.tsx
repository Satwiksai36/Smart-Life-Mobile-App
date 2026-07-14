import React, { createContext, useContext, useState, useEffect } from 'react';

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
  history: { [date: string]: boolean }; // YYYY-MM-DD -> checked status
  streak: number;
  longestStreak: number;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string; // Tailwind background + border styles
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
  // Authentication & Session
  isLoggedIn: boolean;
  user: UserProfile;
  settings: AppSettings;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signUp: (name: string, email: string, password: string) => void;
  updateUser: (updatedUser: Partial<UserProfile>) => void;
  updateSettings: (updatedSettings: Partial<AppSettings>) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed' | 'createdAt'>) => void;
  updateReminder: (id: string, updated: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderCompletion: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;

  // Expenses & Budgets
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  budgets: BudgetLimits;
  updateBudgetLimit: (category: string, amount: number) => void;

  // OCR Simulator
  ocrProcessing: boolean;
  simulatedOcrScan: (imageName: string) => Promise<Omit<Expense, 'id' | 'createdAt'>>;

  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'history' | 'streak' | 'longestStreak' | 'createdAt'>) => void;
  updateHabit: (id: string, updated: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCheck: (id: string, date: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updated: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // AI Assistant Chat (Aura)
  chatHistory: Message[];
  sendChatMessage: (messageText: string) => Promise<void>;
  clearChatHistory: () => void;
  importAiAction: (action: ActionPayload) => void;

  // Notification Center
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (title: string, body: string, category: AppNotification['category']) => void;

  // Shared Helper Statuses
  refreshApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==========================================
// 3. Provider Component & Mock Seed Data
// ==========================================
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refresh, setRefresh] = useState(0);

  // --- Auth & Session State ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('sm_isLoggedIn') === 'true';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Rivera',
      email: 'alex.rivera@smartlife.ai',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4sbohlB_SOS0FjxpVFgjtIlGjAiilx6Q_WhZjy7IXpPYtMJcU0ne7kLOkwooJCkW7trcOgOZie4HMQ7WtrDfIr0OBZv3HFpWSVMnrHUYtStd1YXPOMteaC5-7nxmuqpL4MaIfWF4ESjowXMkRlVCgOo11ZISepMddLEfGDJFUr91gdGMAdUS9MP3PUeVrLYwSuZ_bQUVNeelxOFRaOAw0PfQ5JjY7girBQymfj2MWaBM8UxdEGILP2g',
      membership: 'pro',
      bio: 'Enthusiastic developer & designer building AI products.'
    };
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('sm_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'en',
      notificationsEnabled: true,
      biometricsEnabled: true
    };
  });

  // --- Reminders State ---
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('sm_reminders');
    if (saved) return JSON.parse(saved);
    
    // Seed default reminders (Today is assumed 2026-07-14)
    return [
      {
        id: 'r1',
        title: 'Take Multivitamins & Omega-3',
        category: 'Medicines',
        dueDate: '2026-07-14',
        dueTime: '09:00',
        priority: 'high',
        recurrence: 'daily',
        notification: true,
        notes: 'Take after eating breakfast.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'r2',
        title: 'Stitch Team Sync Meeting',
        category: 'Meetings',
        dueDate: '2026-07-14',
        dueTime: '14:30',
        priority: 'medium',
        recurrence: 'weekly',
        notification: true,
        notes: 'Discuss responsive layouts and design token conversion.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'r3',
        title: 'Renew Cloud Hosting Subscription',
        category: 'Subscriptions',
        dueDate: '2026-07-18',
        dueTime: '10:00',
        priority: 'high',
        recurrence: 'monthly',
        notification: true,
        notes: 'Card ending in 4242. Estimated ₹3,900.',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'r4',
        title: 'Mom\'s Birthday Gift',
        category: 'Birthdays',
        dueDate: '2026-07-25',
        dueTime: '12:00',
        priority: 'medium',
        recurrence: 'yearly',
        notification: true,
        notes: 'Send flowers and handwritten card.',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // --- Tasks State ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('sm_tasks');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 't1',
        title: 'Define Design Tokens System',
        dueDate: '2026-07-12',
        dueTime: '17:00',
        priority: 'high',
        status: 'completed',
        notes: 'Export colors, typography, margins and radius profiles from DESIGN.md',
        subtasks: [
          { id: 'ts1', title: 'Extract color hex values', completed: true },
          { id: 'ts2', title: 'Define layout rhythm spacings', completed: true },
          { id: 'ts3', title: 'Set up glassmorphism classes in Tailwind', completed: true }
        ],
        attachments: [{ name: 'BrandSpecs_v1.pdf', size: '2.4 MB' }],
        createdAt: new Date().toISOString()
      },
      {
        id: 't2',
        title: 'Initialize SmartLife Shell App',
        dueDate: '2026-07-14',
        dueTime: '13:00',
        priority: 'high',
        status: 'in_progress',
        notes: 'Setup project configurations, PostCSS, global styles and routing mechanics.',
        subtasks: [
          { id: 'ts4', title: 'Write package.json and config files', completed: true },
          { id: 'ts5', title: 'Write global index.css rules', completed: true },
          { id: 'ts6', title: 'Build persistent context database', completed: false }
        ],
        attachments: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 't3',
        title: 'Develop OCR Simulator & Screens',
        dueDate: '2026-07-15',
        dueTime: '18:00',
        priority: 'medium',
        status: 'todo',
        notes: 'Implement receipt uploader, scan animations, and manual entry forms.',
        subtasks: [
          { id: 'ts7', title: 'Design laser scan moving line effect', completed: false },
          { id: 'ts8', title: 'Create receipt pre-filler mock data database', completed: false },
          { id: 'ts9', title: 'Hook scanner up to Expenses context array', completed: false }
        ],
        attachments: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 't4',
        title: 'Refine Heatmap Calendar Visuals',
        dueDate: '2026-07-20',
        dueTime: '12:00',
        priority: 'low',
        status: 'todo',
        notes: 'Aesthetic checks to align grid squares with GitHub-like streaks.',
        subtasks: [
          { id: 'ts10', title: 'Ensure light/dark support for green shades', completed: false }
        ],
        attachments: [],
        createdAt: new Date().toISOString()
      }
    ];
  });

  // --- Expenses & Budgets State ---
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('sm_expenses');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'e1',
        merchant: 'Starbucks Coffee',
        date: '2026-07-12',
        amount: 540,
        gst: 28,
        tax: 12,
        paymentMethod: 'Credit Card',
        category: 'Food',
        items: [
          { name: 'Iced Caramel Macchiato', quantity: 1, price: 420 },
          { name: 'Butter Croissant', quantity: 1, price: 120 }
        ],
        notes: 'Morning pick-me-up during design research.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'e2',
        merchant: 'Uber Rides Inc',
        date: '2026-07-13',
        amount: 1950,
        gst: 98,
        tax: 60,
        paymentMethod: 'Google Pay',
        category: 'Travel',
        items: [
          { name: 'Comfort Ride - Home to Office', quantity: 1, price: 1950 }
        ],
        notes: 'Commute to core team meeting.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'e3',
        merchant: 'Vercel Pro hosting',
        date: '2026-07-10',
        amount: 3900,
        gst: 196,
        tax: 124,
        paymentMethod: 'Credit Card',
        category: 'Bills',
        items: [
          { name: 'Vercel Team Plan Subscription', quantity: 1, price: 3900 }
        ],
        notes: 'Monthly server renewals.',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [budgets, setBudgets] = useState<BudgetLimits>(() => {
    const saved = localStorage.getItem('sm_budgets');
    return saved ? JSON.parse(saved) : {
      Food: 12000,
      Travel: 16000,
      Bills: 32000,
      Shopping: 20000,
      Entertainment: 12000,
      Custom: 24000
    };
  });

  // --- Habits State ---
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('sm_habits');
    if (saved) return JSON.parse(saved);

    // Seeding check-ins for the last few days (Assume today is 2026-07-14)
    return [
      {
        id: 'h1',
        name: 'Hydrate 3L Water',
        icon: 'water_drop',
        frequency: 'daily',
        priority: 'high',
        targetGoal: 7,
        history: {
          '2026-07-10': true,
          '2026-07-11': true,
          '2026-07-12': true,
          '2026-07-13': true,
          '2026-07-14': true
        },
        streak: 5,
        longestStreak: 12,
        createdAt: new Date().toISOString()
      },
      {
        id: 'h2',
        name: 'Read Books 20m',
        icon: 'menu_book',
        frequency: 'daily',
        priority: 'medium',
        targetGoal: 5,
        history: {
          '2026-07-10': true,
          '2026-07-11': true,
          '2026-07-13': true,
          '2026-07-14': true
        },
        streak: 2,
        longestStreak: 8,
        createdAt: new Date().toISOString()
      },
      {
        id: 'h3',
        name: 'Gym Workout Routine',
        icon: 'fitness_center',
        frequency: 'weekly',
        priority: 'high',
        targetGoal: 3,
        history: {
          '2026-07-11': true,
          '2026-07-13': true
        },
        streak: 2,
        longestStreak: 4,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // --- Notes State ---
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('sm_notes');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'n1',
        title: 'Aura Productivity Advice 💡',
        content: `1. Time-blocking for deep work.\n2. Keep habits to under 3 major routines per day to avoid burnout.\n3. Track expenses at point of purchase to keep budget in focus.\n4. Review analytics every Sunday to map completion efficiency.`,
        color: 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300',
        pinned: true,
        voiceNotes: [],
        images: [],
        updatedAt: new Date().toISOString()
      },
      {
        id: 'n2',
        title: 'Weekly Grocery List 🛒',
        content: `- Organic avocados\n- Oat milk (unsweetened)\n- Chia seeds & Greek yogurt\n- Whole wheat sourdough bread\n- Organic dark chocolate (85% Kakao)\n- Farm fresh eggs`,
        color: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-300',
        pinned: false,
        voiceNotes: ['mock_voice_1.wav'],
        images: [],
        updatedAt: new Date().toISOString()
      },
      {
        id: 'n3',
        title: 'AI Assistant Prompts to Try 🤖',
        content: `- Aura, suggest a 5-day study plan for exams\n- Aura, analyze my budget improvements\n- Aura, recommend habits for stress reduction\n- Aura, suggest tomorrow's agenda`,
        color: 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30 text-indigo-900 dark:text-indigo-300',
        pinned: false,
        voiceNotes: [],
        images: [],
        updatedAt: new Date().toISOString()
      }
    ];
  });

  // --- AI Chat History State ---
  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    const saved = localStorage.getItem('sm_chatHistory');
    if (saved) return JSON.parse(saved);

    return [
      {
        sender: 'ai',
        text: "Hello Alex! I am Aura, your AI Productivity & Life Coach. How can I help you optimize your schedule, budget, or habits today? 🚀",
        timestamp: '10:00 AM'
      }
    ];
  });

  // --- Notifications State ---
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sm_notifications');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'nt1',
        title: 'Daily Medication Alert',
        body: 'Reminder: Take Multivitamins & Omega-3 (Scheduled for 9:00 AM)',
        timestamp: '9:00 AM',
        read: false,
        category: 'reminder'
      },
      {
        id: 'nt2',
        title: 'Task Due Soon',
        body: 'Your task "Initialize SmartLife Shell App" is due in 3 hours.',
        timestamp: '10:00 AM',
        read: false,
        category: 'task'
      },
      {
        id: 'nt3',
        title: 'Budget Alert: Travel Category',
        body: 'Warning: You have used 12.2% of your Travel budget this week.',
        timestamp: 'Yesterday',
        read: true,
        category: 'expense'
      }
    ];
  });

  // --- OCR State ---
  const [ocrProcessing, setOcrProcessing] = useState(false);

  // ==========================================
  // 4. Persistence Syncing
  // ==========================================
  useEffect(() => {
    localStorage.setItem('sm_isLoggedIn', String(isLoggedIn));
    localStorage.setItem('sm_user', JSON.stringify(user));
    localStorage.setItem('sm_settings', JSON.stringify(settings));
    localStorage.setItem('sm_reminders', JSON.stringify(reminders));
    localStorage.setItem('sm_tasks', JSON.stringify(tasks));
    localStorage.setItem('sm_expenses', JSON.stringify(expenses));
    localStorage.setItem('sm_budgets', JSON.stringify(budgets));
    localStorage.setItem('sm_habits', JSON.stringify(habits));
    localStorage.setItem('sm_notes', JSON.stringify(notes));
    localStorage.setItem('sm_chatHistory', JSON.stringify(chatHistory));
    localStorage.setItem('sm_notifications', JSON.stringify(notifications));
  }, [isLoggedIn, user, settings, reminders, tasks, expenses, budgets, habits, notes, chatHistory, notifications]);

  // ==========================================
  // 5. Context Operations & Logic
  // ==========================================
  const refreshApp = () => setRefresh(prev => prev + 1);

  // --- Authentication ---
  const login = (email: string, password: string): boolean => {
    // Basic verification - accepts any credentials containing 'password' or simple mock checking
    if (email && password.length >= 4) {
      setIsLoggedIn(true);
      setUser(prev => ({
        ...prev,
        email: email,
        name: email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
      }));
      addNotification("Welcome Back!", `Successfully logged in as ${email}`, 'system');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    addNotification("Logged Out", "You have successfully logged out.", 'system');
  };

  const signUp = (name: string, email: string, password: string) => {
    setIsLoggedIn(true);
    setUser({
      name,
      email,
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4sbohlB_SOS0FjxpVFgjtIlGjAiilx6Q_WhZjy7IXpPYtMJcU0ne7kLOkwooJCkW7trcOgOZie4HMQ7WtrDfIr0OBZv3HFpWSVMnrHUYtStd1YXPOMteaC5-7nxmuqpL4MaIfWF4ESjowXMkRlVCgOo11ZISepMddLEfGDJFUr91gdGMAdUS9MP3PUeVrLYwSuZ_bQUVNeelxOFRaOAw0PfQ5JjY7girBQymfj2MWaBM8UxdEGILP2g',
      membership: 'free',
      bio: 'New SmartLife member.'
    });
    addNotification("Account Created!", `Welcome to SmartLife, ${name}!`, 'system');
  };

  const updateUser = (updatedUser: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const updateSettings = (updatedSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updatedSettings }));
  };

  // --- Reminders CRUD ---
  const addReminder = (reminder: Omit<Reminder, 'id' | 'completed' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: 'rem_' + Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setReminders(prev => [newReminder, ...prev]);
    if (newReminder.notification) {
      addNotification("Reminder Configured", `"${newReminder.title}" is set for ${newReminder.dueDate} at ${newReminder.dueTime}`, 'reminder');
    }
  };

  const updateReminder = (id: string, updated: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleReminderCompletion = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.completed;
        if (nextState) {
          addNotification("Reminder Cleared ✅", `"${r.title}" completed.`, 'reminder');
        }
        return { ...r, completed: nextState };
      }
      return r;
    }));
  };

  // --- Tasks CRUD ---
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    addNotification("Task Created 📌", `"${newTask.title}" added to your planner.`, 'task');
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        if (nextStatus === 'completed') {
          addNotification("Task Finished 🏆", `Excellent work completing "${t.title}"!`, 'task');
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const toggleSubtaskCompletion = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  // --- Expenses CRUD ---
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: 'exp_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);

    // Check budget thresholds
    const totalCategorySpent = expenses
      .filter(e => e.category === expense.category && e.date.startsWith('2026-07'))
      .reduce((sum, e) => sum + e.amount, 0) + expense.amount;
    const limit = budgets[expense.category] || 9999;

    if (totalCategorySpent >= limit) {
      addNotification(
        "🚨 Budget Limit Exceeded!", 
        `You spent $${totalCategorySpent.toFixed(2)} of your $${limit} budget limit in "${expense.category}"`, 
        'expense'
      );
    } else if (totalCategorySpent >= limit * 0.8) {
      addNotification(
        "⚠️ High Expense Warning", 
        `You have used ${((totalCategorySpent/limit) * 100).toFixed(0)}% of your "${expense.category}" monthly budget.`, 
        'expense'
      );
    } else {
      addNotification("Expense Logged 💳", `Logged $${expense.amount.toFixed(2)} spent at ${expense.merchant}.`, 'expense');
    }
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateBudgetLimit = (category: string, amount: number) => {
    setBudgets(prev => ({ ...prev, [category]: amount }));
    addNotification("Budget Adjusted", `Monthly boundary for "${category}" set to ₹${amount}`, 'expense');
  };

  // --- OCR Simulator Engine ---
  const simulatedOcrScan = (imageName: string): Promise<Omit<Expense, 'id' | 'createdAt'>> => {
    setOcrProcessing(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setOcrProcessing(false);
        // Extract dummy info based on realistic scans
        const keyword = imageName.toLowerCase();
        
        let merchant = 'Whole Foods Market';
        let amount = 6750;
        let category = 'Food';
        let items: ReceiptItem[] = [
          { name: 'Organic Avocado bag', quantity: 1, price: 550 },
          { name: 'Whole Wheat Sourdough', quantity: 2, price: 720 },
          { name: 'Unsweetened Oat Milk', quantity: 3, price: 1160 },
          { name: 'Atlantic Salmon fillets', quantity: 1, price: 3600 }
        ];

        if (keyword.includes('uber') || keyword.includes('taxi')) {
          merchant = 'Uber Rides Inc.';
          amount = 2600;
          category = 'Travel';
          items = [{ name: 'Uber Comfort Commute', quantity: 1, price: 2600 }];
        } else if (keyword.includes('apple') || keyword.includes('best') || keyword.includes('tech')) {
          merchant = 'Apple Store Retail';
          amount = 10320;
          category = 'Shopping';
          items = [{ name: 'Apple Pencil 2nd Gen', quantity: 1, price: 10320 }];
        } else if (keyword.includes('water') || keyword.includes('power') || keyword.includes('utility')) {
          merchant = 'City Power & Water District';
          amount = 11600;
          category = 'Bills';
          items = [{ name: 'Water Usage Bill - June 2026', quantity: 1, price: 11600 }];
        } else if (keyword.includes('coffee') || keyword.includes('starbucks')) {
          merchant = 'Starbucks Coffee';
          amount = 1190;
          category = 'Food';
          items = [
            { name: 'Matcha Tea Latte Grande', quantity: 2, price: 880 },
            { name: 'Chocolate Chip Cookie', quantity: 1, price: 310 }
          ];
        }

        const gst = parseFloat((amount * 0.05).toFixed(2));
        const tax = parseFloat((amount * 0.02).toFixed(2));

        resolve({
          merchant,
          date: '2026-07-14',
          amount: parseFloat((amount + gst + tax).toFixed(2)),
          gst,
          tax,
          paymentMethod: 'Credit Card',
          category,
          items,
          notes: 'Auto-extracted via ML Kit OCR Document Scan.'
        });
      }, 3000); // 3 seconds scan animation delay
    });
  };

  // --- Habits CRUD & Checker ---
  const addHabit = (habit: Omit<Habit, 'id' | 'history' | 'streak' | 'longestStreak' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: 'habit_' + Math.random().toString(36).substr(2, 9),
      history: {},
      streak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [newHabit, ...prev]);
    addNotification("New Habit Setup 🎯", `Make sure to stay consistent with "${newHabit.name}"!`, 'habit');
  };

  const updateHabit = (id: string, updated: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updated } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitCheck = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const alreadyChecked = !!h.history[date];
        const updatedHistory = { ...h.history, [date]: !alreadyChecked };

        // Recalculate streak
        let currentStreak = 0;
        let checkDate = new Date(date);
        
        while (true) {
          const dateStr = checkDate.toISOString().split('T')[0];
          if (updatedHistory[dateStr]) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        const nextLongest = Math.max(h.longestStreak, currentStreak);

        if (!alreadyChecked) {
          addNotification("Habit Done! 🔥", `Streak is now ${currentStreak} days for "${h.name}"! Keep going!`, 'habit');
        }

        return {
          ...h,
          history: updatedHistory,
          streak: currentStreak,
          longestStreak: nextLongest
        };
      }
      return h;
    }));
  };

  // --- Notes CRUD ---
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: 'note_' + Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updated: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // --- AI Chat Conversational Engine (Aura) ---
  const sendChatMessage = async (messageText: string) => {
    const userMsg: Message = {
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, userMsg]);

    // Simulate Aura typing delay
    setTimeout(() => {
      const prompt = messageText.toLowerCase();
      let aiText = "I parsed your request, but how about we focus on optimizing your schedule? Tell me what you want to achieve today! 🧠";
      let actions: ActionPayload[] = [];

      if (prompt.includes('plan') || prompt.includes('schedule') || prompt.includes('today') || prompt.includes('tomorrow')) {
        aiText = "Based on your preferences and habits, I've generated an optimized **Daily Action Plan** for you. It groups intense deep work in the morning and sets timers for hydration and exercise.";
        actions = [
          {
            type: 'task',
            label: 'Import: deep work design session',
            payload: {
              title: 'Deep Work: Core UI Audit',
              dueDate: '2026-07-15',
              dueTime: '09:00',
              priority: 'high',
              notes: 'Suggested by Aura AI to align design constraints.',
              subtasks: [{ id: 'as1', title: 'Review layout borders', completed: false }],
              attachments: []
            }
          },
          {
            type: 'task',
            label: 'Import: study sessions',
            payload: {
              title: 'AI Product Engineering Study',
              dueDate: '2026-07-15',
              dueTime: '16:00',
              priority: 'medium',
              notes: 'Focus: ML Kit OCR pipelines and Gemini tokens.',
              subtasks: [{ id: 'as2', title: 'Read OCR documentation', completed: false }],
              attachments: []
            }
          }
        ];
      } else if (prompt.includes('budget') || prompt.includes('spend') || prompt.includes('save') || prompt.includes('expense')) {
        aiText = "I ran analytics on your monthly limits. You have consumed 12% of your Travel budget, but Food is looking a bit high ($6.80 out of $150 limit). I recommend setting a custom budget boundary for Shopping to save $120.";
        actions = [
          {
            type: 'budget',
            label: 'Set Shopping limit to $150',
            payload: { category: 'Shopping', amount: 150 }
          },
          {
            type: 'budget',
            label: 'Tighten Food budget to $120',
            payload: { category: 'Food', amount: 120 }
          }
        ];
      } else if (prompt.includes('habit') || prompt.includes('health') || prompt.includes('streaks')) {
        aiText = "Looking at your habit heatmap, you have a solid 5-day streak on water intake! To level up your productivity, I recommend forming a habit for **Evening Reflection** to review your notes.";
        actions = [
          {
            type: 'habit',
            label: 'Add Habit: Evening Reflection',
            payload: {
              name: 'Evening Reflection',
              icon: 'self_improvement',
              frequency: 'daily',
              priority: 'medium',
              targetGoal: 5
            }
          }
        ];
      } else if (prompt.includes('note') || prompt.includes('summarize')) {
        const notesSummary = notes.map(n => `• ${n.title}`).join('\n');
        aiText = `Here is a summary of your active notes:\n\n${notesSummary}\n\nI recommend grouping these under color-coded pins to easily navigate during Deep Work sessions!`;
      } else if (prompt.includes('hello') || prompt.includes('hi') || prompt.includes('hey')) {
        aiText = "Hello Alex! How is your day going? Let me know if you'd like me to: \n1. Generate tomorrow's study plan.\n2. Summarize your meeting notes.\n3. Run budget analytics suggestions.";
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: actions.length > 0 ? actions : undefined
      };

      setChatHistory(prev => [...prev, aiMsg]);
    }, 1200);
  };

  const clearChatHistory = () => {
    setChatHistory([
      {
        sender: 'ai',
        text: "Hello Alex! Chat history cleared. Ask me anything to jumpstart your productivity! 🚀",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const importAiAction = (action: ActionPayload) => {
    if (action.type === 'task') {
      addTask(action.payload);
      addNotification("AI Action Imported 📌", `Added task "${action.payload.title}"`, 'system');
    } else if (action.type === 'habit') {
      addHabit(action.payload);
      addNotification("AI Action Imported 🎯", `Created habit "${action.payload.name}"`, 'system');
    } else if (action.type === 'budget') {
      updateBudgetLimit(action.payload.category, action.payload.amount);
      addNotification("AI Action Imported 💳", `Adjusted budget boundary`, 'system');
    }
  };

  // --- Notification Center ---
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (title: string, body: string, category: AppNotification['category']) => {
    const newNotif: AppNotification = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      title,
      body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      category
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, user, settings, login, logout, signUp, updateUser, updateSettings,
      reminders, addReminder, updateReminder, deleteReminder, toggleReminderCompletion,
      tasks, addTask, updateTask, deleteTask, toggleTaskCompletion, toggleSubtaskCompletion,
      expenses, addExpense, updateExpense, deleteExpense, budgets, updateBudgetLimit,
      ocrProcessing, simulatedOcrScan,
      habits, addHabit, updateHabit, deleteHabit, toggleHabitCheck,
      notes, addNote, updateNote, deleteNote,
      chatHistory, sendChatMessage, clearChatHistory, importAiAction,
      notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, addNotification,
      refreshApp
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
