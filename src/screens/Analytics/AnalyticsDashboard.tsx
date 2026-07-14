import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const AnalyticsDashboard: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { reminders, tasks, habits, expenses, budgets } = useApp();

  // Tasks statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskVelocity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Habits statistics
  const activeHabits = habits.length;
  const todayISO = new Date().toISOString().slice(0, 10);
  const completedHabitsToday = habits.filter(h => h.history[todayISO]).length;
  const habitScore = activeHabits > 0 ? Math.round((completedHabitsToday / activeHabits) * 100) : 0;
  const totalHabitTicks = habits.reduce((sum, h) => sum + Object.values(h.history).filter(v => v).length, 0);
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  // Expenses calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const financialIndex = totalBudget > 0 ? Math.max(0, 100 - Math.round((totalExpenses / totalBudget) * 100)) : 100;

  // Reminder score
  const completedReminders = reminders.filter(r => r.completed).length;
  const reminderScore = reminders.length > 0 ? Math.round((completedReminders / reminders.length) * 100) : 0;

  // Aggregated Productivity Score
  const overallScore = Math.round((taskVelocity + habitScore + financialIndex + reminderScore) / 4);
  const gaugeOffset = 251.2 - (251.2 * overallScore) / 100;

  // Dynamic message
  const getMessage = () => {
    if (overallScore >= 75) return 'Outstanding! Your productivity is at peak performance. Keep it up! 🚀';
    if (overallScore >= 50) return 'Good progress! Your velocity is building. Focus on habits to boost further.';
    if (overallScore >= 25) return 'Getting started! Add tasks, habits and reminders to see your score grow.';
    return 'Your journey begins here. Add your first task or habit to start tracking!';
  };

  const barChartData = [
    { label: 'Tasks', val: taskVelocity, color: '#0d9488' },
    { label: 'Habits', val: habitScore, color: '#9333ea' },
    { label: 'Finance', val: financialIndex, color: '#0891b2' },
    { label: 'Alarms', val: reminderScore, color: '#4f46e5' },
  ];

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="text-xl font-black text-indigo-700 dark:text-indigo-300">Intelligence Analytics</h2>
          <p className="text-[10px] text-gray-400">Lifecycle velocity & performance metrics</p>
        </div>
      </div>

      {/* Main Score Card — SVG gauge ring */}
      <div className="glass-card rounded-[24px] p-6 text-center space-y-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Aggregate Lifecycle Score</p>
        
        {/* Big gauge ring */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
              {/* Track */}
              <circle cx="44" cy="44" r="40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
              {/* Score arc */}
              <circle
                cx="44" cy="44" r="40"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{overallScore}</span>
              <span className="text-[9px] text-gray-400 font-bold">/ 100</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed max-w-[260px] mx-auto font-medium">
          {getMessage()}
        </p>
      </div>

      {/* Metrics Bar Chart */}
      <div className="glass-card rounded-[24px] p-5 space-y-4">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Metrics Performance Comparison</h3>
        
        <div className="bg-white/20 dark:bg-slate-900/20 rounded-2xl border border-white/10 p-4">
          <svg viewBox="0 0 220 130" className="w-full h-auto overflow-visible">
            {/* Horizontal grid lines */}
            {[100, 75, 50, 25].map((pct, i) => {
              const y = 20 + ((100 - pct) / 100) * 85;
              return (
                <g key={i}>
                  <line x1="30" y1={y} x2="205" y2={y} stroke="rgba(0,0,0,0.04)" strokeDasharray="3,3" />
                  <text x="25" y={y + 2} fontSize="5" fill="#aaa" textAnchor="end" fontWeight="bold">{pct}%</text>
                </g>
              );
            })}
            {/* Base line */}
            <line x1="30" y1="105" x2="205" y2="105" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

            {/* Bars */}
            {barChartData.map((b, i) => {
              const xPos = 45 + i * 43;
              const barH = Math.max(2, (b.val / 100) * 85);
              const yPos = 105 - barH;
              return (
                <g key={i}>
                  {/* Ghost track */}
                  <rect x={xPos - 1} y="20" width="18" height="85" rx="5" fill="rgba(0,0,0,0.03)" />
                  {/* Filled bar */}
                  <rect x={xPos - 1} y={yPos} width="18" height={barH} rx="5" fill={b.color} opacity="0.9" />
                  {/* Value label */}
                  <text x={xPos + 8} y={yPos - 4} fontSize="5.5" fontWeight="bold" fill={b.color} textAnchor="middle">
                    {b.val}%
                  </text>
                  {/* Category label */}
                  <text x={xPos + 8} y="117" fontSize="5.5" fontWeight="bold" fill="#888" textAnchor="middle">
                    {b.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Weekly Stats Grid */}
      <div className="glass-card rounded-[24px] p-5 space-y-3">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Weekly Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: 'task_alt', label: 'Tasks Completed', val: `${completedTasks} / ${totalTasks}`, color: 'text-teal-600', bg: 'bg-teal-50/60 dark:bg-teal-950/20' },
            { icon: 'local_fire_department', label: 'Best Habit Streak', val: `${maxStreak} days`, color: 'text-orange-500', bg: 'bg-orange-50/60 dark:bg-orange-950/20' },
            { icon: 'bolt', label: 'Habit Check-ins', val: `${totalHabitTicks} ticks`, color: 'text-purple-600', bg: 'bg-purple-50/60 dark:bg-purple-950/20' },
            { icon: 'currency_rupee', label: 'Budget Used', val: `₹${totalExpenses.toLocaleString('en-IN', {maximumFractionDigits:0})}`, color: 'text-indigo-600', bg: 'bg-indigo-50/60 dark:bg-indigo-950/20' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-3 ${s.bg} border border-white/20`}>
              <span className={`material-symbols-outlined text-lg ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              <p className={`text-sm font-black mt-0.5 ${s.color}`}>{s.val}</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
