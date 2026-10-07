import React, { useState, useEffect } from 'react';
import { Zap, Shield, ArrowLeft, Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
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
  initialMode?: 'login' | 'register' | 'forgot';
  onNavigate: (path: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ initialMode = 'login', onNavigate }) => {
  const { user, login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google SSO Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Sync mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

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

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail) return;
    setIsGoogleSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle({
        email: googleEmail.trim().toLowerCase(),
        name: googleName.trim() || googleEmail.split('@')[0],
      });
      setIsGoogleModalOpen(false);
      onNavigate(getRedirectUrl());
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In failed. Please check your connection.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onNavigate(getRedirectUrl());
      } else if (mode === 'register') {
        await register(name, email, password);
        onNavigate(getRedirectUrl());
      } else if (mode === 'forgot') {
        setSuccessMsg('Reset link sent! Check your inbox for recovery instructions.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative">
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

      {/* Main Card */}
      <div className="w-full max-w-md rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 md:p-9 shadow-2xl text-slate-100 text-center relative overflow-hidden">
        {/* Top subtle decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500" />

        {/* Logo & Brand Header */}
        <div className="flex flex-col items-center justify-center gap-2.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-mono">
            Coding<span className="text-amber-400">thunder</span>
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {mode === 'login' && 'Welcome to Codingthunder'}
          {mode === 'register' && 'Create Developer Account'}
          {mode === 'forgot' && 'Reset Password'}
        </h1>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          {mode === 'login' && 'Log in to access your masterclasses, tutorials, and ebooks.'}
          {mode === 'register' && 'Join 450,000+ developers shipping real-world software.'}
          {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
        </p>

        {/* SINGLE BUTTON FOR GOOGLE ACCOUNT SIGN IN */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full h-12 px-4 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 active:scale-[0.99] transition-all text-sm font-medium text-slate-200 hover:text-white flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-slate-800/50 group"
          >
            <GoogleIcon className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm text-slate-100 group-hover:text-white">
              Continue with Google
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            or continue with email
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Mode Switch Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-left flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-left">
          {mode === 'register' && (
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

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                    }}
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
                  {mode === 'login' && 'Sign In with Email'}
                  {mode === 'register' && 'Create Account with Email'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Footer Links */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className="text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              Back to sign in
            </button>
          )}
        </div>

        {/* Trust & Security Badge */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>OAuth 2.0 & TLS 1.3 Encrypted Security</span>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
          By continuing, you agree to Codingthunder's{' '}
          <button
            type="button"
            onClick={() => onNavigate('/terms')}
            className="text-amber-400/90 hover:underline cursor-pointer"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => onNavigate('/privacy')}
            className="text-amber-400/90 hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>.
        </p>
      </div>

      {/* Standard Google Account Sign-In Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#181c28] border border-slate-700 p-6 sm:p-7 shadow-2xl text-slate-100 animate-scaleUp text-left">
            {/* Google Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <GoogleIcon className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-white">Sign in with Google</h3>
                <p className="text-xs text-slate-400">Continue with your personal or work Google account</p>
              </div>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google Account Email <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="your-name@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Full Name <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGoogleSubmitting || !googleEmail.trim()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGoogleSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon className="w-4 h-4" />
                  )}
                  <span>Sign In with Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
