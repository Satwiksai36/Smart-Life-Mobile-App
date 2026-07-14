import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const CreateReminder: React.FC = () => {
  const { currentRoute, goBack } = useNavigateApp();
  const { reminders, addReminder, updateReminder } = useApp();

  const editId = currentRoute.params?.id;
  const existingReminder = editId ? reminders.find(r => r.id === editId) : null;

  const [title, setTitle] = useState(existingReminder?.title || '');
  const [category, setCategory] = useState(existingReminder?.category || 'Medicines');
  const [dueDate, setDueDate] = useState(existingReminder?.dueDate || '2026-07-14');
  const [dueTime, setDueTime] = useState(existingReminder?.dueTime || '12:00');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(existingReminder?.priority || 'medium');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>(existingReminder?.recurrence || 'none');
  const [notification, setNotification] = useState(existingReminder ? existingReminder.notification : true);
  const [location, setLocation] = useState(existingReminder?.location || '');
  const [notes, setNotes] = useState(existingReminder?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      category,
      dueDate,
      dueTime,
      priority,
      recurrence,
      notification,
      location: location.trim() || undefined,
      notes: notes.trim()
    };

    if (existingReminder) {
      updateReminder(existingReminder.id, payload);
    } else {
      addReminder(payload);
    }

    goBack();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h2 className="font-headline-md text-xl font-black text-primary">{existingReminder ? 'Edit Alarm Reminder' : 'Configure Alarm Reminder'}</h2>
          <p className="text-[10px] text-gray-400">{existingReminder ? 'Update alert thresholds' : 'Establish alert conditions and recurrence'}</p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-[24px] p-6 space-y-5">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="title">Reminder Title</label>
          <input 
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ingest Vitamin D3 Capsules"
            className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none font-bold"
          />
        </div>

        {/* Category & Recurrence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none font-bold"
            >
              <option value="Medicines">Medicines</option>
              <option value="Meetings">Meetings</option>
              <option value="Birthdays">Birthdays</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Travel">Travel</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="recurrence">Recurrence Cycle</label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={(e: any) => setRecurrence(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none font-bold"
            >
              <option value="none">One-time Alert</option>
              <option value="daily">Daily Alarm</option>
              <option value="weekly">Weekly Cycle</option>
              <option value="monthly">Monthly Cycle</option>
              <option value="yearly">Yearly Cycle</option>
            </select>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-sm">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="date">Alert Date</label>
            <input 
              id="date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="time">Alert Time</label>
            <input 
              id="time"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none"
            />
          </div>
        </div>

        {/* Priority selectors */}
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
                    ? p === 'high' ? 'bg-red-50 border-red-500 text-white shadow-sm' :
                      p === 'medium' ? 'bg-amber-50 border-amber-500 text-white shadow-sm' :
                      'bg-blue-500 border-blue-500 text-white shadow-sm'
                    : 'bg-white/40 dark:bg-slate-800/40 text-gray-500 border-white/20'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles: Notification, Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md border-t border-gray-100/50 dark:border-slate-800/30 pt-4">
          <div className="flex justify-between items-center bg-white/20 dark:bg-slate-800/10 p-3.5 rounded-xl border border-white/10">
            <div className="flex flex-col">
              <span className="text-xs font-bold">Push Notifications</span>
              <span className="text-[10px] text-gray-400">Trigger standard notification alert</span>
            </div>
            <input 
              type="checkbox" 
              checked={notification}
              onChange={(e) => setNotification(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500" htmlFor="location">Location-based Alarm (Optional)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">location_on</span>
              <input 
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Local Pharmacy"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="notes">Notes / Guidelines</label>
          <textarea 
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Swallow with water before breakfast..."
            className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none resize-none"
          />
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
            {existingReminder ? 'Save Changes' : 'Save Alarm'}
          </button>
        </div>

      </form>

    </div>
  );
};
