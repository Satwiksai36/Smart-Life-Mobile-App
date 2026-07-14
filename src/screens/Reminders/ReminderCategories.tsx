import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const ReminderCategories: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { addNotification } = useApp();

  const [categories, setCategories] = useState<string[]>([
    'Medicines', 'Meetings', 'Birthdays', 'Subscriptions', 'Travel', 'Workout', 'Custom'
  ]);
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    
    if (categories.includes(newCat.trim())) {
      alert("Category already exists.");
      return;
    }

    setCategories([...categories, newCat.trim()]);
    addNotification("Category Added", `"${newCat.trim()}" added to reminder categories list.`, 'reminder');
    setNewCat('');
  };

  const handleRemove = (category: string) => {
    if (['Medicines', 'Meetings', 'Custom'].includes(category)) {
      alert("Default system categories cannot be deleted.");
      return;
    }
    setCategories(categories.filter(c => c !== category));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Reminder Categories</h2>
          <p className="text-[10px] text-gray-400">Classify alarms for easy filtering</p>
        </div>
      </div>

      {/* Categories board */}
      <div className="glass-card rounded-[24px] p-6 space-y-5">
        
        {/* Creation Input */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input 
            type="text"
            required
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="e.g. Study Sessions"
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs outline-none font-bold"
          />
          <button
            type="submit"
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg font-bold">add</span>
          </button>
        </form>

        {/* Categories List */}
        <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide pt-2">
          {categories.map(c => (
            <div key={c} className="flex justify-between items-center p-3.5 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-base">label</span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{c}</span>
              </div>
              
              {!['Medicines', 'Meetings', 'Custom'].includes(c) ? (
                <button
                  onClick={() => handleRemove(c)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm font-bold">delete</span>
                </button>
              ) : (
                <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">System</span>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
