import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const HabitAnalytics: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { habits } = useApp();

  // Calculations for compliance metrics
  const complianceData = habits.map(h => {
    const checked = Object.values(h.history).filter(v => v).length;
    // Assume we track total days since creation, let's mock it to a minimum of 10 days for nice percentage calculations
    const totalDays = 15;
    const rate = Math.round((checked / totalDays) * 100);
    return {
      name: h.name,
      checked,
      rate: Math.min(100, rate),
      streak: h.streak
    };
  }).sort((a,b) => b.rate - a.rate);

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Habit Analytics</h2>
          <p className="text-[10px] text-gray-400">Evaluate habit loops and consistency</p>
        </div>
      </div>

      {/* Compliance Rate Card */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Productivity Indexes</span>
          <h3 className="font-headline-md text-lg font-black mt-0.5">Routines Compliance</h3>
        </div>

        <div className="space-y-4 pt-2">
          {complianceData.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-200">{item.name}</span>
                <div className="text-right">
                  <span className="font-black text-primary dark:text-[#c3c0ff]">{item.rate}%</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1.5">({item.checked} checks)</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700/50 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    item.rate > 80 ? 'bg-emerald-500' :
                    item.rate > 50 ? 'bg-amber-500' :
                    'bg-indigo-600'
                  }`}
                  style={{ width: `${item.rate}%` }}
                />
              </div>
            </div>
          ))}
          {complianceData.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">No active habits to calculate.</p>
          )}
        </div>
      </div>

      {/* Streaks records rankings */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Streaks Leaderboard</h3>
        <div className="space-y-3">
          {habits.map((h, idx) => (
            <div key={h.id} className="flex justify-between items-center p-3 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-400">#0{idx+1}</span>
                <span className="font-bold text-gray-700 dark:text-gray-200">{h.name}</span>
              </div>
              <span className="font-black text-amber-600 dark:text-amber-400">🔥 {h.streak} days active</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
