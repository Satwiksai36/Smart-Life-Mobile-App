import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const TaskDetails: React.FC = () => {
  const { currentRoute, goBack } = useNavigateApp();
  const { tasks, updateTask, toggleSubtaskCompletion, deleteTask, addNotification } = useApp();
  
  const taskId = currentRoute.params?.id;
  const task = tasks.find(t => t.id === taskId);
  
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  if (!task) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-500">Task Not Found</h2>
        <p className="text-sm text-gray-500">The task you are looking for does not exist or has been deleted.</p>
        <button onClick={goBack} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">Go Back</button>
      </div>
    );
  }

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleDownload = (fileName: string) => {
    setDownloadingFile(fileName);
    setTimeout(() => {
      setDownloadingFile(null);
      addNotification("Download Complete", `"${fileName}" saved to device downloads.`, 'task');
    }, 1500);
  };

  const handleStatusChange = (newStatus: any) => {
    updateTask(task.id, { status: newStatus });
  };

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header with Back button & Delete */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl font-black text-primary">Task Details</h2>
            <p className="text-[10px] text-gray-400">Review checklists and documents</p>
          </div>
        </div>

        <button 
          onClick={() => { deleteTask(task.id); goBack(); }}
          className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl flex items-center justify-center transition-all"
          title="Delete Task"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>

      {/* Main Details Card */}
      <div className="glass-card rounded-[24px] p-6 space-y-6">
        
        {/* Title & Priority Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-headline-md text-2xl font-black text-gray-800 dark:text-white leading-tight">
              {task.title}
            </h3>
            
            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
              task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
              task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
              'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
            }`}>
              {task.priority} Priority
            </span>
          </div>

          <p className="text-xs text-gray-400">Created: {new Date(task.createdAt).toLocaleString()}</p>
        </div>

        {/* Due Date & Stage Details Box */}
        <div className="grid grid-cols-2 gap-sm p-4 bg-white/30 dark:bg-slate-800/10 border border-white/10 rounded-2xl">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Due Date</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-200">
              <span className="material-symbols-outlined text-base text-[#3525cd]">calendar_month</span>
              {task.dueDate} at {task.dueTime}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Stage</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent border-none p-0 text-xs font-black text-[#06b6d4] focus:ring-0 cursor-pointer"
            >
              <option value="todo" className="dark:bg-slate-800 text-gray-700 dark:text-gray-300">To Do</option>
              <option value="in_progress" className="dark:bg-slate-800 text-gray-700 dark:text-gray-300">In Progress</option>
              <option value="review" className="dark:bg-slate-800 text-gray-700 dark:text-gray-300">Review</option>
              <option value="completed" className="dark:bg-slate-800 text-gray-700 dark:text-gray-300">Completed</option>
            </select>
          </div>
        </div>

        {/* Notes Section */}
        {task.notes && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes / Descriptions</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 bg-white/20 dark:bg-slate-800/10 p-3 rounded-xl border border-white/10 leading-relaxed whitespace-pre-wrap">
              {task.notes}
            </p>
          </div>
        )}

        {/* Dynamic Subtask List Progress */}
        {totalSubtasks > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-100/50 dark:border-slate-800/30">
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-bold text-gray-500 uppercase tracking-wider">Subtask Checklist</h4>
              <span className="font-bold text-gray-500">{completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)</span>
            </div>

            {/* Progress line */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#3525cd] h-full transition-all duration-300"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide pt-2">
              {task.subtasks.map(sub => (
                <div 
                  key={sub.id} 
                  onClick={() => toggleSubtaskCompletion(task.id, sub.id)}
                  className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/20 rounded-xl border border-white/10 cursor-pointer hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <button 
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      sub.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'
                    }`}
                  >
                    {sub.completed && <span className="material-symbols-outlined text-[10px] font-bold">check</span>}
                  </button>
                  <span className={`text-xs font-semibold ${sub.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Attachments List */}
        {task.attachments.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-100/50 dark:border-slate-800/30">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Attachments</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
              {task.attachments.map(att => (
                <div 
                  key={att.name}
                  className="flex justify-between items-center p-3 bg-white/40 dark:bg-slate-800/20 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <span className="material-symbols-outlined text-gray-400 text-lg">description</span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{att.name}</p>
                      <p className="text-[9px] text-gray-400">{att.size}</p>
                    </div>
                  </div>

                  <button
                    disabled={downloadingFile !== null}
                    onClick={() => handleDownload(att.name)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {downloadingFile === att.name ? (
                      <div className="w-4 h-4 border-2 border-[#3525cd] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-base">download</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
