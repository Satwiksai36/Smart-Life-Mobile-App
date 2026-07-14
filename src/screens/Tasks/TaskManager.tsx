import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp, Task } from '../../context/AppContext';

export const TaskManager: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { tasks, updateTask, toggleTaskCompletion, deleteTask } = useApp();
  
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on settings
  const filteredTasks = tasks.filter(t => {
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  // Group tasks by status for Kanban Board
  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25' },
    { id: 'review', title: 'Review', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25' },
    { id: 'completed', title: 'Completed', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' }
  ];

  const moveTask = (taskId: string, direction: 'left' | 'right') => {
    const statuses: Task['status'][] = ['todo', 'in_progress', 'review', 'completed'];
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) return;
    
    const currentIndex = statuses.indexOf(currentTask.status);
    let newIndex = currentIndex;
    
    if (direction === 'left' && currentIndex > 0) newIndex--;
    if (direction === 'right' && currentIndex < statuses.length - 1) newIndex++;
    
    if (newIndex !== currentIndex) {
      updateTask(taskId, { status: statuses[newIndex] });
    }
  };

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* 1. Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-2xl font-black text-primary dark:text-primary-fixed-dim">Task Manager</h2>
          <p className="text-xs text-gray-500">Plan milestones, track velocity & group lists</p>
        </div>
        <button 
          onClick={() => navigate('create_task')}
          className="flex items-center gap-1 bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <span className="material-symbols-outlined text-lg font-bold">add</span> Create Task
        </button>
      </div>

      {/* 2. Filter & View Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white/40 dark:bg-slate-900/30 p-3 rounded-2xl border border-white/20">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs outline-none"
          />
        </div>

        <div className="flex gap-2 items-center justify-between">
          {/* Priority filter selector */}
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gray-400 text-base">filter_alt</span>
            <select
              value={priorityFilter}
              onChange={(e: any) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 border-none focus:ring-0 cursor-pointer"
            >
              <option value="all" className="dark:bg-slate-800">All Priorities</option>
              <option value="high" className="dark:bg-slate-800 text-red-500">High</option>
              <option value="medium" className="dark:bg-slate-800 text-amber-500">Medium</option>
              <option value="low" className="dark:bg-slate-800 text-blue-500">Low</option>
            </select>
          </div>

          {/* Toggle View Mode */}
          <div className="bg-gray-200/50 dark:bg-slate-800/60 p-0.5 rounded-xl flex">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg flex items-center justify-center ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-[#c3c0ff]' : 'text-gray-400'}`}
              title="Kanban Board View"
            >
              <span className="material-symbols-outlined text-sm font-bold">dashboard</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg flex items-center justify-center ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-[#c3c0ff]' : 'text-gray-400'}`}
              title="List View"
            >
              <span className="material-symbols-outlined text-sm font-bold">format_list_bulleted</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Rendering Kanban vs List */}
      {viewMode === 'kanban' ? (
        <div className="flex flex-row gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x w-full">
          {columns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="w-[285px] shrink-0 snap-center bg-white/20 dark:bg-slate-900/10 rounded-3xl p-4 border border-white/10 flex flex-col min-h-[450px]">
                <div className={`flex justify-between items-center p-3 rounded-2xl border ${col.color} mb-4`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider">{col.title}</h4>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/40 dark:bg-slate-800/40">{columnTasks.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                  {columnTasks.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center text-gray-400">
                      <span className="material-symbols-outlined text-3xl opacity-50 mb-1">drag_indicator</span>
                      <p className="text-[10px] font-semibold">Drop items here</p>
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <div 
                        key={task.id}
                        className="glass-card rounded-[20px] p-3.5 flex flex-col justify-between hover:scale-[1.01] hover:shadow-md cursor-pointer border border-white/20"
                      >
                        <div onClick={() => navigate('task_details', { id: task.id })}>
                          <div className="flex justify-between items-start gap-1">
                            <h5 className="font-bold text-xs text-gray-700 dark:text-gray-200 line-clamp-2 leading-relaxed">{task.title}</h5>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              task.priority === 'high' ? 'bg-red-500' :
                              task.priority === 'medium' ? 'bg-amber-500' :
                              'bg-blue-500'
                            }`} />
                          </div>
                          {task.notes && (
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-snug">{task.notes}</p>
                          )}
                        </div>

                        {/* Progress Indicators */}
                        {task.subtasks.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#3525cd] h-full"
                                style={{ 
                                  width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 flex-shrink-0">
                              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100/50 dark:border-slate-800/30">
                          <span className="text-[9px] text-gray-400 font-bold">📅 {task.dueDate}</span>
                          
                          {/* Board Movement Simulation */}
                          <div className="flex gap-1">
                            {col.id !== 'todo' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'left'); }}
                                className="p-1 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500"
                                title="Move Back"
                              >
                                <span className="material-symbols-outlined text-[10px] font-bold">arrow_back</span>
                              </button>
                            )}
                            {col.id !== 'completed' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'right'); }}
                                className="p-1 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500"
                                title="Move Forward"
                              >
                                <span className="material-symbols-outlined text-[10px] font-bold">arrow_forward</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Layout View */
        <div className="glass-card rounded-[24px] p-6 space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <span className="material-symbols-outlined text-5xl mb-2">assignment_turned_in</span>
              <h4 className="font-bold text-sm">No tasks match criteria</h4>
              <p className="text-xs">Adjust your priorities filters or create a new task.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-800/20 border border-white/20 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                onClick={() => navigate('task_details', { id: task.id })}
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      task.status === 'completed' ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300'
                    }`}
                  >
                    {task.status === 'completed' && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                  </button>
                  <div>
                    <h4 className={`font-bold text-sm ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</h4>
                    <div className="flex gap-3 items-center text-[10px] text-gray-400 mt-0.5">
                      <span>📅 {task.dueDate}</span>
                      <span>⏰ {task.dueTime}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.priority === 'high' ? 'bg-red-50 text-red-500 dark:bg-red-950/20' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/20' :
                        'bg-blue-50 text-blue-500 dark:bg-blue-950/20'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {task.subtasks.length > 0 && (
                    <span className="text-[10px] text-gray-400 font-bold">
                      📋 {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                    </span>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors"
                    title="Delete Task"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
