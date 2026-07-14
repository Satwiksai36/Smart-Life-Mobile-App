import React, { useRef, useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const UserProfile: React.FC = () => {
  const { navigate, goBack } = useNavigateApp();
  const { user, updateUser, tasks, habits, expenses } = useApp();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [isEditing, setIsEditing] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, bio });
    setIsEditing(false);
  };

  // ── Real photo upload: read as base64 dataURL ──
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5 MB.');
      return;
    }
    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateUser({ photo: dataUrl });
      setPhotoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Calculations
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const totalCost = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="text-xl font-black text-indigo-700 dark:text-indigo-300">Member Profile</h2>
            <p className="text-[10px] text-gray-400">Manage account information</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('settings')}
          className="p-2.5 bg-white/40 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-white/60 border border-white/20"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="glass-card rounded-[24px] p-6 space-y-5 text-center">
        
        {/* User Photo — tap to upload */}
        <div className="relative w-24 h-24 mx-auto">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-30 blur-md scale-110" />
          <img 
            alt="User Photo"
            className="relative w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
            src={user.photo}
          />
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          {/* Edit button triggers file picker */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={photoUploading}
            className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md transition-colors"
          >
            {photoUploading ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-xs">photo_camera</span>
            )}
          </button>
        </div>

        {/* Photo hint */}
        <p className="text-[9px] text-gray-400 -mt-2">Tap camera icon to change photo</p>

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
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2.5 text-xs font-bold text-gray-500 border border-gray-200/50 rounded-xl">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-black text-gray-800 dark:text-gray-100">{user.name}</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{user.bio}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl border border-indigo-100/40 hover:bg-indigo-100 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: 'task_alt', label: 'Tasks Done', val: completedTasks, color: 'text-teal-600', bg: 'bg-teal-50/60 dark:bg-teal-950/20' },
          { icon: 'local_fire_department', label: 'Best Streak', val: `${maxStreak}d`, color: 'text-orange-500', bg: 'bg-orange-50/60 dark:bg-orange-950/20' },
          { icon: 'currency_rupee', label: 'Total Spent', val: `₹${totalCost > 999 ? (totalCost/1000).toFixed(1)+'k' : totalCost}`, color: 'text-indigo-600', bg: 'bg-indigo-50/60 dark:bg-indigo-950/20' },
        ].map(s => (
          <div key={s.label} className={`glass-card rounded-[18px] p-3 text-center ${s.bg}`}>
            <span className={`material-symbols-outlined text-xl ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            <p className={`text-sm font-black mt-0.5 ${s.color}`}>{s.val}</p>
            <p className="text-[8px] text-gray-400 font-bold uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Account Actions */}
      <div className="glass-card rounded-[24px] p-4 space-y-1">
        {[
          { icon: 'analytics', label: 'View Analytics', action: () => navigate('analytics'), color: 'text-purple-600' },
          { icon: 'notifications', label: 'Notification Center', action: () => navigate('notifications'), color: 'text-blue-600' },
          { icon: 'settings', label: 'App Settings', action: () => navigate('settings'), color: 'text-gray-600' },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
          >
            <span className={`material-symbols-outlined text-xl ${item.color}`}>{item.icon}</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex-grow text-left">{item.label}</span>
            <span className="material-symbols-outlined text-sm text-gray-300">chevron_right</span>
          </button>
        ))}
      </div>

    </div>
  );
};
