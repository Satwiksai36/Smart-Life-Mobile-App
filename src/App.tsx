import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import { useNavigateApp, NavigationProvider } from './context/NavigationContext';

// Import Screens
import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Auth/Login';
import { SignUp } from './screens/Auth/SignUp';
import { ForgotPassword } from './screens/Auth/ForgotPassword';
import { HomeDashboard } from './screens/Dashboard/HomeDashboard';
import { ReminderDashboard } from './screens/Reminders/ReminderDashboard';
import { CreateReminder } from './screens/Reminders/CreateReminder';
import { ReminderDetails } from './screens/Reminders/ReminderDetails';
import { ReminderCategories } from './screens/Reminders/ReminderCategories';
import { TaskManager } from './screens/Tasks/TaskManager';
import { CreateTask } from './screens/Tasks/CreateTask';
import { TaskDetails } from './screens/Tasks/TaskDetails';
import { ExpenseDashboard } from './screens/Expenses/ExpenseDashboard';
import { ReceiptScanner } from './screens/Expenses/ReceiptScanner';
import { OCRProcessing } from './screens/Expenses/OCRProcessing';
import { ExtractedReceiptDetails } from './screens/Expenses/ExtractedReceiptDetails';
import { ExpenseDetails } from './screens/Expenses/ExpenseDetails';
import { ManualExpenseEntry } from './screens/Expenses/ManualExpenseEntry';
import { BudgetDashboard } from './screens/Expenses/BudgetDashboard';
import { ExpenseAnalytics } from './screens/Expenses/ExpenseAnalytics';
import { HabitDashboard } from './screens/Habits/HabitDashboard';
import { CreateHabit } from './screens/Habits/CreateHabit';
import { HabitDetails } from './screens/Habits/HabitDetails';
import { HabitAnalytics } from './screens/Habits/HabitAnalytics';
import { NotesDashboard } from './screens/Notes/NotesDashboard';
import { NoteEditor } from './screens/Notes/NoteEditor';
import { CalendarView } from './screens/Calendar/CalendarView';
import { AIAssistantChat } from './screens/AI/AIAssistantChat';
import { DocumentScanner } from './screens/OCR/DocumentScanner';
import { AnalyticsDashboard } from './screens/Analytics/AnalyticsDashboard';
import { NotificationCenter } from './screens/NotificationCenter';
import { UserProfile } from './screens/Profile/UserProfile';
import { Settings } from './screens/Profile/Settings';

const AppContent: React.FC = () => {
  const { isLoggedIn, isAuthLoading, settings, logout } = useApp();
  const { currentRoute, navigate, resetTo } = useNavigateApp();
  const [showMobileMoreSheet, setShowMobileMoreSheet] = useState(false);

  // Sync theme with document element for Tailwind dark: classes
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0b1220';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8f9ff';
    }
  }, [settings.theme]);

  // Auth Guard: redirect to login if not logged in and on authenticated screens
  const authRequiredScreens = [
    'home', 'reminders', 'create_reminder', 'reminder_details', 'reminder_categories',
    'tasks', 'create_task', 'task_details',
    'expenses', 'receipt_scanner', 'ocr_processing', 'extracted_receipt', 'expense_details', 'manual_expense', 'budget', 'expense_analytics',
    'habits', 'create_habit', 'habit_details', 'habit_analytics',
    'notes', 'note_editor',
    'calendar',
    'ai_assistant',
    'document_scanner',
    'analytics',
    'notifications',
    'profile',
    'settings'
  ];

  // While Firebase checks session, show Splash to avoid login flash
  useEffect(() => {
    if (isAuthLoading) return;
    if (!isLoggedIn && authRequiredScreens.includes(currentRoute.name)) {
      resetTo('login');
    }
  }, [isLoggedIn, isAuthLoading, currentRoute.name, resetTo]);

  // Show Splash while Firebase resolves auth state
  if (isAuthLoading) return <Splash />;

  // Render Screen Helper
  const renderScreen = () => {
    switch (currentRoute.name) {
      case 'splash':
        return <Splash />;
      case 'onboarding':
        return <Onboarding />;
      case 'login':
        return <Login />;
      case 'signup':
        return <SignUp />;
      case 'forgot_password':
        return <ForgotPassword />;
      case 'home':
        return <HomeDashboard />;
      case 'reminders':
        return <ReminderDashboard />;
      case 'create_reminder':
        return <CreateReminder />;
      case 'reminder_details':
        return <ReminderDetails />;
      case 'reminder_categories':
        return <ReminderCategories />;
      case 'tasks':
        return <TaskManager />;
      case 'create_task':
        return <CreateTask />;
      case 'task_details':
        return <TaskDetails />;
      case 'expenses':
        return <ExpenseDashboard />;
      case 'receipt_scanner':
        return <ReceiptScanner />;
      case 'ocr_processing':
        return <OCRProcessing />;
      case 'extracted_receipt':
        return <ExtractedReceiptDetails />;
      case 'expense_details':
        return <ExpenseDetails />;
      case 'manual_expense':
        return <ManualExpenseEntry />;
      case 'budget':
        return <BudgetDashboard />;
      case 'expense_analytics':
        return <ExpenseAnalytics />;
      case 'habits':
        return <HabitDashboard />;
      case 'create_habit':
        return <CreateHabit />;
      case 'habit_details':
        return <HabitDetails />;
      case 'habit_analytics':
        return <HabitAnalytics />;
      case 'notes':
        return <NotesDashboard />;
      case 'note_editor':
        return <NoteEditor />;
      case 'calendar':
        return <CalendarView />;
      case 'ai_assistant':
        return <AIAssistantChat />;
      case 'document_scanner':
        return <DocumentScanner />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'notifications':
        return <NotificationCenter />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <Settings />;
      default:
        return <HomeDashboard />;
    }
  };

  const isAuthShell = authRequiredScreens.includes(currentRoute.name);

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-0 md:p-6 text-[#0b1c30] dark:text-[#f8f9ff] selection:bg-indigo-500/30">

      {/* Smartphone Frame Simulator Container */}
      <div className="w-full max-w-[420px] h-screen md:h-[92vh] md:max-h-[840px] md:min-h-[660px] md:rounded-[52px] md:border-[14px] md:border-slate-950 bg-gradient-soft flex flex-col relative overflow-hidden md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]">

        {/* Dynamic Island Notch on Desktop */}
        <div className="hidden md:flex w-28 h-6 bg-slate-950 rounded-full absolute top-2.5 left-1/2 -translate-x-1/2 z-55 items-center justify-between px-3.5 shadow-inner">
          <span className="material-symbols-outlined text-[10px] text-cyan-400 font-bold animate-pulse">psychology</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Mock Status Bar */}
        <div className="w-full bg-white/20 dark:bg-slate-900/10 px-6 pt-3 md:pt-4 pb-1.5 flex justify-between items-center text-[10px] font-bold text-gray-500 dark:text-gray-400 z-50 flex-shrink-0 tracking-wide select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs font-semibold">signal_cellular_3_bar</span>
            <span className="material-symbols-outlined text-xs font-semibold">wifi</span>
            {/* Battery Mock */}
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-[3px] border border-gray-400 dark:border-gray-500 p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-500 rounded-[1px]" />
              </div>
              <div className="w-0.5 h-1 bg-gray-400 dark:border-gray-500 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Scrollable Content Pane */}
        <div className="flex-grow overflow-y-auto scrollbar-hide flex flex-col relative bg-transparent pb-16">
          {renderScreen()}
        </div>

        {/* 3. MOBILE BOTTOM NAVIGATION TAB BAR */}
        {isAuthShell && (
          <nav className="absolute bottom-0 left-0 right-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-white/20 dark:border-slate-800/20 py-2 flex justify-around items-center z-45 pb-safe select-none shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => { navigate('home'); setShowMobileMoreSheet(false); }}
              className={`flex flex-col items-center py-1 px-3 rounded-xl ${currentRoute.name === 'home' ? 'text-[#3525cd] dark:text-[#c3c0ff]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentRoute.name === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
              <span className="text-[9px] font-bold mt-0.5">Home</span>
            </button>

            <button
              onClick={() => { navigate('tasks'); setShowMobileMoreSheet(false); }}
              className={`flex flex-col items-center py-1 px-3 rounded-xl ${currentRoute.name.startsWith('task') ? 'text-[#3525cd] dark:text-[#c3c0ff]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentRoute.name.startsWith('task') ? "'FILL' 1" : "'FILL' 0" }}>task_alt</span>
              <span className="text-[9px] font-bold mt-0.5">Tasks</span>
            </button>

            {/* AI Aura Center FAB */}
            <button
              onClick={() => { navigate('ai_assistant'); setShowMobileMoreSheet(false); }}
              className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#06b6d4] text-white flex items-center justify-center shadow-lg border-4 border-[#f8f9ff] dark:border-[#0b1220] focus:outline-none select-none active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-2xl font-bold">psychology</span>
            </button>

            <button
              onClick={() => { navigate('expenses'); setShowMobileMoreSheet(false); }}
              className={`flex flex-col items-center py-1 px-3 rounded-xl ${currentRoute.name.startsWith('expens') || currentRoute.name === 'budget' || currentRoute.name === 'extracted_receipt' || currentRoute.name === 'receipt_scanner' ? 'text-[#3525cd] dark:text-[#c3c0ff]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: currentRoute.name.startsWith('expens') ? "'FILL' 1" : "'FILL' 0" }}>payments</span>
              <span className="text-[9px] font-bold mt-0.5">Expenses</span>
            </button>

            <button
              onClick={() => setShowMobileMoreSheet(!showMobileMoreSheet)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl ${showMobileMoreSheet ? 'text-[#3525cd] dark:text-[#c3c0ff]' : 'text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
              <span className="text-[9px] font-bold mt-0.5">More</span>
            </button>
          </nav>
        )}

        {/* 4. BOTTOM SHEET DRAWER (ABSOLUTE POSITIONED TO DEVICE FRAME) */}
        {isAuthShell && showMobileMoreSheet && (
          <>
            <div
              onClick={() => setShowMobileMoreSheet(false)}
              className="absolute inset-0 bg-black/40 z-48 backdrop-blur-sm"
            />
            <div className="absolute bottom-[56px] pb-safe left-0 right-0 max-h-[70vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-t-[28px] border-t border-white/20 dark:border-slate-800/30 p-6 z-49 space-y-6 overflow-y-auto scrollbar-hide shadow-2xl animate-fade-in select-none">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto" />

              <h3 className="text-sm font-black text-center text-[#3525cd] dark:text-[#c3c0ff]">Explore SmartLife Modules</h3>

              <div className="grid grid-cols-3 gap-y-6 gap-x-4 text-center">
                <button
                  onClick={() => { navigate('reminders'); setShowMobileMoreSheet(false); }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="material-symbols-outlined text-2xl text-indigo-600 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl font-bold">alarm</span>
                  <span className="text-xs font-bold mt-2">Reminders</span>
                </button>

                <button
                  onClick={() => { navigate('habits'); setShowMobileMoreSheet(false); }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="material-symbols-outlined text-2xl text-purple-600 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl font-bold">autorenew</span>
                  <span className="text-xs font-bold mt-2">Habits</span>
                </button>

                <button
                  onClick={() => { navigate('notes'); setShowMobileMoreSheet(false); }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="material-symbols-outlined text-2xl text-amber-600 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl font-bold">sticky_note_2</span>
                  <span className="text-xs font-bold mt-2">Notes</span>
                </button>

                <button
                  onClick={() => { navigate('calendar'); setShowMobileMoreSheet(false); }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="material-symbols-outlined text-2xl text-teal-600 p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl font-bold">calendar_month</span>
                  <span className="text-xs font-bold mt-2">Calendar</span>
                </button>

                <button
                  onClick={() => { navigate('analytics'); setShowMobileMoreSheet(false); }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="material-symbols-outlined text-2xl text-pink-600 p-3 bg-pink-50 dark:bg-pink-950/40 rounded-2xl font-bold">query_stats</span>
                  <span className="text-xs font-bold mt-2">Analytics</span>
                </button>

                <button
                  onClick={() => { navigate('profile'); setShowMobileMoreSheet(false); }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="material-symbols-outlined text-2xl text-blue-600 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl font-bold">person</span>
                  <span className="text-xs font-bold mt-2">Profile</span>
                </button>

                <button
                  onClick={() => { navigate('settings'); setShowMobileMoreSheet(false); }}
                  className="flex flex-row items-center justify-center col-span-3 border-t border-gray-200/40 dark:border-slate-800/30 pt-4 gap-2"
                >
                  <span className="material-symbols-outlined text-lg text-gray-500">settings</span>
                  <span className="text-xs font-bold text-gray-500">General Settings</span>
                </button>

                <button
                  onClick={() => {
                    logout().catch(console.error);
                    setShowMobileMoreSheet(false);
                    resetTo('login');
                  }}
                  className="flex items-center justify-center col-span-3 text-red-500 font-bold text-xs gap-1 pt-2"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout from Device
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
};

export default App;
