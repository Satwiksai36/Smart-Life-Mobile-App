import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const NotesDashboard: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { notes, updateNote, deleteNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const note = notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { pinned: !note.pinned });
    }
  };

  const renderNoteCard = (note: any) => {
    return (
      <div 
        key={note.id}
        onClick={() => navigate('note_editor', { id: note.id })}
        className={`p-4 rounded-2xl border cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow ${note.color}`}
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-xs line-clamp-1">{note.title || 'Untitled note'}</h4>
            <button 
              onClick={(e) => togglePin(note.id, e)}
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: note.pinned ? "'FILL' 1" : "'FILL' 0" }}>
                push_pin
              </span>
            </button>
          </div>
          <p className="text-[10px] leading-relaxed line-clamp-4 whitespace-pre-wrap">{note.content}</p>
        </div>

        {/* Note Footer: date / attachments */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-black/5 dark:border-white/5 text-[8px] text-gray-400 font-bold uppercase">
          <span>📅 {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          <div className="flex gap-1.5">
            {note.voiceNotes?.length > 0 && (
              <span className="material-symbols-outlined text-xs">mic</span>
            )}
            {note.images?.length > 0 && (
              <span className="material-symbols-outlined text-xs">image</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-container-margin md:px-lg py-md space-y-md pb-24 md:pb-6 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-2xl font-black text-primary">Workspace Notes</h2>
          <p className="text-xs text-gray-500">Capture design thoughts, outlines, journals & voice records</p>
        </div>
        <button 
          onClick={() => navigate('note_editor')}
          className="flex items-center gap-1 bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <span className="material-symbols-outlined text-lg font-bold">add</span> Write Note
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes content..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs outline-none"
        />
      </div>

      {/* Dynamic Pinned Grid */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
            Pinned Notes
          </h3>
          <div className="grid grid-cols-2 gap-sm">
            {pinnedNotes.map(note => renderNoteCard(note))}
          </div>
        </div>
      )}

      {/* Dynamic Unpinned Grid */}
      <div className="space-y-sm">
        {pinnedNotes.length > 0 && (
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Notes</h3>
        )}
        
        {filteredNotes.length === 0 ? (
          <div className="glass-card rounded-[24px] p-12 text-center text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-2">sticky_note_2</span>
            <h4 className="font-bold text-sm">No notes available</h4>
            <p className="text-xs mt-1">Tap "Write Note" to capture your first outline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-sm">
            {unpinnedNotes.map(note => renderNoteCard(note))}
          </div>
        )}
      </div>

    </div>
  );
};
