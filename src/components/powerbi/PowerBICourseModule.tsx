import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Share2,
  Sparkles,
  ChevronRight,
  Flame,
  Award,
  BarChart3,
  Check,
} from 'lucide-react';
import { CHAPTERS_LIST } from './chaptersData.ts';
import { ChapterRenderer } from './ChapterRenderer.tsx';
import { Chapter } from './types.ts';

interface PowerBICourseModuleProps {
  onNavigate: (path: string) => void;
  initialChapterNumber?: number;
}

export const PowerBICourseModule: React.FC<PowerBICourseModuleProps> = ({
  onNavigate,
  initialChapterNumber = 1,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() => {
    const idx = CHAPTERS_LIST.findIndex((c) => c.number === initialChapterNumber);
    return idx >= 0 ? idx : 0;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [completedChapters, setCompletedChapters] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('powerbi_completed_chapters');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { 'ch-1': true };
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const readingPaneTopRef = useRef<HTMLDivElement>(null);

  const currentChapter: Chapter = CHAPTERS_LIST[currentChapterIndex] || CHAPTERS_LIST[0];

  // Save progress
  const toggleComplete = (id: string) => {
    setCompletedChapters((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('powerbi_completed_chapters', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Switch lesson and scroll to top smoothly
  const handleSelectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    if (readingPaneTopRef.current) {
      readingPaneTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < CHAPTERS_LIST.length - 1) {
      handleSelectChapter(currentChapterIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      handleSelectChapter(currentChapterIndex - 1);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  // Filter chapters by search
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return CHAPTERS_LIST;
    const q = searchQuery.toLowerCase();
    return CHAPTERS_LIST.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.subtopics.some((st) => st.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const completedCount = Object.values(completedChapters).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / CHAPTERS_LIST.length) * 100);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#090d16]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={() => onNavigate('/tutorials')}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tutorials</span>
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold truncate hidden sm:inline">
              Power BI: Beginner to Advanced Masterclass
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-amber-400/90 font-mono font-bold truncate">
              Chapter {currentChapter.number}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-mono text-[11px]">
              <span className="text-slate-400">Progress:</span>
              <span className="text-amber-400 font-bold">{progressPercent}%</span>
              <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div style={{ width: `${progressPercent}%` }} className="h-full bg-amber-500 transition-all duration-300" />
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors border border-slate-800 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share Lesson</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION (STICKY LEFT COL) */}
          <aside className="lg:col-span-4 xl:col-span-3.5 w-full lg:sticky lg:top-20 space-y-4">
            
            {/* Course Overview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1322] to-slate-950 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">Power BI Mastery</h3>
                  <p className="text-[10px] font-mono text-slate-400">16 Comprehensive Chapters</p>
                </div>
              </div>

              {/* Progress Bar in Sidebar */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Completed: {completedCount}/{CHAPTERS_LIST.length}</span>
                  <span className="text-amber-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Search Chapters Box */}
              <div className="mt-4 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter chapters or topics..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Chapters List (Scrollable on desktop) */}
            <div className="p-2 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl max-h-[calc(100vh-280px)] overflow-y-auto space-y-1">
              {filteredChapters.map((chapter) => {
                const originalIndex = CHAPTERS_LIST.findIndex((c) => c.id === chapter.id);
                const isCurrent = originalIndex === currentChapterIndex;
                const isCompleted = !!completedChapters[chapter.id];

                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleSelectChapter(originalIndex)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 group ${
                      isCurrent
                        ? 'bg-amber-500/15 border border-amber-500/40 text-white shadow-md'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    {/* Status checkmark toggle */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(chapter.id);
                      }}
                      className="mt-0.5 shrink-0 text-slate-500 hover:text-amber-400 transition-colors"
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                          {chapter.shortTitle}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                            chapter.difficulty === 'Beginner'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : chapter.difficulty === 'Intermediate'
                              ? 'text-cyan-400 bg-cyan-500/10'
                              : 'text-purple-400 bg-purple-500/10'
                          }`}
                        >
                          {chapter.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{chapter.category}</span>
                        <span>·</span>
                        <span>{chapter.readTime}</span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredChapters.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500 font-mono">
                  No chapters matching "{searchQuery}"
                </div>
              )}
            </div>

          </aside>

          {/* MAIN READING PANE (RIGHT COL) */}
          <main className="lg:col-span-8 xl:col-span-8.5 w-full">
            <div ref={readingPaneTopRef} className="rounded-3xl bg-[#090d16]/90 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
              
              {/* Lesson Header Banner */}
              <div className="space-y-4 pb-6 border-b border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                      Chapter {currentChapter.number} of {CHAPTERS_LIST.length}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {currentChapter.readTime}
                    </span>
                  </div>

                  {/* Mark complete button */}
                  <button
                    onClick={() => toggleComplete(currentChapter.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                      completedChapters[currentChapter.id]
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {completedChapters[currentChapter.id] ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                  {currentChapter.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans border-l-2 border-amber-500/60 pl-4 py-0.5">
                  {currentChapter.summary}
                </p>

                {/* Subtopic tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] font-mono text-slate-500 mr-1">Topics:</span>
                  {currentChapter.subtopics.map((st, i) => (
                    <span key={i} className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Lesson Body */}
              <div className="py-2">
                <ChapterRenderer chapterNumber={currentChapter.number} />
              </div>

              {/* Bottom Navigation & Progression Controls */}
              <div className="pt-8 mt-12 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentChapterIndex === 0}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>Previous Lesson</span>
                </button>

                <div className="text-xs font-mono text-slate-500">
                  {currentChapterIndex + 1} of {CHAPTERS_LIST.length} lessons
                </div>

                {currentChapterIndex < CHAPTERS_LIST.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <span>Next Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('/courses')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>Course Complete! Explore Masterclasses</span>
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
};
