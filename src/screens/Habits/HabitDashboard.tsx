import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const HabitDashboard: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { habits, toggleHabitCheck } = useApp();

  const todayISO = '2026-07-14';

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-2xl font-black text-primary">Habit Tracker</h2>
          <p className="text-xs text-gray-500 font-medium">Build micro-routines, log streaks & hit milestones</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('habit_analytics')}
            className="p-2.5 bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20"
            title="Habit Analytics"
          >
            <span className="material-symbols-outlined text-lg">show_chart</span>
          </button>
          <button 
            onClick={() => navigate('create_habit')}
            className="flex items-center gap-1 bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <span className="material-symbols-outlined text-lg font-bold">add</span> Create Habit
          </button>
        </div>
      </div>

      {/* Streaks Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="md:col-span-2 glass-card rounded-[24px] p-6 flex items-center justify-between min-h-[120px]">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Consistency Record</span>
            <h3 className="text-xl font-black text-gray-800 dark:text-white mt-1">Streaks Loop Active</h3>
            <p className="text-xs text-gray-500 mt-1">Keep daily ticks complete to unlock monthly badges.</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-tr from-amber-500 to-orange-500 text-white px-4 py-3 rounded-2xl shadow-md">
            <span className="material-symbols-outlined text-2xl font-bold">local_fire_department</span>
            <div>
              <div className="text-lg font-black leading-none">
                {habits.reduce((max, h) => Math.max(max, h.streak), 0)} Days
              </div>
              <div className="text-[9px] uppercase font-bold tracking-wider">Max Streak</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-6 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Today's Check-ins</span>
          <div className="text-3xl font-black text-primary dark:text-primary-fixed-dim">
            {habits.filter(h => h.history[todayISO]).length} / {habits.length}
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-1">habits checked off today</p>
        </div>
      </div>

      {/* Habits check-off lists */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Today's Routines</h3>
        
        <div className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-1">autorenew</span>
              <p className="text-xs font-semibold">No habits defined yet.</p>
            </div>
          ) : (
            habits.map(habit => {
              const isChecked = !!habit.history[todayISO];
              return (
                <div 
                  key={habit.id}
                  className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-800/20 border border-white/20 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div 
                    onClick={() => navigate('habit_details', { id: habit.id })}
                    className="flex items-center gap-3 cursor-pointer flex-1 mr-4"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isChecked 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-indigo-50/50 dark:bg-indigo-950/20 text-[#3525cd] dark:text-[#c3c0ff]'
                    }`}>
                      <span className="material-symbols-outlined text-xl">{habit.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isChecked ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                        {habit.name}
                      </h4>
                      <div className="flex gap-2 items-center text-[9px] text-gray-400 mt-0.5 font-bold uppercase">
                        <span>🔥 {habit.streak} day streak</span>
                        <span>•</span>
                        <span>📅 {habit.frequency}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleHabitCheck(habit.id, todayISO)}
                    className={`px-4 py-2 text-[10px] font-bold rounded-xl border transition-all ${
                      isChecked 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                        : 'bg-white/40 dark:bg-slate-800/40 text-gray-500 border-white/20 hover:border-indigo-600'
                    }`}
                  >
                    {isChecked ? 'Completed' : 'Check In'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Achievements Milestones */}
      <div className="glass-card rounded-[24px] p-6">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Milestones & Badges</h3>
        <div className="grid grid-cols-2 gap-sm">
          <div className="p-3.5 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-slate-800/20 dark:to-slate-800/10 rounded-2xl border border-amber-100/25 flex gap-3 items-center">
            <span className="material-symbols-outlined text-2xl text-amber-500 font-bold">emoji_events</span>
            <div>
              <h4 className="font-bold text-xs">Consistent Hydrator</h4>
              <p className="text-[9px] text-gray-500">Unlocked at 5-day water streak</p>
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-slate-800/20 dark:to-slate-800/10 rounded-2xl border border-purple-100/25 flex gap-3 items-center opacity-60">
            <span className="material-symbols-outlined text-2xl text-purple-500">military_tech</span>
            <div>
              <h4 className="font-bold text-xs">Gym Specialist</h4>
              <p className="text-[9px] text-gray-500">Reach 30 checks (Locked)</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
