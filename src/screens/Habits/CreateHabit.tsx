import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const CreateHabit: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { addHabit } = useApp();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('water_drop');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [targetGoal, setTargetGoal] = useState('7');

  const icons = [
    { name: 'water_drop', label: 'Hydration' },
    { name: 'menu_book', label: 'Reading' },
    { name: 'fitness_center', label: 'Workout' },
    { name: 'self_improvement', label: 'Meditation' },
    { name: 'sleep', label: 'Sleep Quality' },
    { name: 'payments', label: 'Budgets Review' },
    { name: 'edit_note', label: 'Journaling' },
    { name: 'favorite', label: 'Health Care' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      icon,
      frequency,
      priority,
      targetGoal: parseInt(targetGoal) || 5
    });

    goBack();
  };

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">Establish Habit Loop</h2>
          <p className="text-[10px] text-gray-400">Setup triggers, icons & schedules</p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-[24px] p-6 space-y-5">
        
        {/* Name input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="name">Habit Description Name</label>
          <input 
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Read Tech Documentation"
            className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none font-bold"
          />
        </div>

        {/* Icon selector grid */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">Choose Icon Tag</label>
          <div className="grid grid-cols-4 gap-sm text-center">
            {icons.map(ic => (
              <button
                key={ic.name}
                type="button"
                onClick={() => setIcon(ic.name)}
                className={`p-3 rounded-2xl flex flex-col items-center border transition-all ${
                  icon === ic.name 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102' 
                    : 'bg-white/40 dark:bg-slate-800/40 text-gray-500 border-white/20 hover:border-indigo-600/30'
                }`}
                title={ic.label}
              >
                <span className="material-symbols-outlined text-xl">{ic.name}</span>
                <span className="text-[8px] font-bold mt-1.5 truncate w-full">{ic.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency & Target Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Frequency selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Target Frequency</label>
            <select
              value={frequency}
              onChange={(e: any) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none font-bold"
            >
              <option value="daily">Daily Loop</option>
              <option value="weekly">Weekly Target</option>
              <option value="monthly">Monthly Milestone</option>
            </select>
          </div>

          {/* Target Goal input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Target Times per period</label>
            <input 
              type="number"
              min="1"
              max="30"
              required
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none font-bold"
            />
          </div>
        </div>

        {/* Priority buttons */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">Priority Level</label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p as any)}
                className={`flex-1 py-2.5 text-xs font-bold capitalize rounded-xl border transition-all ${
                  priority === p 
                    ? p === 'high' ? 'bg-red-500 border-red-500 text-white shadow-sm' :
                      p === 'medium' ? 'bg-amber-500 border-amber-500 text-white shadow-sm' :
                      'bg-blue-500 border-blue-500 text-white shadow-sm'
                    : 'bg-white/40 dark:bg-slate-800/40 text-gray-500 border-white/20'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100/50 dark:border-slate-800/30">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-800/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20"
          >
            Create Habit
          </button>
        </div>

      </form>

    </div>
  );
};
