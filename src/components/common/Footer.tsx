import React from 'react';
import { Zap, Github, Twitter, Youtube, Mail, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#070a12] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-bold text-white font-mono">
                Coding<span className="text-amber-400">thunder</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering engineers worldwide with production-ready programming courses, in-depth cheat sheets, and architectural handbooks. No AI slop. Just high-impact craft.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Learning Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/courses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Web Development Bootcamp
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/courses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Python 3 & Automation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/courses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  DSA Placement Masterclass
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/courses')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  DevOps, Docker & K8s
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/roadmaps')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Developer Roadmaps 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Knowledge & Ebooks */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Guides & Books
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/tutorials')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Python 3 Cheat Sheet
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tutorials')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  React 19 Architecture Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tutorials')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Git Rebasing & Clean Commits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ebooks')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Full-Stack Architect's Playbook
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ebooks')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Crack the Coding Interview Ebook
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  About Codingthunder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Codingthunder Inc. All rights reserved.</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Production Verified
            </span>
          </div>
          <div className="text-slate-400 font-mono text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Data Science & Analytics Engineering Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
