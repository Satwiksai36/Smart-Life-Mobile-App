import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const Login: React.FC = () => {
  const { navigate, resetTo } = useNavigateApp();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (success) {
        resetTo('home');
      } else {
        setError('Invalid credentials.');
      }
    }, 800);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center overflow-y-auto p-5 bg-mesh">
      <main className="w-full max-w-[380px] mx-auto z-10 relative">
        {/* Logo Header */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-black text-indigo-700 dark:text-indigo-300 tracking-tight">
            SmartLife
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Intelligent Living, Simplified.</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-[24px] p-5 ambient-shadow">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-4xl text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>
                face
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

            {/* Email Address */}
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

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-label-md text-xs text-gray-500" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('forgot_password')}
                  className="text-xs text-[#3525cd] dark:text-[#c3c0ff] font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg hover:text-gray-600 transition-colors"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </button>
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
                  <span className="font-bold text-sm">Sign In</span>
                  <span className="material-symbols-outlined text-lg">login</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200/40 dark:border-gray-800/40">
            <span className="text-xs text-gray-400 font-medium">New to SmartLife? </span>
            <button
              onClick={() => navigate('signup')}
              className="text-xs text-[#3525cd] dark:text-[#c3c0ff] font-bold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
