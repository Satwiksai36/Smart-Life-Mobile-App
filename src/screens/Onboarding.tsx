import React, { useState } from 'react';
import { useNavigateApp } from '../context/NavigationContext';

export const Onboarding: React.FC = () => {
  const { navigate } = useNavigateApp();
  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    if (slide < 2) {
      setSlide(slide + 1);
    } else {
      navigate('login');
    }
  };

  const prevSlide = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  return (
    <div className="bg-mesh min-h-screen text-[#0b1c30] dark:text-[#f8f9ff] flex flex-col items-center justify-center p-container-margin md:p-xl relative overflow-x-hidden">
      {/* Background Graphic (Faded Abstract Illustration) */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDT08GaMfNOVtAO_v3EN9UoobVgmgQoTq8s2IbxJb15jABLQHyp-lvLjasaYniSRG1VqLvQHgPfS-Dx9AwLwcwhnve59n1IY14onuhp7JD6MdT_u6fJvw0Mm_pd13c7iWggGeXiu3KA_dhIu8Vf1TP-cdA0u69pgBhZJt0glIBl0HmBBsHwKzxgOTf7wWjfLWE-n0FsPsNNVGxmiJKNeqrv4dWKcvPw65Lmpm4e88k_yS37n7kxtVRQg')" }}
        />
      </div>

      <div className="w-full max-w-[420px] mx-auto z-10 relative">
        {/* Top Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={prevSlide}
            className={`flex items-center gap-1 font-semibold text-[#3525cd] hover:opacity-80 transition-opacity ${slide === 0 ? 'invisible' : 'visible'}`}
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span> Back
          </button>
          
          <button 
            onClick={() => navigate('login')}
            className="font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-[32px] p-5 flex flex-col relative z-20 min-h-[460px] max-h-[560px] justify-between transition-all duration-300">
          
          {/* SLIDE 0: Welcome to SmartLife */}
          {slide === 0 && (
            <div className="flex-1 flex flex-col justify-center text-center fade-in">
              <div className="w-20 h-20 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="material-symbols-outlined text-4xl text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  home_app_logo
                </span>
              </div>
              <h2 className="font-headline-lg-mobile text-3xl font-black text-[#3525cd] dark:text-[#c3c0ff] tracking-tight mb-4">
                Welcome to SmartLife
              </h2>
              <p className="font-body-lg text-gray-600 dark:text-gray-300 max-w-[280px] mx-auto leading-relaxed">
                Your all-in-one productivity ecosystem powered by AI. Seamlessly organize habits, calendar, and financials.
              </p>
            </div>
          )}

          {/* SLIDE 1: Organize Everything */}
          {slide === 1 && (
            <div className="flex-1 flex flex-col justify-center fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    task_alt
                  </span>
                </div>
                <h2 className="font-headline-lg-mobile text-2xl font-black text-[#3525cd] dark:text-[#c3c0ff] tracking-tight">
                  Organize Everything
                </h2>
                <p className="font-body-md text-gray-500 mt-1">Four core modules built to streamline your days.</p>
              </div>

              {/* Module Cards list */}
              <div className="space-y-2.5 overflow-y-auto max-h-[220px] scrollbar-hide pr-1">
                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-white/20">
                  <span className="material-symbols-outlined text-2xl text-[#3525cd] p-1 bg-[#e2dfff] dark:bg-indigo-950/50 rounded-lg">alarm</span>
                  <div>
                    <h4 className="font-bold text-sm">Smart Reminders</h4>
                    <p className="text-xs text-gray-500">Location, categories, voice entries & calendar Sync.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-white/20">
                  <span className="material-symbols-outlined text-2xl text-teal-600 p-1 bg-teal-50 dark:bg-teal-950/30 rounded-lg font-bold">assignment</span>
                  <div>
                    <h4 className="font-bold text-sm">Task Manager</h4>
                    <p className="text-xs text-gray-500">Kanban layouts, checklists, attachments & subtasks.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-white/20">
                  <span className="material-symbols-outlined text-2xl text-emerald-600 p-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg font-bold">qr_code_scanner</span>
                  <div>
                    <h4 className="font-bold text-sm">OCR Expense Tracking</h4>
                    <p className="text-xs text-gray-500">Scan receipts instantly, log budgets & parse tax data.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-white/20">
                  <span className="material-symbols-outlined text-2xl text-purple-600 p-1 bg-purple-50 dark:bg-purple-950/30 rounded-lg font-bold">autorenew</span>
                  <div>
                    <h4 className="font-bold text-sm">Habit Loop Dashboard</h4>
                    <p className="text-xs text-gray-500">Heatmaps calendar grids, streaks, milestones & records.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Meet Aura - AI Assistant */}
          {slide === 2 && (
            <div className="flex-1 flex flex-col justify-center fade-in">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#06b6d4] flex items-center justify-center mx-auto mb-3 shadow-md animate-pulse">
                  <span className="material-symbols-outlined text-3xl text-white font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    psychology
                  </span>
                </div>
                <h2 className="font-headline-lg-mobile text-2xl font-black text-[#3525cd] dark:text-[#c3c0ff] tracking-tight">
                  Meet Aura AI
                </h2>
                <p className="font-body-md text-gray-500 mt-1">Your cognitive co-pilot and scheduler.</p>
              </div>

              {/* Chat Demo bubbles */}
              <div className="space-y-3 bg-white/30 dark:bg-slate-900/30 p-3 rounded-2xl border border-white/10 mb-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-gray-600">face</span>
                  </div>
                  <div className="bg-white/70 dark:bg-slate-800/80 text-xs p-2 rounded-2xl rounded-tl-none border border-white/20">
                    Aura, create tomorrow's study schedule.
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <div className="bg-indigo-600 text-white text-xs p-2.5 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                    ✨ Study schedule ready! Double-tap to ingest into your primary calendar or task board.
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#3525cd] flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-white font-bold">bolt</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 font-medium px-4 mt-2">
                Autopilot plans, summarize journals, structure routines and query budgets through chats.
              </div>
            </div>
          )}

          {/* Stepper Dots & CTA Button */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-center gap-2">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${slide === 0 ? 'w-8 bg-[#3525cd]' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${slide === 1 ? 'w-8 bg-[#3525cd]' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${slide === 2 ? 'w-8 bg-[#3525cd]' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />
            </div>

            <button 
              onClick={nextSlide}
              className="w-full bg-[#4f46e5] text-white rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-[#4f46e5]/90 transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="font-bold text-lg">
                {slide === 2 ? 'Get Started' : 'Next'}
              </span>
              {slide < 2 && (
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
