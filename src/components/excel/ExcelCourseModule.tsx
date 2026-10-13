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
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { EXCEL_CHAPTERS } from './chaptersData.ts';
import { ExcelChapterRenderer } from './ExcelChapterRenderer.tsx';
import { ExcelChapter } from './types.ts';

interface ExcelCourseModuleProps {
  onNavigate: (path: string) => void;
  initialChapterNumber?: number;
}

export const ExcelCourseModule: React.FC<ExcelCourseModuleProps> = ({
  onNavigate,
  initialChapterNumber = 1,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() => {
    const idx = EXCEL_CHAPTERS.findIndex((c) => c.number === initialChapterNumber);
    return idx >= 0 ? idx : 0;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [completedChapters, setCompletedChapters] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('excel_completed_chapters');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { 'ch-1': true };
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const readingPaneTopRef = useRef<HTMLDivElement>(null);

  const currentChapter: ExcelChapter = EXCEL_CHAPTERS[currentChapterIndex] || EXCEL_CHAPTERS[0];

  const toggleComplete = (id: string) => {
    setCompletedChapters((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('excel_completed_chapters', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSelectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    if (readingPaneTopRef.current) {
      readingPaneTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < EXCEL_CHAPTERS.length - 1) {
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

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return EXCEL_CHAPTERS;
    const q = searchQuery.toLowerCase();
    return EXCEL_CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.subtopics.some((st) => st.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const progressPercentage = Math.round(
    (Object.values(completedChapters).filter(Boolean).length / EXCEL_CHAPTERS.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-[#090e1c]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/tutorials')}
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Tutorials</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight hidden sm:inline">
                Excel: Beginner to Advanced Masterclass
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                11 Chapters
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Progress:</span>
              <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-emerald-400 font-bold">{progressPercentage}%</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Share course"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Sticky Left Sidebar Navigation */}
        <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-[#080d19]/60 lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] flex flex-col">
          {/* Search syllabus */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter 11 Excel chapters..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{filteredChapters.length} Lessons Available</span>
              <span className="text-emerald-400">100% Free · Real Formulas</span>
            </div>
          </div>

          {/* Chapters List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredChapters.map((ch) => {
              const isActive = ch.number === currentChapter.number;
              const isDone = !!completedChapters[ch.id];
              const originalIndex = EXCEL_CHAPTERS.findIndex((c) => c.id === ch.id);

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(originalIndex)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 group ${
                    isActive
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-lg shadow-emerald-500/5'
                      : 'hover:bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(ch.id);
                    }}
                    className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
                    title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Lesson {String(ch.number).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          ch.difficulty === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : ch.difficulty === 'Intermediate'
                            ? 'bg-cyan-500/10 text-cyan-400'
                            : 'bg-purple-500/10 text-purple-400'
                        }`}
                      >
                        {ch.difficulty}
                      </span>
                    </div>

                    <div
                      className={`text-xs font-semibold leading-snug line-clamp-2 ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {ch.shortTitle}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-500">
                      <span>{ch.readTime}</span>
                      <span>·</span>
                      <span className="truncate">{ch.category}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Reading Pane */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div ref={readingPaneTopRef} />

          {/* Active Lesson Header Badge */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">Chapter {currentChapter.number} of 11</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" /> {currentChapter.readTime}
              </span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {currentChapter.category}
              </span>
            </div>

            <button
              onClick={() => toggleComplete(currentChapter.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                completedChapters[currentChapter.id]
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{completedChapters[currentChapter.id] ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>

          {/* Dynamic Chapter Content Component */}
          <div className="leading-relaxed">
            <ExcelChapterRenderer chapterNumber={currentChapter.number} />
          </div>

          {/* Bottom Progression Bar */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentChapterIndex === 0}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentChapterIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Lesson</span>
            </button>

            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              Lesson {currentChapterIndex + 1} of {EXCEL_CHAPTERS.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentChapterIndex === EXCEL_CHAPTERS.length - 1}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentChapterIndex === EXCEL_CHAPTERS.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
