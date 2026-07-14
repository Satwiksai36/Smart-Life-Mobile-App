import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const HabitDetails: React.FC = () => {
  const { currentRoute, goBack } = useNavigateApp();
  const { habits, toggleHabitCheck, deleteHabit } = useApp();

  const habitId = currentRoute.params?.id;
  const habit = habits.find(h => h.id === habitId);

  if (!habit) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-500">Habit Not Found</h2>
        <p className="text-sm text-gray-500">This habit loop details cannot be fetched.</p>
        <button onClick={goBack} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">Go Back</button>
      </div>
    );
  }

  // Generate 84 days (12 weeks) for Heatmap Calendar starting 83 days ago up to July 14, 2026
  const heatmapDays: string[] = [];
  const baseDate = new Date('2026-07-14');
  
  for (let i = 83; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    heatmapDays.push(dateStr);
  }

  // Stats
  const totalChecked = Object.values(habit.history).filter(v => v).length;
  const targetNumber = habit.targetGoal;
  const currentMonthISO = '2026-07';
  const checkedThisMonth = Object.keys(habit.history).filter(date => date.startsWith(currentMonthISO) && habit.history[date]).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl font-black text-primary">Habit Visual Heatmap</h2>
            <p className="text-[10px] text-gray-400">Evaluate consistency history</p>
          </div>
        </div>

        <button 
          onClick={() => { deleteHabit(habit.id); goBack(); }}
          className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl transition-all"
          title="Delete Habit"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-sm text-center">
        <div className="glass-card rounded-2xl p-4">
          <span className="material-symbols-outlined text-amber-500 font-bold text-xl">local_fire_department</span>
          <div className="text-xl font-black text-gray-800 dark:text-white mt-1">{habit.streak} Days</div>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Current Streak</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="material-symbols-outlined text-orange-500 font-bold text-xl">military_tech</span>
          <div className="text-xl font-black text-gray-800 dark:text-white mt-1">{habit.longestStreak} Days</div>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Longest Streak</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="material-symbols-outlined text-[#3525cd] font-bold text-xl">done_all</span>
          <div className="text-xl font-black text-gray-800 dark:text-white mt-1">{totalChecked} times</div>
          <span className="text-[9px] text-gray-400 font-bold uppercase">Total Ticks</span>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <span className="material-symbols-outlined text-teal-500 font-bold text-xl">calendar_month</span>
          <div className="text-xl font-black text-gray-800 dark:text-white mt-1">{checkedThisMonth} checked</div>
          <span className="text-[9px] text-gray-400 font-bold uppercase">This Month</span>
        </div>
      </div>

      {/* Interactive Heatmap Card */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <div>
          <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">84-Day Compliance Heatmap</h3>
          <p className="text-[10px] text-gray-400 mt-1">Tap a grid block to toggle checks on past days.</p>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-white/20 dark:bg-slate-900/20 p-4 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[320px] w-full aspect-[12/7]">
            {heatmapDays.map((dayStr, idx) => {
              const isChecked = !!habit.history[dayStr];
              
              // Calculate day index label (e.g. only labels for columns)
              const d = new Date(dayStr);
              const isSunday = d.getDay() === 0;

              return (
                <div 
                  key={idx}
                  onClick={() => toggleHabitCheck(habit.id, dayStr)}
                  title={`${dayStr}: ${isChecked ? 'Checked' : 'Unchecked'}`}
                  className={`rounded-[3px] aspect-square w-full cursor-pointer transition-all hover:scale-115 ${
                    isChecked 
                      ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.3)]' 
                      : 'bg-gray-200/60 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 hover:border-indigo-500/50'
                  }`}
                />
              );
            })}
          </div>
          
          <div className="flex justify-between items-center text-[8px] text-gray-400 font-bold mt-3 px-1 uppercase tracking-wider">
            <span>83 Days Ago</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <div className="w-2 h-2 rounded-[2px] bg-gray-200 dark:bg-slate-800" />
              <div className="w-2 h-2 rounded-[2px] bg-emerald-500" />
              <span>More</span>
            </div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check-in Logs</h3>
        
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {Object.keys(habit.history)
            .filter(d => habit.history[d])
            .sort((a,b) => b.localeCompare(a))
            .map(dStr => (
              <div key={dStr} className="flex justify-between items-center p-3 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-xl text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-200">Checked Complete</span>
                <span className="text-gray-400 font-mono">📅 {dStr}</span>
              </div>
            ))}
          {Object.keys(habit.history).filter(d => habit.history[d]).length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">No logged history checks yet.</p>
          )}
        </div>
      </div>

    </div>
  );
};
