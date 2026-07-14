import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const ReminderDetails: React.FC = () => {
  const { currentRoute, navigate, goBack } = useNavigateApp();
  const { reminders, toggleReminderCompletion, updateReminder, deleteReminder, addNotification } = useApp();

  const reminderId = currentRoute.params?.id;
  const reminder = reminders.find(r => r.id === reminderId);

  const [snoozeActive, setSnoozeActive] = useState(false);

  if (!reminder) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-500">Reminder Not Found</h2>
        <p className="text-sm text-gray-500">This alarm configuration is missing.</p>
        <button onClick={goBack} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">Go Back</button>
      </div>
    );
  }

  const handleSnooze = () => {
    setSnoozeActive(true);
    
    // Parse time and add 15 minutes
    const [hours, minutes] = reminder.dueTime.split(':').map(Number);
    let newMin = minutes + 15;
    let newHr = hours;
    if (newMin >= 60) {
      newMin -= 60;
      newHr = (newHr + 1) % 24;
    }
    const formatTime = `${String(newHr).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;

    setTimeout(() => {
      updateReminder(reminder.id, { dueTime: formatTime });
      setSnoozeActive(false);
      addNotification("Snoozed ⏰", `"${reminder.title}" was snoozed for 15 mins. New alert set for ${formatTime}.`, 'reminder');
      goBack();
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl font-black text-primary">Alarm Details</h2>
            <p className="text-[10px] text-gray-400">Manage reminder status</p>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button 
            onClick={() => navigate('create_reminder', { id: reminder.id })}
            className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-[#3525cd] dark:bg-indigo-950/20 dark:text-[#c3c0ff] rounded-xl transition-all"
            title="Edit Alarm"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button 
            onClick={() => { deleteReminder(reminder.id); goBack(); }}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl transition-all"
            title="Delete Alarm"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="glass-card rounded-[24px] p-6 space-y-6">
        
        {/* Core Alarm display */}
        <div className="text-center space-y-2 border-b border-gray-150/40 dark:border-slate-800/30 pb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-[#3525cd] dark:text-[#c3c0ff] flex items-center justify-center mx-auto mb-2 shadow-inner">
            <span className="material-symbols-outlined text-3xl font-bold">alarm</span>
          </div>
          <h3 className={`font-headline-md text-2xl font-black text-gray-800 dark:text-white ${reminder.completed ? 'line-through text-gray-400' : ''}`}>
            {reminder.title}
          </h3>
          <p className="text-2xl font-black text-primary font-mono">{reminder.dueTime}</p>
          <div className="flex gap-2 justify-center items-center text-[10px] text-gray-400 font-bold uppercase">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">{reminder.category}</span>
            {reminder.recurrence !== 'none' && (
              <>
                <span>•</span>
                <span>🔄 {reminder.recurrence}</span>
              </>
            )}
          </div>
        </div>

        {/* Date, Location Metadata */}
        <div className="grid grid-cols-2 gap-sm p-4 bg-white/30 dark:bg-slate-800/10 border border-white/10 rounded-2xl text-xs font-semibold">
          <div>
            <span className="block text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Alert Date</span>
            📅 {reminder.dueDate}
          </div>
          <div>
            <span className="block text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">Location Anchor</span>
            📍 {reminder.location || 'Not Specified'}
          </div>
        </div>

        {/* Priority Badge */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider">Priority Level</span>
          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
            reminder.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
            reminder.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
            'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
          }`}>
            {reminder.priority}
          </span>
        </div>

        {/* Alarm Notes */}
        {reminder.notes && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alarm Guidelines</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 bg-white/20 dark:bg-slate-800/10 p-3 rounded-xl border border-white/10 leading-relaxed italic">
              "{reminder.notes}"
            </p>
          </div>
        )}

        {/* Complete / Snooze Buttons */}
        {!reminder.completed && (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={snoozeActive}
              onClick={handleSnooze}
              className="flex-1 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-800/30 flex items-center justify-center gap-1"
            >
              {snoozeActive ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">snooze</span>
                  Snooze 15m
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => { toggleReminderCompletion(reminder.id); goBack(); }}
              className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-base">check</span>
              Complete Alarm
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
