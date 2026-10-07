import React, { useState } from 'react';
import { X, Zap, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

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

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register, openAuthModal, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showChooser, setShowChooser] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else if (authModalMode === 'register') {
        await register(name, email, password);
      } else if (authModalMode === 'forgot') {
        setSuccessMsg('Reset link sent! If an account exists, check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectGoogleAccount = async (account: { email: string; name: string; avatar?: string }) => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await loginWithGoogle(account);
      setShowChooser(false);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    handleSelectGoogleAccount({
      email: customEmail.trim(),
      name: customName.trim() || customEmail.split('@')[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        {/* Top subtle decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-mono">
            Coding<span className="text-amber-400">thunder</span>
          </span>
        </div>

        <h2 className="text-xl font-semibold text-white mt-3">
          {authModalMode === 'login' && 'Welcome back, developer'}
          {authModalMode === 'register' && 'Create your developer account'}
          {authModalMode === 'forgot' && 'Reset your password'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          {authModalMode === 'login' && 'Sign in to access your courses, progress, and ebooks.'}
          {authModalMode === 'register' && 'Join 450,000+ developers shipping production software.'}
          {authModalMode === 'forgot' && 'Enter your email to receive recovery instructions.'}
        </p>

        {/* SINGLE BUTTON FOR GOOGLE ACCOUNT SIGN IN */}
        <button
          type="button"
          onClick={() => setShowChooser(true)}
          disabled={isGoogleLoading}
          className="w-full h-12 px-4 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 active:scale-[0.99] transition-all text-sm font-medium text-slate-200 hover:text-white flex items-center justify-center gap-3 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed group mb-4"
        >
          {isGoogleLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Connecting to Google...</span>
            </>
          ) : (
            <>
              <GoogleIcon className="w-5 h-5 shrink-0" />
              <span className="font-semibold text-sm text-slate-100 group-hover:text-white">
                Continue with Google
              </span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            or continue with email
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Mode Switch Tabs */}
        {authModalMode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create One / Sign Up
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {authModalMode === 'login' && 'Sign In with Email'}
                  {authModalMode === 'register' && 'Create Account with Email'}
                  {authModalMode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {authModalMode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Create one (Sign up free)
              </button>
            </p>
          )}
          {authModalMode === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
          {authModalMode === 'forgot' && (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      {showChooser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
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
                    handleSelectGoogleAccount({
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
                    handleSelectGoogleAccount({
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
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3.5">
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
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow cursor-pointer"
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
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
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
