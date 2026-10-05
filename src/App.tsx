/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { CheckoutModal } from './components/checkout/CheckoutModal.tsx';
import { HomeView } from './views/HomeView.tsx';
import { CoursesView } from './views/CoursesView.tsx';
import { CourseDetailView } from './views/CourseDetailView.tsx';
import { TutorialsView } from './views/TutorialsView.tsx';
import { TutorialDetailView } from './views/TutorialDetailView.tsx';
import { EbooksView } from './views/EbooksView.tsx';
import { EbookDetailView } from './views/EbookDetailView.tsx';
import { StudentDashboardView } from './views/StudentDashboardView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { StaticPages } from './views/StaticPages.tsx';
import { api } from './services/api.ts';
import { SiteSettings } from './types/index.ts';
import { X, Sparkles, Zap } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Sync with browser history
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Fetch site settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await api.getSiteSettings();
        setSettings(s);
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  // Route matching helper
  const renderRoute = () => {
    // 1. Course Detail Route
    if (currentPath.startsWith('/courses/') && currentPath !== '/courses/') {
      const slugOrId = currentPath.replace('/courses/', '');
      return <CourseDetailView courseSlugOrId={slugOrId} onNavigate={navigate} />;
    }

    // 2. Tutorial Detail Route
    if (currentPath.startsWith('/tutorials/') && currentPath !== '/tutorials/') {
      const slugOrId = currentPath.replace('/tutorials/', '');
      return <TutorialDetailView slugOrId={slugOrId} onNavigate={navigate} />;
    }

    // 3. Ebook Detail Route
    if (currentPath.startsWith('/ebooks/') && currentPath !== '/ebooks/') {
      const slugOrId = currentPath.replace('/ebooks/', '');
      return <EbookDetailView slugOrId={slugOrId} onNavigate={navigate} />;
    }

    // 4. Exact Routes
    switch (currentPath) {
      case '/':
        return <HomeView onNavigate={navigate} />;
      case '/courses':
        return <CoursesView onNavigate={navigate} />;
      case '/tutorials':
        return <TutorialsView onNavigate={navigate} />;
      case '/ebooks':
        return <EbooksView onNavigate={navigate} />;
      case '/dashboard':
        return <StudentDashboardView onNavigate={navigate} />;
      case '/admin':
        return <AdminDashboardView onNavigate={navigate} />;
      case '/about':
        return <StaticPages page="about" onNavigate={navigate} />;
      case '/contact':
        return <StaticPages page="contact" onNavigate={navigate} />;
      case '/faq':
        return <StaticPages page="faq" onNavigate={navigate} />;
      case '/privacy':
        return <StaticPages page="privacy" onNavigate={navigate} />;
      case '/terms':
        return <StaticPages page="terms" onNavigate={navigate} />;
      case '/roadmaps':
        return <StaticPages page="roadmaps" onNavigate={navigate} />;
      default:
        return <HomeView onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Top Announcement Banner */}
      {settings?.showBanner && !bannerDismissed && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-slate-950 font-mono text-xs py-2 px-4 flex items-center justify-between text-center relative z-50">
          <div className="flex-1 flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span className="font-semibold tracking-wide">{settings.bannerText}</span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* View Container */}
      <main className="flex-1">{renderRoute()}</main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Modals */}
      <AuthModal />
      <CheckoutModal onSuccess={() => {}} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
