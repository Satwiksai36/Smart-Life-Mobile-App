import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const HomeDashboard: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { 
    user, 
    reminders, 
    tasks, 
    habits, 
    expenses, 
    budgets,
    notifications,
    toggleReminderCompletion
  } = useApp();

  const todayDateStr = new Date('2026-07-14').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
  const todayISOStr = '2026-07-14';
  const currentMonth = '2026-07';

  // Stats
  const totalRemindersToday = reminders.filter(r => r.dueDate === todayISOStr).length;
  const completedRemindersToday = reminders.filter(r => r.dueDate === todayISOStr && r.completed).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeHabits = habits.length;
  const completedHabitsToday = habits.filter(h => h.history[todayISOStr]).length;
  const habitRate = activeHabits > 0 ? Math.round((completedHabitsToday / activeHabits) * 100) : 0;
  const overallScore = Math.max(10, Math.round((taskRate + habitRate) / 2));
  const totalSpent = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((s, e) => s + e.amount, 0);
  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const unreadCount = notifications.filter(n => !n.read).length;

  const gaugeOffset = 175.84 - (175.84 * overallScore) / 100;

  return (
    <div className="flex-grow flex flex-col relative select-none">
      
      {/* APP BAR */}
      <header className="flex justify-between items-center px-4 py-3 bg-white/30 dark:bg-slate-900/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img 
            alt="User" 
            className="w-9 h-9 rounded-full object-cover border-2 border-white/50 shadow-sm cursor-pointer hover:scale-105 transition-all"
            src={user.photo}
            onClick={() => navigate('profile')}
          />
          <div>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{todayDateStr}</p>
            <h2 className="text-sm font-black text-indigo-700 dark:text-indigo-300 leading-tight">Hi, {user.name.split(' ')[0]} 👋</h2>
          </div>
        </div>
        <button 
          onClick={() => navigate('notifications')}
          className="relative p-2 bg-white/40 dark:bg-slate-800/40 text-indigo-700 dark:text-indigo-300 rounded-xl border border-white/20 transition-all hover:bg-white/60"
        >
          <span className="material-symbols-outlined text-lg">notifications</span>
          {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />}
        </button>
      </header>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-3 pb-20">

        {/* AI COACH BANNER */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-cyan-50/80 dark:from-indigo-950/40 dark:to-cyan-950/30 border border-indigo-100/50 dark:border-indigo-800/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow">
            <span className="material-symbols-outlined text-white text-base animate-pulse">psychology</span>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Aura AI Coach</p>
            <p className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold leading-snug">
              High task velocity today! Build a study plan to cement habit streaks. 🚀
            </p>
          </div>
          <button 
            onClick={() => navigate('ai_assistant')}
            className="flex-shrink-0 text-[9px] font-bold px-2 py-1 bg-indigo-600 text-white rounded-lg"
          >
            Ask
          </button>
        </div>

        {/* STATS GAUGE ROW */}
        <div className="grid grid-cols-12 gap-2 p-3 rounded-2xl bg-white/50 dark:bg-slate-900/30 border border-white/30 dark:border-white/10">
          {/* Circular Gauge */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" stroke="rgba(0,0,0,0.06)" strokeWidth="6" fill="none" />
                <circle 
                  cx="36" cy="36" r="28"
                  stroke="url(#grad1)"
                  strokeWidth="6" fill="none"
                  strokeDasharray="175.84"
                  strokeDashoffset={gaugeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5"/>
                    <stop offset="100%" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-indigo-700 dark:text-indigo-300">{overallScore}%</span>
                <span className="text-[7px] text-gray-400 font-bold">Score</span>
              </div>
            </div>
            <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Velocity</span>
          </div>

          {/* Mini Stats */}
          <div className="col-span-8 space-y-1.5">
            {[
              { icon: 'alarm', label: 'Alarms', val: `${completedRemindersToday}/${totalRemindersToday}`, color: 'text-indigo-500', bg: 'bg-indigo-50/60 dark:bg-indigo-950/30' },
              { icon: 'task_alt', label: 'Tasks', val: `${completedTasks}/${totalTasks}`, color: 'text-teal-500', bg: 'bg-teal-50/60 dark:bg-teal-950/30' },
              { icon: 'bolt', label: 'Habits', val: `${completedHabitsToday}/${activeHabits}`, color: 'text-emerald-500', bg: 'bg-emerald-50/60 dark:bg-emerald-950/30' },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-1.5 px-2 py-1 ${s.bg} rounded-xl`}>
                <span className={`material-symbols-outlined text-sm ${s.color}`}>{s.icon}</span>
                <span className="text-[9px] font-bold text-gray-500 flex-grow">{s.label}</span>
                <span className={`text-[9px] font-black ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { route: 'create_reminder', icon: 'alarm_add', label: 'Reminder', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
            { route: 'create_task', icon: 'playlist_add', label: 'Task', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/40' },
            { route: 'receipt_scanner', icon: 'qr_code_scanner', label: 'Scan', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
            { route: 'create_habit', icon: 'autorenew', label: 'Habit', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40' },
            { route: 'ai_assistant', icon: 'psychology', label: 'Aura', color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
          ].map(a => (
            <button
              key={a.route}
              onClick={() => navigate(a.route as any)}
              className="flex flex-col items-center gap-1 py-2 px-1 bg-white/40 dark:bg-slate-800/40 border border-white/20 rounded-2xl hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <div className={`p-1.5 rounded-xl ${a.bg}`}>
                <span className={`material-symbols-outlined text-base ${a.color}`}>{a.icon}</span>
              </div>
              <span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 truncate w-full text-center">{a.label}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE REMINDERS */}
        <div className="bg-white/50 dark:bg-slate-900/30 border border-white/30 dark:border-white/10 rounded-2xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-500">Active Reminders</h3>
            <button onClick={() => navigate('reminders')} className="text-[9px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center">
              View All <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>
          {reminders.filter(r => !r.completed).length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center py-3">No pending reminders</p>
          ) : (
            reminders.filter(r => !r.completed).slice(0, 2).map(r => (
              <div key={r.id} className="flex items-center gap-2 p-2 bg-white/40 dark:bg-slate-800/20 rounded-xl border border-white/20">
                <button 
                  onClick={() => toggleReminderCompletion(r.id)}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-indigo-500 flex-shrink-0 transition-colors"
                />
                <div className="flex-grow min-w-0 cursor-pointer" onClick={() => navigate('reminder_details', { id: r.id })}>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{r.title}</p>
                  <p className="text-[8px] text-gray-400 font-semibold uppercase">{r.category} · ⏰ {r.dueTime}</p>
                </div>
                {r.priority === 'high' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
              </div>
            ))
          )}
        </div>

        {/* CURRENT TASKS */}
        <div className="bg-white/50 dark:bg-slate-900/30 border border-white/30 dark:border-white/10 rounded-2xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-500">Task Manager</h3>
            <button onClick={() => navigate('tasks')} className="text-[9px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center">
              Board <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>
          {tasks.filter(t => t.status !== 'completed').length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center py-3">No active tasks planned</p>
          ) : (
            tasks.filter(t => t.status !== 'completed').slice(0, 2).map(t => (
              <div 
                key={t.id} 
                className="p-2 bg-white/40 dark:bg-slate-800/20 rounded-xl border border-white/20 cursor-pointer hover:bg-white/60"
                onClick={() => navigate('task_details', { id: t.id })}
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[60%]">{t.title}</p>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    t.status === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                  }`}>{t.status.replace('_', ' ')}</span>
                </div>
                {t.subtasks.length > 0 && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-grow h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full transition-all"
                        style={{ width: `${(t.subtasks.filter(s => s.completed).length / t.subtasks.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-gray-400 font-bold flex-shrink-0">
                      {t.subtasks.filter(s => s.completed).length}/{t.subtasks.length}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* BUDGET OVERVIEW */}
        <div className="bg-white/50 dark:bg-slate-900/30 border border-white/30 dark:border-white/10 rounded-2xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-500">Expenses & Budget</h3>
            <button onClick={() => navigate('expenses')} className="text-[9px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center">
              Analytics <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-500">
            <span>Spent: <span className="text-gray-800 dark:text-gray-100">₹{totalSpent.toLocaleString('en-IN', {maximumFractionDigits:0})}</span></span>
            <span>Limit: <span className="text-gray-800 dark:text-gray-100">₹{totalBudget.toLocaleString('en-IN', {maximumFractionDigits:0})}</span></span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                budgetPct > 90 ? 'bg-red-500' : budgetPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="text-[9px] text-gray-400 font-semibold">{budgetPct}% utilized · ₹{(totalBudget - totalSpent).toLocaleString('en-IN', {maximumFractionDigits:0})} remaining</p>
        </div>

        {/* JOURNAL PREVIEW */}
        <div className="bg-white/50 dark:bg-slate-900/30 border border-white/30 dark:border-white/10 rounded-2xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-500">Journal & Notes</h3>
            <button onClick={() => navigate('notes')} className="text-[9px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center">
              All Notes <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div 
              onClick={() => navigate('note_editor')}
              className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/30 rounded-xl cursor-pointer hover:bg-emerald-50"
            >
              <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">Productivity Hacks 💡</p>
              <p className="text-[8px] text-emerald-700/70 mt-0.5 line-clamp-2 leading-relaxed">Time-blocking for deep work. Keep habits to under 3 daily routines...</p>
            </div>
            <div 
              onClick={() => navigate('note_editor')}
              className="p-2.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/30 rounded-xl cursor-pointer hover:bg-amber-50"
            >
              <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300">Grocery List 🛒</p>
              <p className="text-[8px] text-amber-700/70 mt-0.5 line-clamp-2 leading-relaxed">Avocados · Oat milk · Chia seeds · Greek yogurt...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
