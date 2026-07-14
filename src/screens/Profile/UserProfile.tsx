import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const UserProfile: React.FC = () => {
  const { navigate, goBack } = useNavigateApp();
  const { user, updateUser, tasks, habits, expenses } = useApp();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, bio });
    setIsEditing(false);
  };

  // Calculations
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const totalCost = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl font-black text-primary">Member Profile</h2>
            <p className="text-[10px] text-gray-400">Manage account information</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('settings')}
          className="p-2.5 bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="glass-card rounded-[24px] p-6 space-y-6 text-center">
        
        {/* User Photo */}
        <div className="relative w-24 h-24 mx-auto">
          <img 
            alt="User Headshot"
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
            src={user.photo}
          />
          <button 
            onClick={() => alert("Simulation: Upload profile image.")}
            className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full flex items-center justify-center border border-white"
          >
            <span className="material-symbols-outlined text-xs">edit</span>
          </button>
        </div>

        {/* Text descriptions or Editing Form */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-3 text-left">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bio Description</label>
              <textarea 
                rows={2}
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs outline-none resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="flex-1 py-2 text-xs font-bold bg-white/40 border border-white/20 rounded-xl text-center"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-grow py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl text-center"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-1.5 items-center justify-center">
              <h3 className="font-headline-md text-xl font-black">{user.name}</h3>
              <span className="text-[8px] font-black text-amber-600 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase">
                {user.membership}
              </span>
            </div>
            <p className="text-xs text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-[280px] mx-auto italic">
              "{user.bio}"
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 bg-white/40 hover:bg-white/60 text-xs font-bold rounded-xl border border-white/20 transition-all"
            >
              Edit Details
            </button>
          </div>
        )}
      </div>

      {/* Lifefycle metrics */}
      <div className="glass-card rounded-[24px] p-6 space-y-4">
        <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overall Achievements</h3>
        
        <div className="grid grid-cols-3 gap-sm text-center">
          <div className="bg-white/20 dark:bg-slate-800/10 p-3 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-teal-600 text-xl font-bold">task_alt</span>
            <div className="text-base font-black mt-1">{completedTasks} Done</div>
            <span className="text-[8px] text-gray-400 uppercase font-bold mt-0.5">Tasks Cleared</span>
          </div>

          <div className="bg-white/20 dark:bg-slate-800/10 p-3 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-amber-500 text-xl font-bold font-variation-fill">local_fire_department</span>
            <div className="text-base font-black mt-1">{maxStreak} Days</div>
            <span className="text-[8px] text-gray-400 uppercase font-bold mt-0.5">Max Streak</span>
          </div>

          <div className="bg-white/20 dark:bg-slate-800/10 p-3 rounded-2xl border border-white/10">
            <span className="material-symbols-outlined text-emerald-600 text-xl font-bold">savings</span>
            <div className="text-base font-black mt-1">₹{totalCost.toFixed(0)} Logged</div>
            <span className="text-[8px] text-gray-400 uppercase font-bold mt-0.5">Total Spent</span>
          </div>
        </div>
      </div>

    </div>
  );
};
