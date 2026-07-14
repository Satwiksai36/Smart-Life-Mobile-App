import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const HomeDashboard: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { 
    user, 
    reminders, 
    toggleReminderCompletion, 
    tasks, 
    toggleTaskCompletion, 
    habits, 
    expenses, 
    budgets,
    notifications 
  } = useApp();

  // Get current date string (e.g. "Tuesday, Jul 14")
  const todayDateStr = new Date('2026-07-14').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const todayISOStr = '2026-07-14';

  // Stats calculation
  const totalRemindersToday = reminders.filter(r => r.dueDate === todayISOStr).length;
  const completedRemindersToday = reminders.filter(r => r.dueDate === todayISOStr && r.completed).length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Habit metrics
  const activeHabits = habits.length;
  const completedHabitsToday = habits.filter(h => h.history[todayISOStr]).length;
  const habitCompletionRate = activeHabits > 0 ? Math.round((completedHabitsToday / activeHabits) * 100) : 0;

  // Financial calculations
  const currentMonth = '2026-07';
  const totalSpentThisMonth = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);
  const totalBudgetLimit = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const budgetUtilization = totalBudgetLimit > 0 ? Math.round((totalSpentThisMonth / totalBudgetLimit) * 100) : 0;

  // Unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-grow flex flex-col relative select-none">
      
      {/* 1. UNIFIED APP BAR */}
      <header className="flex justify-between items-center w-full px-6 py-4 bg-white/30 dark:bg-slate-900/20 backdrop-blur-xl border-b border-white/10 dark:border-white/5 sticky top-0 z-35">
        <div className="flex items-center gap-3">
          <img 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white/50 dark:border-slate-800 shadow-md cursor-pointer hover:scale-105 transition-all" 
            src={user.photo}
            onClick={() => navigate('profile')}
          />
          <div>
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{todayDateStr}</span>
            <h2 className="text-sm font-black text-primary dark:text-[#c3c0ff] tracking-tight">Hi, {user.name.split(' ')[0]} 👋</h2>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('notifications')}
          className="relative p-2.5 bg-white/40 dark:bg-slate-850/40 text-[#3525cd] dark:text-[#c3c0ff] rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-lg">notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
          )}
        </button>
      </header>

      {/* 2. DASHBOARD BODY */}
      <div className="flex-1 px-5 py-4 space-y-4">
        
        {/* Pulsing AI Coach Advice Banner */}
        <div className="aura-glow-border rounded-[20px] p-3.5 bg-white/40 dark:bg-slate-900/30 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#06b6d4] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-base font-bold animate-pulse">psychology</span>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[8px] font-black uppercase tracking-wider text-cyan-500 dark:text-cyan-400">Aura AI Recommendations</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
              "Your task velocity is high today! Establish a 'study plan' to cement habit streaks."
            </p>
          </div>
        </div>

        {/* Unified Focus & SVG Gauge Card */}
        <div className="glass-card rounded-[24px] p-4.5 grid grid-cols-12 gap-3 items-center">
          {/* SVG Gauge */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="relative w-18 h-18 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="36" cy="36" r="28" stroke="rgba(0,0,0,0.04)" strokeWidth="5.5" fill="transparent" />
                <circle 
                  cx="36" cy="36" r="28" 
                  stroke="url(#dashboardGrad)" 
                  strokeWidth="5.5" 
                  fill="transparent" 
                  strokeDasharray="175.84"
                  strokeDashoffset={175.84 - (175.84 * Math.max(10, (taskCompletionRate + habitCompletionRate)/2)) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="dashboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-sm font-black text-primary dark:text-[#c3c0ff]">{Math.round((taskCompletionRate + habitCompletionRate)/2)}%</span>
                <span className="text-[7px] text-gray-400 font-bold uppercase tracking-wider">Score</span>
              </div>
            </div>
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase mt-1">Velocity</span>
          </div>

          {/* Stats Indicators */}
          <div className="col-span-7 space-y-1.5 text-[9px] font-bold text-gray-500">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/10">
              <span className="material-symbols-outlined text-sm text-indigo-600 font-bold">alarm</span>
              <div className="flex-grow flex justify-between items-center ml-1">
                <span>Alarms Completed</span>
                <span className="text-primary dark:text-[#c3c0ff]">{completedRemindersToday}/{totalRemindersToday}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-100/10">
              <span className="material-symbols-outlined text-sm text-teal-600 font-bold">task_alt</span>
              <div className="flex-grow flex justify-between items-center ml-1">
                <span>Tasks Solved</span>
                <span className="text-teal-600 dark:text-teal-400">{completedTasks}/{totalTasks}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100/10">
              <span className="material-symbols-outlined text-sm text-emerald-600 font-bold">bolt</span>
              <div className="flex-grow flex justify-between items-center ml-1">
                <span>Habit Checks</span>
                <span className="text-emerald-600 dark:text-emerald-400">{completedHabitsToday}/{activeHabits}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. QUICK ACTION BUTTONS */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { route: 'create_reminder', icon: 'alarm_add', label: 'Reminder', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40' },
            { route: 'create_task', icon: 'playlist_add', label: 'New Task', color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40' },
            { route: 'receipt_scanner', icon: 'qr_code_scanner', label: 'Scan Cost', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
            { route: 'create_habit', icon: 'autorenew', label: 'Habit', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
            { route: 'ai_assistant', icon: 'psychology', label: 'Ask Aura', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40' }
          ].map(act => (
            <button 
              key={act.route}
              onClick={() => navigate(act.route as any)}
              className="flex flex-col items-center p-2 bg-white/40 dark:bg-slate-800/40 border border-white/20 rounded-[20px] hover:-translate-y-1 hover:scale-102 hover:shadow-sm active:scale-95 transition-all select-none"
            >
              <div className={`p-2 rounded-xl flex items-center justify-center ${act.color}`}>
                <span className="material-symbols-outlined text-lg font-bold">{act.icon}</span>
              </div>
              <span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 mt-2 truncate w-full">{act.label}</span>
            </button>
          ))}
        </div>

        {/* 4. ACTIVE REMINDERS WIDGET */}
        <div className="glass-card rounded-[24px] p-4.5 space-y-3.5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Active Reminders</h3>
            <button 
              onClick={() => navigate('reminders')}
              className="text-[10px] text-primary dark:text-[#c3c0ff] font-bold hover:underline flex items-center gap-0.5"
            >
              View All <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
            {reminders.filter(r => !r.completed).length === 0 ? (
              <p className="text-[10px] text-gray-400 text-center py-4">No pending reminders configuration.</p>
            ) : (
              reminders.filter(r => !r.completed).slice(0, 2).map(r => (
                <div 
                  key={r.id}
                  className="flex justify-between items-center p-2.5 bg-white/30 dark:bg-slate-800/10 border border-white/10 rounded-xl hover:bg-white/50"
                >
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleReminderCompletion(r.id)}
                      className="w-5 h-5 rounded-full flex items-center justify-center border border-gray-300 hover:border-indigo-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[10px] text-transparent hover:text-gray-400">check</span>
                    </button>
                    <div onClick={() => navigate('reminder_details', { id: r.id })} className="cursor-pointer">
                      <h4 className="font-bold text-xs text-gray-700 dark:text-gray-200">{r.title}</h4>
                      <div className="flex gap-2 items-center text-[8px] text-gray-400 mt-0.5 font-bold uppercase">
                        <span className="px-1.5 py-0.5 bg-gray-150 dark:bg-slate-800 rounded">{r.category}</span>
                        <span>⏰ {r.dueTime}</span>
                      </div>
                    </div>
                  </div>
                  {r.priority === 'high' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 5. CURRENT TASKS WIDGET */}
        <div className="glass-card rounded-[24px] p-4.5 space-y-3.5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Task Manager</h3>
            <button 
              onClick={() => navigate('tasks')}
              className="text-[10px] text-primary dark:text-[#c3c0ff] font-bold hover:underline flex items-center gap-0.5"
            >
              Task Board <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
            {tasks.filter(t => t.status !== 'completed').length === 0 ? (
              <p className="text-[10px] text-gray-400 text-center py-4">No active tasks planned.</p>
            ) : (
              tasks.filter(t => t.status !== 'completed').slice(0, 2).map(t => (
                <div 
                  key={t.id}
                  className="p-2.5 bg-white/30 dark:bg-slate-800/10 border border-white/10 rounded-xl hover:bg-white/50 cursor-pointer"
                  onClick={() => navigate('task_details', { id: t.id })}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-gray-700 dark:text-gray-200">{t.title}</h4>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      t.status === 'in_progress' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  {t.subtasks.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700/50 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-teal-500 h-full"
                          style={{ 
                            width: `${(t.subtasks.filter(s => s.completed).length / t.subtasks.length) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 flex-shrink-0">
                        {t.subtasks.filter(s => s.completed).length}/{t.subtasks.length}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. MONTHLY BUDGET WIDGET */}
        <div className="glass-card rounded-[24px] p-4.5 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Expenses & Budget</h3>
            </div>
            <button 
              onClick={() => navigate('expenses')}
              className="text-[10px] text-primary dark:text-[#c3c0ff] font-bold hover:underline flex items-center gap-0.5"
            >
              Analytics <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-400">Spent: <span className="text-gray-700 dark:text-gray-200">₹{totalSpentThisMonth.toFixed(0)}</span></span>
              <span className="text-gray-400">Limit: <span className="text-gray-700 dark:text-gray-200">₹{totalBudgetLimit.toFixed(0)}</span></span>
            </div>
            
            <div className="w-full bg-gray-250 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  budgetUtilization > 90 ? 'bg-red-500' :
                  budgetUtilization > 75 ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7. JOURNAL PREVIEW WIDGET */}
        <div className="glass-card rounded-[24px] p-4.5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">Journal & Notes</h3>
            <button 
              onClick={() => navigate('notes')}
              className="text-[10px] text-primary dark:text-[#c3c0ff] font-bold hover:underline flex items-center gap-0.5"
            >
              Notes Grid <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div 
              onClick={() => navigate('note_editor')}
              className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/10 rounded-xl cursor-pointer hover:bg-emerald-50/70 transition-colors"
            >
              <h4 className="font-bold text-[10px] text-emerald-900 dark:text-emerald-300">Productivity Hacks 💡</h4>
              <p className="text-[8px] text-emerald-700/80 dark:text-emerald-400/80 mt-1 line-clamp-2 leading-relaxed">
                1. Time-blocking for deep work. 2. Keep habits to under 3 major routines per day...
              </p>
            </div>

            <div 
              onClick={() => navigate('note_editor')}
              className="p-3 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/10 rounded-xl cursor-pointer hover:bg-amber-50/70 transition-colors"
            >
              <h4 className="font-bold text-[10px] text-amber-900 dark:text-amber-300">Grocery List 🛒</h4>
              <p className="text-[8px] text-amber-700/80 dark:text-amber-400/80 mt-1 line-clamp-2 leading-relaxed">
                - Organic avocados - Oat milk (unsweetened) - Chia seeds & Greek yogurt...
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
