import React from 'react';
import { useNavigateApp } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';

export const NotificationCenter: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl font-black text-primary">Notification Center</h2>
            <p className="text-[10px] text-gray-400">Review system warnings, alarms & coach messages</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={markAllNotificationsRead}
            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-xl text-[10px] font-bold transition-all"
            title="Mark all as read"
          >
            Mark All Read
          </button>
          <button 
            onClick={clearNotifications}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl transition-all"
            title="Clear All Logs"
          >
            <span className="material-symbols-outlined text-lg">delete_sweep</span>
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="glass-card rounded-[24px] p-6 flex-grow flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="material-symbols-outlined text-5xl mb-2 opacity-50">notifications_off</span>
              <h4 className="font-bold text-sm">Inbox is completely clear</h4>
              <p className="text-xs mt-1">No alerts or warnings present.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`flex items-start gap-3 p-4 bg-white/40 dark:bg-slate-800/10 border rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/20 transition-colors cursor-pointer ${
                  notif.read ? 'border-white/10 opacity-70' : 'border-indigo-400/50 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notif.category === 'reminder' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' :
                  notif.category === 'task' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-600' :
                  notif.category === 'expense' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' :
                  'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300'
                }`}>
                  <span className="material-symbols-outlined text-base">
                    {
                      notif.category === 'reminder' ? 'alarm' :
                      notif.category === 'task' ? 'task_alt' :
                      notif.category === 'expense' ? 'payments' :
                      'info'
                    }
                  </span>
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-gray-700 dark:text-gray-200">{notif.title}</h4>
                    <span className="text-[8px] text-gray-400 font-bold">{notif.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{notif.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
