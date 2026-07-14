import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp, Reminder } from '../../context/AppContext';

export const ReminderDashboard: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { reminders, toggleReminderCompletion, deleteReminder } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories list
  const categories = ['All', 'Medicines', 'Meetings', 'Birthdays', 'Subscriptions', 'Custom'];

  // Filter reminders
  const filteredReminders = reminders.filter(r => {
    const matchesTab = activeTab === 'active' ? !r.completed : r.completed;
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-2xl font-black text-primary">Smart Reminders</h2>
          <p className="text-xs text-gray-500">Configure alarms, periodic routines & location-based pings</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('reminder_categories')}
            className="p-2.5 bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20"
            title="Manage Categories"
          >
            <span className="material-symbols-outlined text-lg">folder_open</span>
          </button>
          <button 
            onClick={() => navigate('create_reminder')}
            className="flex items-center gap-1 bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <span className="material-symbols-outlined text-lg font-bold">add</span> Create Reminder
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200/50 dark:bg-slate-800/60 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'active' 
              ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-[#c3c0ff]' 
              : 'text-gray-500'
          }`}
        >
          Active Alarms ({reminders.filter(r => !r.completed).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'completed' 
              ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-[#c3c0ff]' 
              : 'text-gray-500'
          }`}
        >
          Completed ({reminders.filter(r => r.completed).length})
        </button>
      </div>

      {/* Search & Categories Bar */}
      <div className="space-y-3 bg-white/40 dark:bg-slate-900/30 p-3 rounded-2xl border border-white/20">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reminders..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs outline-none"
          />
        </div>

        {/* Categories Pills scrollable */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                  : 'bg-white/40 dark:bg-slate-800/40 text-gray-500 border-white/10 hover:border-indigo-600/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="glass-card rounded-[24px] p-6 flex-1 flex flex-col min-h-[300px]">
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
          {filteredReminders.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="material-symbols-outlined text-5xl mb-2">notifications_off</span>
              <h4 className="font-bold text-sm">No reminders to show</h4>
              <p className="text-xs">Select other categories or log a new alarm schedule.</p>
            </div>
          ) : (
            filteredReminders.map(rem => (
              <div 
                key={rem.id}
                className={`flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-800/20 border border-white/20 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                  rem.completed ? 'opacity-65' : ''
                }`}
                onClick={() => navigate('reminder_details', { id: rem.id })}
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleReminderCompletion(rem.id); }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      rem.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'
                    }`}
                  >
                    {rem.completed && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                  </button>
                  
                  <div>
                    <h4 className={`font-bold text-sm ${rem.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                      {rem.title}
                    </h4>
                    <div className="flex gap-2 items-center text-[10px] text-gray-400 mt-0.5 font-bold uppercase">
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">{rem.category}</span>
                      <span>⏰ {rem.dueDate} at {rem.dueTime}</span>
                      {rem.recurrence !== 'none' && <span>🔄 {rem.recurrence}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rem.location && (
                    <span className="material-symbols-outlined text-base text-gray-400" title={`Location: ${rem.location}`}>location_on</span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteReminder(rem.id); }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">close</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
