import React, { useEffect, useState } from 'react';
import { useNavigateApp } from '../context/NavigationContext';
import { useApp } from '../context/AppContext';

export const Splash: React.FC = () => {
  const { navigate, resetTo } = useNavigateApp();
  const { isLoggedIn } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        if (isLoggedIn) {
          resetTo('home');
        } else {
          resetTo('onboarding');
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, isLoggedIn, resetTo]);

  return (
    <div className="bg-mesh min-h-screen text-[#0b1c30] dark:text-[#f8f9ff] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDT08GaMfNOVtAO_v3EN9UoobVgmgQoTq8s2IbxJb15jABLQHyp-lvLjasaYniSRG1VqLvQHgPfS-Dx9AwLwcwhnve59n1IY14onuhp7JD6MdT_u6fJvw0Mm_pd13c7iWggGeXiu3KA_dhIu8Vf1TP-cdA0u69pgBhZJt0glIBl0HmBBsHwKzxgOTf7wWjfLWE-n0FsPsNNVGxmiJKNeqrv4dWKcvPw65Lmpm4e88k_yS37n7kxtVRQg')" }}
        />
      </div>

      <main className="w-full max-w-[400px] flex flex-col items-center z-10 glass-card rounded-[32px] p-8 text-center py-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#06b6d4] flex items-center justify-center shadow-lg mb-8 animate-bounce">
          <span className="material-symbols-outlined text-5xl text-white font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
        </div>

        <h1 className="font-display-lg text-4xl font-black text-[#3525cd] dark:text-[#c3c0ff] tracking-tight mb-2">
          SmartLife
        </h1>
        <p className="font-body-lg text-gray-600 dark:text-gray-300 max-w-xs mx-auto mb-12">
          Your all-in-one productivity ecosystem powered by AI.
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 h-2 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-[#3525cd] to-[#06b6d4] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Loading intelligence... {progress}%
        </p>
      </main>
    </div>
  );
};
