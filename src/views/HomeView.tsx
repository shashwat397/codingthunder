import React, { useEffect, useState } from 'react';
import { Zap, Play, BookOpen, Star, Clock, CheckCircle2, ArrowRight, ShieldCheck, Download, Code2, Users, Flame, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { TerminalHero } from '../components/common/TerminalHero.tsx';
import { DataSandbox } from '../components/common/DataSandbox.tsx';
import { TypewriterHero } from '../components/common/TypewriterHero.tsx';
import { HeroCodeWindow } from '../components/common/HeroCodeWindow.tsx';
import { TechMarquee } from '../components/common/TechMarquee.tsx';
import { CareerPathRoadmap } from '../components/common/CareerPathRoadmap.tsx';
import { Course, Tutorial, Ebook } from '../types/index.ts';
import { BlogPost } from '../types/blog.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { openAuthModal, user, openCheckout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, tRes, eRes, bRes] = await Promise.all([
          api.getCourses(),
          api.getTutorials(),
          api.getEbooks(),
          api.getBlogs({ limit: 3 }),
        ]);
        setCourses(cRes.courses.slice(0, 3));
        setTutorials(tRes.tutorials.slice(0, 3));
        setEbooks(eRes.ebooks.slice(0, 2));
        setBlogs(bRes?.posts ? bRes.posts.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const onCatalogUpdated = () => {
      loadData();
    };

    window.addEventListener('catalog-updated', onCatalogUpdated);
    window.addEventListener('blog-updated', onCatalogUpdated);
    window.addEventListener('focus', onCatalogUpdated);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'codingthunder_blogs') {
        loadData();
      }
    };
    window.addEventListener('storage', onStorage);

    const onVisibility = () => {
      if (!document.hidden) {
        loadData();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('codingthunder_blog_sync');
        bc.onmessage = () => {
          loadData();
        };
      } catch {}
    }

    return () => {
      window.removeEventListener('catalog-updated', onCatalogUpdated);
      window.removeEventListener('blog-updated', onCatalogUpdated);
      window.removeEventListener('focus', onCatalogUpdated);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
      if (bc) bc.close();
    };
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2-Column Hero: Left Copy & CTAs, Right Interactive Code Window */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Heading, Animated Typewriter, Description, CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                  Codingthunder
                </span>
              </h1>

              {/* Smooth Dynamic Typewriter Sub-headline */}
              <TypewriterHero align="responsive" />

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
                Production-tested coding education inspired by the clarity of real engineering. Master modern web development, algorithms, backend architecture, and cloud deployment with zero fluff.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/courses')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer"
                >
                  <span>Explore Courses & Bootcamps</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/tutorials')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>Free Cheat Sheets & Notes</span>
                </button>
              </div>

              {/* Social Trust Metrics */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 pt-3 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">450K+</span> Active Students
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">4.9/5</span> Average Rating
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">100%</span> Source Code Provided
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Hero Code Window (macOS dark glassmorphic terminal card) */}
            <div className="lg:col-span-5 w-full">
              <HeroCodeWindow />
            </div>
          </div>

          {/* Interactive Terminal Showcase */}
          <div className="mt-14 sm:mt-20">
            <TerminalHero />
          </div>
        </div>
      </section>

      {/* 2. Infinite Scrolling Tech Stack Marquee (Directly below Hero Section) */}
      <TechMarquee />

      {/* Interactive SQL & Pandas Sandbox Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Data Engineering Laboratory</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Run Queries on Live Production Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Execute SQL aggregations and Pandas transformations directly in your browser. No local setup or installation required.
          </p>
        </div>

        <DataSandbox />
      </section>

      {/* 3. Interactive Learning Roadmap Switcher (Middle of Homepage) */}
      <CareerPathRoadmap onNavigate={onNavigate} />

      {/* 2. Value Propositions (The Thunder Way) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            The Codingthunder Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Engineered For Engineers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            No endless theory videos. Every module is structured around building working production software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Full Production Projects</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Build full-stack applications with real databases, authentication, responsive layouts, and edge cloud deployments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Open Notes & Source Code</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Every single lesson comes with concise markdown notes, copyable code snippets, and downloadable GitHub starter repositories.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero AI Slop</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Hand-crafted curriculum by senior software architects with real battle scars from large-scale distributed systems.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Top Rated
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Featured Masterclasses</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Step-by-step masterclasses designed to take you from beginner to staff engineer.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-[#0d121e] border border-slate-800/90 hover:border-amber-500/40 transition-all overflow-hidden flex flex-col shadow-xl"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d121e] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-slate-700/80">
                    {course.category}
                  </span>
                </div>
                {course.isFree && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/90 text-slate-950 font-bold text-xs font-mono shadow-md">
                      100% FREE
                    </span>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata (zero-pill discipline) */}
                  <div className="text-xs text-slate-400 font-mono mb-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {course.rating}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.totalDuration}
                    </span>
                    <span>·</span>
                    <span>{course.totalLessons} Lessons</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    {course.isFree ? (
                      <span className="text-emerald-400 font-bold font-mono text-base">FREE</span>
                    ) : (
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="text-lg font-bold text-white">₹{course.price}</span>
                        <span className="text-xs text-slate-500 line-through">₹{course.originalPrice}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigate(`/courses/${course.slug}`)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trending Tutorials & Cheatsheets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Free Knowledge Base
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Cheat Sheets & Architecture Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Searchable reference notes, syntax summaries, and interview patterns.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tutorials')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>Explore All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Strictly filtered to exactly the 3 primary masterclasses from Tutorials & Cheat Sheets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'power-bi',
              title: 'Power BI: Beginner to Advanced Masterclass',
              category: 'Business Intelligence',
              badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
              accentColor: 'text-amber-400',
              hoverGlow: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
              readTime: '16 Lessons · 4.5 Hours',
              reads: '18.4K reads',
              description:
                'Master enterprise Business Intelligence from scratch. Complete deep dive into Power Query M transformations, Ralph Kimball Star Schemas, advanced DAX (CALCULATE, SUMX), and Row-Level Security.',
              tags: ['Star Schema', 'DAX Measures', 'RLS Security'],
              path: '/tutorials/power-bi-beginner-to-advanced',
            },
            {
              id: 'python',
              title: 'Python: Beginner to Advanced Complete Course',
              category: 'Programming & Automation',
              badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
              accentColor: 'text-emerald-400',
              hoverGlow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
              readTime: '18 Lessons · 5.5 Hours',
              reads: '24.1K reads',
              description:
                'From foundational syntax and CPython bytecode execution to object-oriented architectures, memory-efficient generators, decorators, file automation, requests, and high-stakes technical interview prep.',
              tags: ['CPython Internals', 'OOP Patterns', 'Automation'],
              path: '/tutorials/python-beginner-to-advanced',
            },
            {
              id: 'data-analytics',
              title: 'Data Analytics Playbook: Complete Notes',
              category: 'Data Analytics',
              badgeStyle: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
              accentColor: 'text-cyan-400',
              hoverGlow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
              readTime: '12 Lessons · 4.0 Hours',
              reads: '16.8K reads',
              description:
                'The definitive end-to-end curriculum. Master the 6-stage analytics lifecycle, advanced SQL window functions, relational ER diagrams, Python Pandas data pipelines, IQR outlier detection, and fraud investigation.',
              tags: ['SQL Window Functions', 'Pandas Pipelines', 'Fraud Capstone'],
              path: '/tutorials/data-analytics-playbook',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`p-6 rounded-2xl bg-[#0c101c] border border-slate-800 ${item.hoverGlow} transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold font-mono ${item.badgeStyle}`}>
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{item.reads}</span>
                <span className="text-amber-400 font-sans font-semibold group-hover:underline flex items-center gap-1">
                  Launch Masterclass <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Developer Ebooks Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1322] to-slate-900 border border-slate-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Digital Handbooks & Schematics
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Architectural Ebooks for High-Performing Teams
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Downloadable DRM-free PDF and ePub editions with production system blueprints, microservice patterns, and 150+ visual algorithmic mental models.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes complete GitHub repositories and starter boilerplate packages</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure instant downloads restricted to verified buyers</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free lifetime updates for every upcoming release</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('/ebooks')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Browse Ebook Library
                </button>
              </div>
            </div>

            {/* Ebook Preview Card */}
            {ebooks[0] && (
              <div className="bg-[#090d16] border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row gap-6 items-center">
                <img
                  src={ebooks[0].coverImage}
                  alt={ebooks[0].title}
                  className="w-36 h-48 object-cover rounded-xl shadow-2xl border border-slate-700 shrink-0"
                />
                <div className="space-y-3">
                  <span className="text-[11px] font-mono text-amber-400 uppercase">Featured Release</span>
                  <h4 className="text-base font-bold text-white leading-snug">{ebooks[0].title}</h4>
                  <div className="text-xs text-slate-400 font-mono">
                    By {ebooks[0].author} · {ebooks[0].pages} Pages
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-amber-400 font-mono">₹{ebooks[0].price}</span>
                    <button
                      onClick={() => onNavigate(`/ebooks/${ebooks[0].slug}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      Read Preview 📖
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5.5. Engineering Blog & Technical Articles */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Technical Articles & Engineering Insights
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Latest Architecture Blueprints & Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Long-form technical breakdowns, machine learning pipelines, and cloud analytics engineering deep dives.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/blog')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate(`/blog/${post.slug}`)}
                className="p-5 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-slate-900 border border-slate-800">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0a0f1d]/90 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-mono font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {post.readTime}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-6 h-6 rounded-full border border-slate-700"
                    />
                    <span className="text-xs text-slate-300 font-medium">{post.authorName}</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Article
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Testimonials & Placement Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Student Success
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Built by Coders, Loved by Thousands</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "I purchased and read the ebook 'SQL Mastery: From Beginner to Interview Ready' from this website, and the transition from beginner syntax to real-world business analytics is seamless. It's the ultimate cheat sheet for interview prep—it directly helped me pass all my technical SQL rounds and land my dream Data Analyst job!"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 font-bold text-xs flex items-center justify-center text-amber-400">
                ER
              </div>
              <div>
                <div className="text-xs font-bold text-white">Emily R.</div>
                <div className="text-[11px] text-slate-500">Senior Data Analyst @ TechCorp</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "Purchasing and reading 'SQL Mastery: From Beginner to Interview Ready' from this website was a total game-changer. The complex window functions, subqueries, and real business case studies prepared me for every tricky question. It helped me clear the live coding round effortlessly and land my Data Analyst job!"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 font-bold text-xs flex items-center justify-center text-cyan-400">
                RS
              </div>
              <div>
                <div className="text-xs font-bold text-white">Rohan Sharma</div>
                <div className="text-[11px] text-slate-500">Data Analyst @ Swiggy</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "I purchased the SQL ebook from here before my technical rounds. The practice queries and interview tips were spot on. Helped me easily clear the live coding test and crack my Data Analyst job!"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 font-bold text-xs flex items-center justify-center text-amber-400">
                AV
              </div>
              <div>
                <div className="text-xs font-bold text-white">Aman Verma</div>
                <div className="text-[11px] text-slate-500">Data Analyst @ Bengaluru</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "I was nervous about technical SQL interviews until I purchased and read 'SQL Mastery: From Beginner to Interview Ready' on this site. The query breakdowns, indexing tips, and interview cheat sheets were spot on. Thanks to this ebook, I aced my technical interviews and successfully landed my first Data Analyst role!"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 font-bold text-xs flex items-center justify-center text-emerald-400">
                JM
              </div>
              <div>
                <div className="text-xs font-bold text-white">Jessica Miller</div>
                <div className="text-[11px] text-slate-500">Junior Data Analyst @ Deloitte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Community CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#141927] to-[#0c101c] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 mb-6">
            Join 450,000+ engineers leveling up their coding skills with Codingthunder today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-xl shadow-amber-500/20"
            >
              Create Free Account ⚡
            </button>
            <button
              onClick={() => onNavigate('/courses')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              Explore Free Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
