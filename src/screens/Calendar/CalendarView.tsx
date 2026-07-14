import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const CalendarView: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { reminders, tasks, habits, expenses } = useApp();

  const [selectedDate, setSelectedDate] = useState('2026-07-14');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');

  // Generate July 2026 calendar (July 1st, 2026 was a Wednesday, 31 days)
  const daysInJuly = 31;
  const startDayOffset = 3; // Wednesday (0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed...)

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInJuly; d++) {
    calendarDays.push(d);
  }

  // Get all scheduled items for a specific date (YYYY-MM-DD)
  const getItemsForDate = (dateStr: string) => {
    const day = dateStr.split('-')[2];
    const items: { id: string; title: string; type: 'task' | 'reminder' | 'habit' | 'bill'; time?: string; priority?: string; completed?: boolean }[] = [];

    // Reminders matching date
    reminders.forEach(r => {
      if (r.dueDate === dateStr) {
        items.push({ id: r.id, title: r.title, type: 'reminder', time: r.dueTime, priority: r.priority, completed: r.completed });
      }
    });

    // Tasks matching date
    tasks.forEach(t => {
      if (t.dueDate === dateStr) {
        items.push({ id: t.id, title: t.title, type: 'task', time: t.dueTime, priority: t.priority, completed: t.status === 'completed' });
      }
    });

    // Habits checked on this date
    habits.forEach(h => {
      if (h.history[dateStr]) {
        items.push({ id: h.id, title: `Completed Habit: ${h.name}`, type: 'habit', time: 'Daily Check', completed: true });
      }
    });

    // Bills/Expenses matching date
    expenses.forEach(e => {
      if (e.date === dateStr) {
        items.push({ id: e.id, title: `Bill Log: ${e.merchant}`, type: 'bill', time: 'Paid', completed: true });
      }
    });

    return items;
  };

  const selectedDateItems = getItemsForDate(selectedDate);

  const handleDateClick = (day: number | null) => {
    if (day === null) return;
    const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const handleItemClick = (item: any) => {
    if (item.type === 'task') {
      navigate('task_details', { id: item.id });
    } else if (item.type === 'reminder') {
      navigate('reminder_details', { id: item.id });
    } else if (item.type === 'bill') {
      navigate('expense_details', { id: item.id });
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-2xl font-black text-primary">Unified Calendar</h2>
          <p className="text-xs text-gray-500">Aggregate tasks, reminders, habits & bill schedules</p>
        </div>
        
        {/* View Mode controls */}
        <div className="bg-gray-200/50 dark:bg-slate-800/60 p-0.5 rounded-xl flex">
          {['month', 'week', 'agenda'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                viewMode === mode 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-[#c3c0ff]' 
                  : 'text-gray-400'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly View Grid */}
      {viewMode === 'month' && (
        <div className="glass-card rounded-[24px] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-base font-black text-gray-800 dark:text-white">July 2026</h3>
            <div className="flex gap-1">
              <button className="material-symbols-outlined text-sm text-gray-400 hover:text-gray-600">chevron_left</button>
              <button className="material-symbols-outlined text-sm text-gray-400 hover:text-gray-600">chevron_right</button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="space-y-2 bg-white/20 dark:bg-slate-900/10 p-3 rounded-2xl border border-white/10">
            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 uppercase">
              {weekdays.map(d => <span key={d}>{d}</span>)}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
              {calendarDays.map((day, idx) => {
                const dateStr = day ? `2026-07-${String(day).padStart(2, '0')}` : '';
                const isSelected = dateStr === selectedDate;
                const hasEvents = day ? getItemsForDate(dateStr).length > 0 : false;
                const isToday = day === 14;

                return (
                  <div 
                    key={idx}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all relative ${
                      day === null ? 'pointer-events-none opacity-0' :
                      isSelected ? 'bg-indigo-600 text-white shadow-md' :
                      isToday ? 'bg-[#e2dfff] dark:bg-indigo-950/40 text-primary dark:text-[#c3c0ff] border border-indigo-200' :
                      'hover:bg-white/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <span>{day}</span>
                    {hasEvents && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute bottom-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Week View Grid */}
      {viewMode === 'week' && (
        <div className="glass-card rounded-[24px] p-6 space-y-4">
          <h3 className="font-headline-md text-base font-black text-gray-800 dark:text-white">Week of July 12 - July 18</h3>
          
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {[12, 13, 14, 15, 16, 17, 18].map(day => {
              const dateStr = `2026-07-${day}`;
              const isSelected = dateStr === selectedDate;
              const hasEvents = getItemsForDate(dateStr).length > 0;
              return (
                <div 
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`py-3 rounded-2xl cursor-pointer border transition-all ${
                    isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' :
                    day === 14 ? 'bg-[#e2dfff] text-primary border-indigo-200' :
                    'bg-white/40 dark:bg-slate-800/20 border-white/10 hover:border-indigo-600/30'
                  }`}
                >
                  <span className="block text-[8px] font-bold text-gray-400 uppercase">{weekdays[(day + startDayOffset - 1) % 7]}</span>
                  <span className="text-base font-black mt-1 block">{day}</span>
                  {hasEvents && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Day Agenda Lists */}
      <div className="glass-card rounded-[24px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Agenda for {selectedDate === '2026-07-14' ? 'Today' : selectedDate}
          </h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{selectedDateItems.length} events planned</span>
        </div>

        <div className="space-y-3 scrollbar-hide">
          {selectedDateItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-55">event_busy</span>
              <p className="text-xs font-semibold">No schedules set for this day.</p>
            </div>
          ) : (
            selectedDateItems.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => handleItemClick(item)}
                className={`flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-800/10 border border-white/20 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/30 transition-colors ${
                  item.type !== 'habit' && item.type !== 'bill' ? 'cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'task' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-600' :
                    item.type === 'reminder' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' :
                    item.type === 'habit' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' :
                    'bg-pink-50 dark:bg-pink-950/20 text-pink-600'
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {
                        item.type === 'task' ? 'task_alt' :
                        item.type === 'reminder' ? 'alarm' :
                        item.type === 'habit' ? 'autorenew' :
                        'payments'
                      }
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-bold text-xs ${item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                      {item.title}
                    </h4>
                    <div className="flex gap-2 items-center text-[10px] text-gray-400 mt-0.5 font-bold uppercase">
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">{item.type}</span>
                      <span>⏰ {item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.priority && (
                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.priority === 'high' ? 'bg-red-50 text-red-500' :
                      item.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {item.priority}
                    </span>
                  )}
                  {item.type !== 'habit' && item.type !== 'bill' && (
                    <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
