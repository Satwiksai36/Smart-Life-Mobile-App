import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const Settings: React.FC = () => {
  const { resetTo, goBack } = useNavigateApp();
  const { settings, updateSettings, logout, addNotification } = useApp();

  const [syncing, setSyncing] = useState(false);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ language: e.target.value as any });
  };

  const handleSyncBackup = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      addNotification("Cloud Sync Successful", "Database backup saved to secure Cloud storage.", 'system');
      alert("Backup synced successfully!");
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">General Settings</h2>
          <p className="text-[10px] text-gray-400">Configure global app behaviors</p>
        </div>
      </div>

      {/* Settings Options Group */}
      <div className="glass-card rounded-[24px] p-6 space-y-5">
        
        {/* Theme Toggle option */}
        <div className="flex justify-between items-center p-3.5 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Dark Mode styling</span>
            <span className="text-[10px] text-gray-400">Toggle dark visual mode</span>
          </div>
          <button 
            type="button"
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              settings.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
              settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Notifications push toggle */}
        <div className="flex justify-between items-center p-3.5 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">System Notifications</span>
            <span className="text-[10px] text-gray-400">Receive schedule alarms & warnings</span>
          </div>
          <input 
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer animate-none"
          />
        </div>

        {/* Biometrics biometric authentication */}
        <div className="flex justify-between items-center p-3.5 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Biometric Lock</span>
            <span className="text-[10px] text-gray-400">Enable TouchID / FaceID checkouts</span>
          </div>
          <input 
            type="checkbox"
            checked={settings.biometricsEnabled}
            onChange={(e) => updateSettings({ biometricsEnabled: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer animate-none"
          />
        </div>

        {/* Language selector */}
        <div className="flex justify-between items-center p-3.5 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">System Language</span>
            <span className="text-[10px] text-gray-400">Select language preferences</span>
          </div>
          <select
            value={settings.language}
            onChange={handleLanguageChange}
            className="bg-transparent border-none p-0 text-xs font-bold text-[#3525cd] dark:text-[#c3c0ff] focus:ring-0 cursor-pointer outline-none"
          >
            <option value="en" className="dark:bg-slate-800 text-gray-700 dark:text-gray-300">English (US)</option>
            <option value="es" className="dark:bg-slate-800 text-gray-700 dark:text-gray-300">Español (ES)</option>
            <option value="fr" className="dark:bg-slate-800 text-gray-700 dark:text-gray-300">Français (FR)</option>
          </select>
        </div>

        {/* Sync Backup database */}
        <div className="flex justify-between items-center p-3.5 bg-white/40 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Cloud Sync Backup</span>
            <span className="text-[10px] text-gray-400">Sync SQLite databases records</span>
          </div>
          <button 
            type="button"
            disabled={syncing}
            onClick={handleSyncBackup}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 text-[10px] font-bold rounded-xl flex items-center gap-1 transition-all"
          >
            {syncing ? (
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-sm font-bold">cloud_upload</span>
                Sync Backup
              </>
            )}
          </button>
        </div>

        {/* Major logout */}
        <button
          onClick={() => {
            logout();
            resetTo('login');
          }}
          className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 font-bold rounded-xl py-3.5 text-xs flex justify-center items-center gap-1 transition-colors border border-red-100 dark:border-red-900/10"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Logout from current Device
        </button>

      </div>

    </div>
  );
};
