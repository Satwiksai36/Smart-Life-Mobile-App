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
  const totalHabitTicks = habits.reduce((sum, h) => sum + Object.values(h.history).filter(v => v).length, 0);

  // Expenses calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const financialIndex = totalBudget > 0 ? Math.max(0, 100 - Math.round((totalExpenses / totalBudget) * 100)) : 100;

  // Aggregated Productivity Score
  const overallProductivityScore = Math.round((taskVelocity + (activeHabits > 0 ? 85 : 0) + financialIndex) / 3);

  // Mock bar points for productivity index (SVG)
  const barChartData = [
    { label: 'Tasks', val: taskVelocity, color: '#0d9488' }, // Teal
    { label: 'Habits', val: activeHabits > 0 ? 80 : 0, color: '#9333ea' }, // Purple
    { label: 'Finances', val: financialIndex, color: '#0891b2' }, // Cyan
    { label: 'Reminders', val: reminders.length > 0 ? 90 : 0, color: '#4f46e5' } // Indigo
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Intelligence Analytics</h2>
          <p className="text-[10px] text-gray-400">Evaluate overall lifecycle velocity metrics</p>
        </div>
      </div>

      {/* Main Score Card */}
      <div className="glass-card rounded-[24px] p-6 text-center space-y-4">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Aggregate Lifecycle Score</span>
        
        <div className="flex justify-center items-baseline gap-1">
          <span className="text-5xl font-black text-primary">{overallProductivityScore}</span>
          <span className="text-gray-400 font-bold text-sm">/ 100</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto font-medium">
          Congratulations! Your productivity velocity is index-high, driven by high habit compliance streaks.
        </p>
      </div>

      {/* Productivity SVG bar chart */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metrics Performance Comparison</h3>
        
        <div className="bg-white/20 dark:bg-slate-900/20 p-4 rounded-2xl border border-white/10">
          <svg viewBox="0 0 200 120" className="w-full h-auto overflow-visible">
            {/* Grid background lines */}
            <line x1="30" y1="20" x2="190" y2="20" stroke="rgba(0,0,0,0.05)" strokeDasharray="2,2" />
            <line x1="30" y1="60" x2="190" y2="60" stroke="rgba(0,0,0,0.05)" strokeDasharray="2,2" />
            <line x1="30" y1="100" x2="190" y2="100" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

            {/* Render bars */}
            {barChartData.map((b, i) => {
              const xPos = 40 + i * 38;
              const barHeight = (b.val / 100) * 80;
              const yPos = 100 - barHeight;

              return (
                <g key={i}>
                  {/* Bar shadow background */}
                  <rect x={xPos} y="20" width="14" height="80" rx="4" fill="rgba(0,0,0,0.02)" />
                  {/* Actual compliance bar */}
                  <rect 
                    x={xPos} 
                    y={yPos} 
                    width="14" 
                    height={barHeight} 
                    rx="4" 
                    fill={b.color}
                  />
                  <text x={xPos + 7} y="112" fontSize="5" fontWeight="bold" fill="#777587" textAnchor="middle">{b.label}</text>
                  <text x={xPos + 7} y={yPos - 4} fontSize="5" fontWeight="black" fill={b.color} textAnchor="middle">{b.val}%</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Stats summaries logs */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weekly Overview Summaries</h3>
        
        <div className="grid grid-cols-2 gap-sm text-center text-xs font-bold">
          <div className="p-3 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1">Tasks Completed</span>
            🏆 {completedTasks} / {totalTasks}
          </div>
          <div className="p-3 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
            <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1">Habit Checkins</span>
            🔥 {totalHabitTicks} Ticks
          </div>
        </div>
      </div>

    </div>
  );
};
