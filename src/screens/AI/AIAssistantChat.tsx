import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActionPayload } from '../../context/AppContext';

export const AIAssistantChat: React.FC = () => {
  const { chatHistory, sendChatMessage, clearChatHistory, importAiAction } = useApp();

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [importedActions, setImportedActions] = useState<{ [label: string]: boolean }>({});
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setUserInput('');
    setIsTyping(true);
    
    await sendChatMessage(text.trim());
    setIsTyping(false);
  };

  const handleActionClick = (action: ActionPayload) => {
    importAiAction(action);
    setImportedActions(prev => ({
      ...prev,
      [action.label]: true
    }));
  };

  const quickPrompts = [
    "Generate study plan",
    "Suggest budget improvements",
    "Recommend new habits",
    "Summarize notes"
  ];

  return (
    <div className="flex-grow flex flex-col relative select-none">
      
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/20 sticky top-0 z-30 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#06b6d4] text-white flex items-center justify-center shadow-md animate-pulse">
            <span className="material-symbols-outlined font-bold text-xl">psychology</span>
          </div>
          <div>
            <h2 className="text-sm font-black">Aura AI Coach</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Cognitive Engine Active</span>
            </div>
          </div>
        </div>

        <button 
          onClick={clearChatHistory}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear Conversation"
        >
          <span className="material-symbols-outlined text-lg">delete_sweep</span>
        </button>
      </header>

      {/* Chat Messages Panel — internal scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide pb-4">
        {chatHistory.map((msg, idx) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}>
              
              {/* Avatar bubble */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                isAI ? 'bg-gradient-to-tr from-[#3525cd] to-[#06b6d4] text-white' : 'bg-gray-300 text-gray-600 dark:bg-slate-800 dark:text-gray-300'
              }`}>
                <span className="material-symbols-outlined text-sm font-bold">
                  {isAI ? 'bolt' : 'person'}
                </span>
              </div>

              {/* Message text card */}
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                  isAI 
                    ? 'glass-card text-gray-700 dark:text-gray-200 border-white/30 rounded-tl-none ai-bubble-glow' 
                    : 'bg-indigo-600 border-indigo-600 text-white rounded-tr-none shadow-sm shadow-indigo-600/10'
                }`}>
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  <span className="block text-[8px] text-gray-400 mt-2 text-right font-bold">{msg.timestamp}</span>
                </div>

                {/* Interactive Dynamic Actionable Cards */}
                {isAI && msg.actions && (
                  <div className="space-y-2 pl-2 border-l-2 border-cyan-400/50">
                    {msg.actions.map((act, aIdx) => {
                      const alreadyImported = !!importedActions[act.label];
                      return (
                        <button
                          key={aIdx}
                          disabled={alreadyImported}
                          onClick={() => handleActionClick(act)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-[10px] font-bold text-left transition-all ${
                            alreadyImported
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-white/40 dark:bg-slate-800/40 border-white/20 text-[#3525cd] dark:text-[#c3c0ff] hover:bg-white/70 hover:scale-[1.01]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="material-symbols-outlined text-sm">
                              {act.type === 'task' ? 'playlist_add_check' : act.type === 'habit' ? 'autorenew' : 'settings_suggest'}
                            </span>
                            <span className="truncate">{act.label}</span>
                          </div>
                          <span>{alreadyImported ? 'Imported ✓' : 'Import'}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#06b6d4] text-white flex items-center justify-center animate-bounce shadow-sm">
              <span className="material-symbols-outlined text-sm font-bold">bolt</span>
            </div>
            <div className="glass-card p-3 rounded-2xl rounded-tl-none flex items-center gap-1 border border-white/30">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input panel & suggested prompts sticky bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent px-container-margin md:px-lg pb-4 space-y-sm select-none">
        
        {/* Suggestion tags */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {quickPrompts.map(pr => (
            <button
              key={pr}
              onClick={() => handleSend(pr)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/50 dark:bg-slate-800/40 text-gray-500 border border-white/10 hover:border-indigo-600/30 whitespace-nowrap"
            >
              ✨ {pr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(userInput); }}
          className="flex gap-2 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-white/20 shadow-sm"
        >
          <input 
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Query budget improvements or study schedules..."
            className="flex-grow bg-transparent border-none text-xs outline-none focus:ring-0 px-2 text-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md select-none active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-base font-bold">arrow_upward</span>
          </button>
        </form>
      </div>

    </div>
  );
};
