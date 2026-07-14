import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp, SubTask, Attachment } from '../../context/AppContext';

export const CreateTask: React.FC = () => {
  const { goBack } = useNavigateApp();
  const { addTask } = useApp();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('2026-07-15');
  const [dueTime, setDueTime] = useState('12:00');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'review' | 'completed'>('todo');
  
  // Subtasks dynamic list state
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Attachments dynamic state
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [mockFileName, setMockFileName] = useState('');

  const addLocalSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSt: SubTask = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newSt]);
    setNewSubtaskTitle('');
  };

  const removeLocalSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const addLocalAttachment = () => {
    if (!mockFileName.trim()) return;
    const newAtt: Attachment = {
      name: mockFileName.trim(),
      size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`
    };
    setAttachments([...attachments, newAtt]);
    setMockFileName('');
  };

  const removeLocalAttachment = (name: string) => {
    setAttachments(attachments.filter(a => a.name !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      notes: notes.trim(),
      dueDate,
      dueTime,
      priority,
      status,
      subtasks,
      attachments
    });
    
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
          <h2 className="font-headline-md text-xl font-black text-primary">Create New Task</h2>
          <p className="text-[10px] text-gray-400">Map details, lists and check-items</p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-[24px] p-6 space-y-5">
        
        {/* Title input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="title">Task Title</label>
          <input 
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design Glassmorphism Components"
            className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none"
          />
        </div>

        {/* Notes input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="notes">Notes / Descriptions</label>
          <textarea 
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Export layout specifications from luminous intelligence..."
            className="w-full px-4 py-3 rounded-xl glass-input text-sm outline-none resize-none"
          />
        </div>

        {/* Date and Time selectors */}
        <div className="grid grid-cols-2 gap-sm">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="date">Due Date</label>
            <input 
              id="date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="time">Due Time</label>
            <input 
              id="time"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none"
            />
          </div>
        </div>

        {/* Priority & Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Priority Toggles */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Priority Level</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as any)}
                  className={`flex-1 py-2 text-xs font-bold capitalize rounded-xl border transition-all ${
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

          {/* Status Select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1" htmlFor="status">Task Stage</label>
            <select
              id="status"
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs outline-none font-bold"
            >
              <option value="todo" className="dark:bg-slate-800">To Do</option>
              <option value="in_progress" className="dark:bg-slate-800">In Progress</option>
              <option value="review" className="dark:bg-slate-800">Review</option>
              <option value="completed" className="dark:bg-slate-800">Completed</option>
            </select>
          </div>
        </div>

        {/* Dynamic Subtasks Builder */}
        <div className="border-t border-gray-100/50 dark:border-slate-800/30 pt-4 space-y-3">
          <label className="block text-xs font-bold text-gray-500">Subtask Checklist</label>
          
          <div className="flex gap-2">
            <input 
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add check-item title..."
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs outline-none"
            />
            <button
              type="button"
              onClick={addLocalSubtask}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>

          {/* Subtask list */}
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
            {subtasks.map(st => (
              <div key={st.id} className="flex justify-between items-center p-2.5 bg-white/30 dark:bg-slate-800/20 border border-white/10 rounded-xl">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{st.title}</span>
                <button
                  type="button"
                  onClick={() => removeLocalSubtask(st.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm font-bold">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Attachments Simulation */}
        <div className="border-t border-gray-100/50 dark:border-slate-800/30 pt-4 space-y-3">
          <label className="block text-xs font-bold text-gray-500">Document Attachments</label>
          
          <div className="flex gap-2">
            <input 
              type="text"
              value={mockFileName}
              onChange={(e) => setMockFileName(e.target.value)}
              placeholder="e.g. wireframe_mockups.png"
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs outline-none"
            />
            <button
              type="button"
              onClick={addLocalAttachment}
              className="p-2.5 bg-[#06b6d4] text-white rounded-xl hover:bg-[#06b6d4]/90 transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">attach_file</span>
            </button>
          </div>

          {/* Attachment list */}
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
            {attachments.map(att => (
              <div key={att.name} className="flex justify-between items-center p-2.5 bg-white/30 dark:bg-slate-800/20 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-gray-400">description</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{att.name}</span>
                  <span className="text-[10px] text-gray-400">({att.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeLocalAttachment(att.name)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm font-bold">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
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
            Save Task
          </button>
        </div>

      </form>
    </div>
  );
};
