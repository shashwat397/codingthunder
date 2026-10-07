import React, { useState } from 'react';
import { Zap, BookOpen, Video, FileText, Compass, ShieldCheck, User, LogOut, ChevronDown, Menu, X, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout, openAuthModal, loginWithGoogle, claimAdminRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Courses', path: '/courses', icon: Video },
    { label: 'Tutorials', path: '/tutorials', icon: FileText },
    { label: 'Ebooks', path: '/ebooks', icon: BookOpen },
    { label: 'Roadmaps', path: '/roadmaps', icon: Compass },
    { label: 'About', path: '/about', icon: null },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all shadow-md shadow-amber-500/10">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white font-mono leading-none">
                  Coding<span className="text-amber-400">thunder</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">
                  Code Fast · Ship Loud
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path || currentPath.startsWith(`${link.path}/`);
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'text-amber-300 bg-amber-500/10 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* User State */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com' && user.role === 'admin' && (
                  <button
                    onClick={() => handleLinkClick('/admin')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button
                  onClick={() => handleLinkClick('/dashboard')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>My Learning</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email)}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0e1422] border border-slate-700/80 shadow-2xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <div className="text-sm font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                        <span className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com' && user.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com' ? user.role : 'student'}
                        </span>
                      </div>

                      {user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com' && user.role === 'admin' ? (
                        <button
                          onClick={() => handleLinkClick('/admin')}
                          className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin Control Center</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleLinkClick('/dashboard')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-slate-400" />
                        <span>Enrolled Courses & Progress</span>
                      </button>

                      <button
                        onClick={() => handleLinkClick('/dashboard?tab=ebooks')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Purchased Ebooks</span>
                      </button>

                      <button
                        onClick={() => handleLinkClick('/dashboard?tab=settings')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </button>

                      <div className="border-t border-slate-800 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  Start Free
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
            {!user && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer shadow"
                  >
                    Start Free
                  </button>
                </div>
              </div>
            )}
            {user && (
              <>
                <div className="border-t border-slate-800 pt-2">
                  <button
                    onClick={() => handleLinkClick('/dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-300 font-medium hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>My Learning Dashboard</span>
                  </button>
                  {user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com' && user.role === 'admin' && (
                    <button
                      onClick={() => handleLinkClick('/admin')}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 font-medium hover:bg-slate-800 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Admin Control Center</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
