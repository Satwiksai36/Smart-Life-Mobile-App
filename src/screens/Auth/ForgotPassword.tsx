import React, { useState } from 'react';
import { useNavigateApp } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const ForgotPassword: React.FC = () => {
  const { navigate } = useNavigateApp();
  const { addNotification } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please fill in your email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      addNotification("Password Reset Sent", `Recovery instructions sent to ${email}`, 'system');
    }, 800);
  };

  return (
    <div className="bg-mesh min-h-screen flex items-center justify-center p-6 text-[#0b1c30] dark:text-[#f8f9ff]">
      <main className="w-full max-w-[420px] mx-auto z-10 relative">
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl font-black text-[#3525cd] dark:text-[#c3c0ff] tracking-tight">
            SmartLife
          </h1>
          <p className="font-body-lg text-gray-500 mt-2">Reset Password.</p>
        </div>

        <div className="glass-card rounded-[24px] p-6 md:p-8 ambient-shadow">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-surface-container-high dark:bg-slate-800 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-4xl text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_open
              </span>
            </div>
          </div>

          {success ? (
            <div className="text-center space-y-4 fade-in">
              <div className="text-emerald-500 font-bold text-lg">Check Your Email ✉️</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We've sent a recovery link to <span className="font-bold">{email}</span>. Click the link in the email to reset your password.
              </p>
              <button
                onClick={() => navigate('login')}
                className="w-full bg-[#4f46e5] text-white rounded-xl py-3.5 font-bold hover:bg-[#4f46e5]/90 transition-all shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)]"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                Enter your email address below and we'll send you a link to reset your account credentials.
              </p>

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
                    <span className="font-bold text-sm">Send Reset Link</span>
                    <span className="material-symbols-outlined text-lg">send</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-xs text-[#3525cd] dark:text-[#c3c0ff] font-bold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
