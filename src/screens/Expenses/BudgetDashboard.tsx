import React from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const BudgetDashboard: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { budgets, updateBudgetLimit } = useApp();

  const categories = Object.keys(budgets);

  const handleSliderChange = (category: string, value: number) => {
    updateBudgetLimit(category, value);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Budget Boundaries</h2>
          <p className="text-[10px] text-gray-400">Establish maximum limits for categories</p>
        </div>
      </div>

      {/* Limits Slider Form */}
      <div className="glass-card rounded-[24px] p-6 space-y-6">
        <p className="text-xs text-gray-500 leading-relaxed">
          Set safe spending limits. When expenditures in a category reach 80% and 100% threshold boundaries, Aura will flag system notifications.
        </p>

        <div className="space-y-6 pt-2">
          {categories.map(cat => {
            const limit = budgets[cat];
            return (
              <div key={cat} className="space-y-2 p-4 bg-white/20 dark:bg-slate-800/10 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-gray-700 dark:text-gray-200">{cat} limit</span>
                  <span className="text-primary dark:text-[#c3c0ff]">₹{limit}</span>
                </div>
                
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] text-gray-400 font-bold">₹0</span>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={limit}
                    onChange={(e) => handleSliderChange(cat, parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                  />
                  <span className="text-[10px] text-gray-400 font-bold">₹50,000</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={goBack}
          className="w-full bg-[#4f46e5] text-white rounded-xl py-3.5 font-bold text-sm shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-transform"
        >
          Confirm boundaries
        </button>
      </div>

    </div>
  );
};
