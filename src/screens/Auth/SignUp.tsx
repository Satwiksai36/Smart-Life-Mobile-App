import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const SignUp: React.FC = () => {
  const { navigate, resetTo } = useNavigateApp();
  const { signUp } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signUp(name, email, password);
      setIsLoading(false);
      resetTo('home');
    }, 800);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto p-5 bg-mesh">
      <main className="w-full max-w-[420px] mx-auto z-10 relative">
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl font-black text-[#3525cd] dark:text-[#c3c0ff] tracking-tight">
            SmartLife
          </h1>
          <p className="font-body-lg text-gray-500 mt-2">Begin Your Journey.</p>
        </div>

        <div className="glass-card rounded-[24px] p-6 md:p-8 ambient-shadow">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-4xl text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>
                how_to_reg
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block font-label-md text-xs text-gray-500 mb-1" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  person
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block font-label-md text-xs text-gray-500 mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block font-label-md text-xs text-gray-500 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block font-label-md text-xs text-gray-500 mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  lock_reset
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4f46e5] text-white rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-[#4f46e5]/90 transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="font-bold text-sm">Create Account</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200/40 dark:border-gray-800/40">
            <span className="text-xs text-gray-400 font-medium">Already have an account? </span>
            <button
              onClick={() => navigate('login')}
              className="text-xs text-[#3525cd] dark:text-[#c3c0ff] font-bold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
