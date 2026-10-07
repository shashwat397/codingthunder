import React, { useState, useEffect } from 'react';
import { Zap, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

interface LoginViewProps {
  onNavigate: (path: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { user, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showChooser, setShowChooser] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Parse redirectUrl from query parameters (defaults to '/')
  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('redirectUrl') || '/';
    }
    return '/';
  };

  useEffect(() => {
    if (user) {
      onNavigate(getRedirectUrl());
    }
  }, [user]);

  const handleSelectAccount = async (account: { email: string; name: string; avatar?: string }) => {
    setIsLoading(true);
    try {
      await loginWithGoogle(account);
      setShowChooser(false);
      onNavigate(getRedirectUrl());
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    handleSelectAccount({
      email: customEmail.trim(),
      name: customName.trim() || customEmail.split('@')[0],
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Back button */}
      <button
        onClick={() => onNavigate('/')}
        className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Codingthunder</span>
      </button>

      {/* Main Login Card matching CodeWithHarry style */}
      <div className="w-full max-w-md rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 md:p-10 shadow-2xl text-slate-100 text-center relative overflow-hidden">
        {/* Top subtle decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500" />

        {/* Logo & Brand Header */}
        <div className="flex flex-col items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-mono">
            Coding<span className="text-amber-400">thunder</span>
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome to Codingthunder
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Login to your account
        </p>
        <p className="text-xs text-slate-500 mt-2 mb-8">
          Choose your preferred social account for instant access
        </p>

        {/* SINGLE BUTTON FOR GOOGLE ACCOUNT SIGN IN */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowChooser(true)}
            disabled={isLoading}
            className="w-full h-13 px-4 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 active:scale-[0.99] transition-all text-sm font-medium text-slate-200 hover:text-white flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-semibold text-slate-300">Connecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-base text-slate-100 group-hover:text-white">
                  Continue with Google
                </span>
              </>
            )}
          </button>
        </div>

        {/* Trust & Security Badge */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>OAuth 2.0 Secure Authentication</span>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
          By signing in, you agree to our{' '}
          <button
            onClick={() => onNavigate('/terms')}
            className="text-amber-400/90 hover:underline cursor-pointer"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            onClick={() => onNavigate('/privacy')}
            className="text-amber-400/90 hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>.
        </p>
      </div>

      {/* Google Account Selector Dialog */}
      {showChooser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#1e232f] border border-slate-700 p-6 sm:p-7 shadow-2xl text-slate-100 animate-scaleUp">
            {/* Google Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <GoogleIcon className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-white">Sign in with Google</h3>
                <p className="text-xs text-slate-400">Choose an account to continue to Codingthunder</p>
              </div>
            </div>

            {!showCustomInput ? (
              <div className="space-y-2">
                {/* Account 1: Admin / Site Owner */}
                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      email: 'mishrashashwat90@gmail.com',
                      name: 'Shashwat Mishra',
                      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90%40gmail.com',
                    })
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 bg-slate-900/60 hover:bg-slate-800/80 transition-all flex items-center gap-3.5 text-left cursor-pointer group"
                >
                  <img
                    src="https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90%40gmail.com"
                    alt="Shashwat Mishra"
                    className="w-10 h-10 rounded-full border border-amber-500/40 bg-slate-950 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        Shashwat Mishra
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        Admin
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">mishrashashwat90@gmail.com</div>
                  </div>
                </button>

                {/* Account 2: Demo Student */}
                <button
                  type="button"
                  onClick={() =>
                    handleSelectAccount({
                      email: 'student@codingthunder.demo',
                      name: 'Thunder Student',
                      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=student',
                    })
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 transition-all flex items-center gap-3.5 text-left cursor-pointer group"
                >
                  <img
                    src="https://api.dicebear.com/7.x/identicon/svg?seed=student"
                    alt="Thunder Student"
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-950 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        Thunder Student
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        Student
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">student@codingthunder.demo</div>
                  </div>
                </button>

                {/* Option 3: Use another account */}
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full p-3.5 rounded-xl border border-dashed border-slate-700/80 hover:border-slate-600 bg-slate-900/30 hover:bg-slate-900/70 transition-all flex items-center gap-3.5 text-left cursor-pointer text-slate-400 hover:text-white"
                >
                  <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400">
                    +
                  </div>
                  <span className="text-xs font-medium">Use another Google account</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Google Email</label>
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="your-name@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowChooser(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
