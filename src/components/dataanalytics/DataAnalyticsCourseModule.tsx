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
  LineChart,
  Check,
  Award,
  Layers,
} from 'lucide-react';
import { DATA_ANALYTICS_CHAPTERS } from './chaptersData.ts';
import { DataAnalyticsChapterRenderer } from './DataAnalyticsChapterRenderer.tsx';
import { AnalyticsChapter } from './types.ts';

interface DataAnalyticsCourseModuleProps {
  onNavigate: (path: string) => void;
  initialChapterNumber?: number;
}

export const DataAnalyticsCourseModule: React.FC<DataAnalyticsCourseModuleProps> = ({
  onNavigate,
  initialChapterNumber = 1,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() => {
    const idx = DATA_ANALYTICS_CHAPTERS.findIndex((c) => c.number === initialChapterNumber);
    return idx >= 0 ? idx : 0;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [completedChapters, setCompletedChapters] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('data_analytics_completed_chapters');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { 'ch-1': true };
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const readingPaneTopRef = useRef<HTMLDivElement>(null);

  const currentChapter: AnalyticsChapter =
    DATA_ANALYTICS_CHAPTERS[currentChapterIndex] || DATA_ANALYTICS_CHAPTERS[0];

  const toggleComplete = (id: string) => {
    setCompletedChapters((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('data_analytics_completed_chapters', JSON.stringify(updated));
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
    if (currentChapterIndex < DATA_ANALYTICS_CHAPTERS.length - 1) {
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
    if (!searchQuery.trim()) return DATA_ANALYTICS_CHAPTERS;
    const q = searchQuery.toLowerCase();
    return DATA_ANALYTICS_CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.subtopics.some((st) => st.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const progressPercentage = Math.round(
    (Object.values(completedChapters).filter(Boolean).length / DATA_ANALYTICS_CHAPTERS.length) * 100
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/tutorials')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tutorials</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
                <LineChart className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Data Analytics Playbook</span>
                  <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Complete Notes
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">12 In-Depth Chapters • SQL, Python, Excel & Power BI</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress Bar Widget */}
            <div className="hidden md:flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-[11px] font-mono text-slate-300 font-medium">{progressPercentage}% Done</span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-8">
        {/* Sticky Left Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-4 shadow-2xl flex flex-col max-h-[calc(100vh-7rem)] overflow-hidden">
            {/* Search Box */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filter topics, SQL, Python..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Curriculum Progress & Chapter Counter */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>SYLLABUS (12 LESSONS)</span>
              <span className="text-cyan-400">
                {Object.values(completedChapters).filter(Boolean).length}/12 Finished
              </span>
            </div>

            {/* Chapters Navigation List */}
            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 custom-scrollbar">
              {filteredChapters.map((chapter) => {
                const globalIndex = DATA_ANALYTICS_CHAPTERS.findIndex((c) => c.id === chapter.id);
                const isActive = globalIndex === currentChapterIndex;
                const isCompleted = !!completedChapters[chapter.id];

                return (
                  <div
                    key={chapter.id}
                    onClick={() => handleSelectChapter(globalIndex)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group flex items-start gap-2.5 ${
                      isActive
                        ? 'border-cyan-500/60 bg-cyan-950/20 text-white shadow-md shadow-cyan-500/5'
                        : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(chapter.id);
                      }}
                      className="mt-0.5 text-slate-500 hover:text-cyan-400 transition shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold truncate">
                          Ch {chapter.number}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            chapter.difficulty === 'Beginner'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                              : chapter.difficulty === 'Intermediate'
                              ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20'
                              : 'border-amber-500/30 text-amber-400 bg-amber-950/20'
                          }`}
                        >
                          {chapter.difficulty}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-semibold leading-tight line-clamp-1 ${
                          isActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {chapter.shortTitle}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {chapter.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Career Ready Badge Footer */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <Award className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Full Production Syllabus (SQL, Python & BI)</span>
            </div>
          </div>
        </aside>

        {/* Main Reading Pane */}
        <main className="flex-1 min-w-0">
          <div
            ref={readingPaneTopRef}
            className="rounded-3xl border border-slate-800 bg-[#0a0f1d] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Action Bar Above Chapter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Chapter {currentChapter.number} of 12
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> {currentChapter.readTime}
                </span>
              </div>

              <button
                onClick={() => toggleComplete(currentChapter.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  completedChapters[currentChapter.id]
                    ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {completedChapters[currentChapter.id] ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mark as Done</span>
                  </>
                )}
              </button>
            </div>

            {/* Chapter Dynamic Renderer */}
            <DataAnalyticsChapterRenderer chapterId={currentChapter.id} />

            {/* Lesson Pagination Footer */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentChapterIndex === 0}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                  currentChapterIndex === 0
                    ? 'border-slate-800/50 text-slate-600 bg-slate-950 cursor-not-allowed'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>

              <div className="text-xs text-slate-500 font-mono">
                {currentChapterIndex + 1} / {DATA_ANALYTICS_CHAPTERS.length}
              </div>

              <button
                onClick={handleNext}
                disabled={currentChapterIndex === DATA_ANALYTICS_CHAPTERS.length - 1}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                  currentChapterIndex === DATA_ANALYTICS_CHAPTERS.length - 1
                    ? 'border-slate-800/50 text-slate-600 bg-slate-950 cursor-not-allowed'
                    : 'border-cyan-500/40 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-cyan-500/20'
                }`}
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
