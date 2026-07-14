import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const NoteEditor: React.FC = () => {
  const { currentRoute, goBack } = useNavigateApp();
  const { notes, addNote, updateNote, deleteNote, addNotification } = useApp();

  const noteId = currentRoute.params?.id;
  const isEditing = !!noteId;
  const existingNote = notes.find(n => n.id === noteId);

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [pinned, setPinned] = useState(existingNote?.pinned || false);
  const [color, setColor] = useState(existingNote?.color || 'bg-amber-50/70 dark:bg-slate-800/40 border-amber-100 dark:border-slate-700/30 text-amber-900 dark:text-amber-100');
  
  // Voice & Image Attachments State
  const [voiceNotes, setVoiceNotes] = useState<string[]>(existingNote?.voiceNotes || []);
  const [images, setImages] = useState<string[]>(existingNote?.images || []);
  const [isRecording, setIsRecording] = useState(false);

  // Preset Colors Palette
  const colorPresets = [
    { 
      name: 'Yellow', 
      classes: 'bg-amber-50/70 dark:bg-slate-800/40 border-amber-100 dark:border-slate-700/30 text-amber-900 dark:text-amber-100',
      dotColor: 'bg-amber-400' 
    },
    { 
      name: 'Green', 
      classes: 'bg-emerald-50/70 dark:bg-slate-800/40 border-emerald-100 dark:border-slate-700/30 text-emerald-900 dark:text-emerald-100',
      dotColor: 'bg-emerald-400' 
    },
    { 
      name: 'Blue', 
      classes: 'bg-blue-50/70 dark:bg-slate-800/40 border-blue-100 dark:border-slate-700/30 text-blue-900 dark:text-blue-100',
      dotColor: 'bg-blue-400' 
    },
    { 
      name: 'Purple', 
      classes: 'bg-indigo-50/70 dark:bg-slate-800/40 border-indigo-100 dark:border-slate-700/30 text-indigo-900 dark:text-indigo-100',
      dotColor: 'bg-indigo-400' 
    }
  ];

  const handleRecordVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const name = `voice_memo_${Math.floor(Math.random() * 1000)}.wav`;
      setVoiceNotes([...voiceNotes, name]);
      addNotification("Voice Note Recorded", `Saved audio memo "${name}" to notes attachments.`, 'system');
    }, 2500); // simulate 2.5s recording
  };

  const handleUploadImage = () => {
    const name = `image_snapshot_${Math.floor(Math.random() * 1000)}.jpg`;
    setImages([...images, name]);
    addNotification("Image Attached", `Linked photo "${name}" to notes draft.`, 'system');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (isEditing && noteId) {
      updateNote(noteId, {
        title: title.trim(),
        content: content.trim(),
        pinned,
        color,
        voiceNotes,
        images
      });
    } else {
      addNote({
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        pinned,
        color,
        voiceNotes,
        images
      });
    }
    goBack();
  };

  const handleDelete = () => {
    if (isEditing && noteId) {
      deleteNote(noteId);
      goBack();
    }
  };

  return (
    <div className="flex-grow flex flex-col px-4 py-4 space-y-4 pb-24 select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-headline-md text-xl font-black text-primary">Note Editor</h2>
            <p className="text-[10px] text-gray-400">Capture design schemas</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setPinned(!pinned)}
            className={`p-2.5 rounded-xl border transition-all ${
              pinned 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white/40 dark:bg-slate-800/40 text-gray-400 border-white/20'
            }`}
            title={pinned ? 'Pinned note' : 'Pin note'}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: pinned ? "'FILL' 1" : "'FILL' 0" }}>
              push_pin
            </span>
          </button>

          {isEditing && (
            <button 
              onClick={handleDelete}
              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl"
              title="Delete Note"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Main body */}
      <form onSubmit={handleSubmit} className={`glass-card rounded-[24px] p-6 flex-1 flex flex-col justify-between space-y-4 border ${color}`}>
        
        <div className="space-y-3 flex-1 flex flex-col">
          {/* Title Input */}
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            className="w-full bg-transparent border-none text-lg font-black outline-none placeholder-gray-400 focus:ring-0 px-0"
          />

          {/* Note content textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type notes content here (supports plain markdown outlines)..."
            className="w-full bg-transparent border-none text-xs outline-none resize-none focus:ring-0 flex-1 px-0 leading-relaxed"
          />
        </div>

        {/* Dynamic Color Presets Picker */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Canvas Card Tone</span>
          <div className="flex gap-2">
            {colorPresets.map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setColor(preset.classes)}
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${preset.dotColor} ${
                  color === preset.classes ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Audio and Image lists */}
        {(voiceNotes.length > 0 || images.length > 0) && (
          <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Linked Media</span>
            <div className="grid grid-cols-2 gap-sm">
              {voiceNotes.map(vn => (
                <div key={vn} className="flex items-center gap-1.5 p-2 bg-black/5 dark:bg-white/5 rounded-xl text-[10px] font-bold">
                  <span className="material-symbols-outlined text-sm">mic</span>
                  <span className="truncate flex-1">{vn}</span>
                </div>
              ))}
              {images.map(img => (
                <div key={img} className="flex items-center gap-1.5 p-2 bg-black/5 dark:bg-white/5 rounded-xl text-[10px] font-bold">
                  <span className="material-symbols-outlined text-sm">image</span>
                  <span className="truncate flex-1">{img}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Attachments actions bar */}
        <div className="flex justify-between items-center pt-3 border-t border-black/5 dark:border-white/5">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isRecording}
              onClick={handleRecordVoice}
              className={`p-2 rounded-xl flex items-center justify-center border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold gap-1 ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : ''
              }`}
            >
              <span className="material-symbols-outlined text-base">mic</span>
              {isRecording ? 'Recording...' : 'Record Voice'}
            </button>
            <button
              type="button"
              onClick={handleUploadImage}
              className="p-2 rounded-xl flex items-center justify-center border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold gap-1"
            >
              <span className="material-symbols-outlined text-base">image</span>
              Attach Photo
            </button>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
          >
            Save Note
          </button>
        </div>

      </form>

    </div>
  );
};
