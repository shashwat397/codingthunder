import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  CheckCircle2,
  Clock,
  Share2,
  Check,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Info,
  HelpCircle,
  Award,
} from 'lucide-react';
import { Tutorial, TutorialChapter } from '../../types/index.ts';
import { CodeBlock } from '../common/CodeBlock.tsx';
import {
  EcosystemDiagram,
  ArchitectureWorkflowDiagram,
  StorageModesDiagram,
  EtlQueryFoldingDiagram,
  StarVsSnowflakeDiagram,
  FilterContextDiagram,
  DataVisualizationsShowcase,
  DashboardMockup,
  DynamicRlsDiagram,
  PerformanceAnalyzerBreakdown,
  Top20InterviewQuestions,
  RoadmapTimeline,
} from './PowerBiVisuals.tsx';

interface InteractiveTutorialViewerProps {
  tutorial: Tutorial;
  onNavigate: (path: string) => void;
  initialChapterIndex?: number;
}

export const InteractiveTutorialViewer: React.FC<InteractiveTutorialViewerProps> = ({
  tutorial,
  onNavigate,
  initialChapterIndex = 0,
}) => {
  const chapters: TutorialChapter[] = useMemo(() => {
    return tutorial.chapters && tutorial.chapters.length > 0
      ? tutorial.chapters
      : [
          {
            id: 'chapter-1',
            number: 1,
            title: tutorial.title,
            summary: tutorial.description,
            contentMarkdown: tutorial.contentMarkdown,
          },
        ];
  }, [tutorial]);

  const [activeIdx, setActiveIdx] = useState(initialChapterIndex);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<number[]>([0]);

  const currentChapter = chapters[activeIdx] || chapters[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeIdx]);

  const filteredChapters = useMemo(() => {
    if (!searchFilter.trim()) return chapters;
    const q = searchFilter.toLowerCase();
    return chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.number.toString().includes(q)
    );
  }, [chapters, searchFilter]);

  const handleSelectChapter = (idx: number) => {
    setActiveIdx(idx);
    setMobileMenuOpen(false);
    if (!completedChapters.includes(idx)) {
      setCompletedChapters((prev) => [...prev, idx]);
    }
  };

  const handleNext = () => {
    if (activeIdx < chapters.length - 1) {
      handleSelectChapter(activeIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      handleSelectChapter(activeIdx - 1);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const progressPercent = Math.round(((activeIdx + 1) / chapters.length) * 100);

  // Render Visual components when matching tags are found
  const renderVisualComponent = (tag: string, key: string) => {
    switch (tag.trim()) {
      case '[VISUAL: ECOSYSTEM]':
        return <EcosystemDiagram key={key} />;
      case '[VISUAL: ARCHITECTURE]':
        return <ArchitectureWorkflowDiagram key={key} />;
      case '[VISUAL: STORAGE_MODES]':
        return <StorageModesDiagram key={key} />;
      case '[VISUAL: ETL_QUERY_FOLDING]':
        return <EtlQueryFoldingDiagram key={key} />;
      case '[VISUAL: STAR_VS_SNOWFLAKE]':
        return <StarVsSnowflakeDiagram key={key} />;
      case '[VISUAL: FILTER_CONTEXT]':
        return <FilterContextDiagram key={key} />;
      case '[VISUAL: DATA_VISUALIZATION]':
        return <DataVisualizationsShowcase key={key} />;
      case '[VISUAL: DASHBOARD_MOCKUP]':
        return <DashboardMockup key={key} />;
      case '[VISUAL: DYNAMIC_RLS]':
        return <DynamicRlsDiagram key={key} />;
      case '[VISUAL: PERFORMANCE_ANALYZER]':
        return <PerformanceAnalyzerBreakdown key={key} />;
      case '[VISUAL: TOP_20_QUESTIONS]':
        return <Top20InterviewQuestions key={key} />;
      case '[VISUAL: ROADMAP_TIMELINE]':
        return <RoadmapTimeline key={key} />;
      default:
        return null;
    }
  };

  // Full-featured parser for Markdown, CodeBlocks, Callout boxes, Tables, and Native Visuals
  const renderMarkdown = (markdown: string) => {
    const parts: React.ReactNode[] = [];
    // Split by code blocks first
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const precedingText = markdown.substring(lastIndex, match.index);
      if (precedingText) {
        parts.push(renderTextAndCalloutSections(precedingText, `text-${lastIndex}`));
      }

      const language = match[1] || 'plaintext';
      const code = match[2];
      const langUpper = language.toUpperCase();
      const filename =
        langUpper === 'DAX'
          ? 'Measure.dax'
          : langUpper === 'M' || langUpper === 'POWERQUERY'
          ? 'Transform.m'
          : langUpper === 'SQL'
          ? 'Query.sql'
          : undefined;

      parts.push(
        <div key={`code-${match.index}`} className="my-6">
          <CodeBlock code={code} language={language} filename={filename} />
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    const remainingText = markdown.substring(lastIndex);
    if (remainingText) {
      parts.push(renderTextAndCalloutSections(remainingText, `text-${lastIndex}`));
    }

    return parts;
  };

  const renderTextAndCalloutSections = (text: string, keyPrefix: string) => {
    const chunks = text.split('\n\n');
    return (
      <div key={keyPrefix} className="space-y-6 my-5 leading-relaxed text-slate-200 text-base sm:text-lg font-sans">
        {chunks.map((chunk, i) => {
          const trimmed = chunk.trim();
          if (!trimmed) return null;

          // Check if chunk is a visual token
          if (trimmed.startsWith('[VISUAL: ') && trimmed.endsWith(']')) {
            return renderVisualComponent(trimmed, `${keyPrefix}-vis-${i}`);
          }

          // Headers
          if (trimmed.startsWith('# ')) {
            return (
              <h1
                key={i}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-10 mb-6 tracking-tight pb-3 border-b border-slate-800"
              >
                {trimmed.replace('# ', '')}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={i}
                className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-10 mb-4 tracking-tight flex items-center gap-3 border-b border-slate-800/80 pb-2"
              >
                <span className="w-2 h-6 bg-amber-400 rounded-full inline-block shrink-0 shadow-sm shadow-amber-400/40" />
                <span>{trimmed.replace('## ', '')}</span>
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={i} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 text-slate-100 flex items-center gap-2">
                <span className="text-amber-400 font-mono text-sm">▸</span>
                <span>{trimmed.replace('### ', '')}</span>
              </h3>
            );
          }

          // Distinct Colored Callout Boxes
          if (trimmed.startsWith('> ')) {
            const quoteContent = trimmed.replace(/^>\s*/gm, '').trim();

            // 1. Best Practice Callout (Emerald / Teal)
            if (quoteContent.toLowerCase().includes('best practice')) {
              return (
                <div
                  key={i}
                  className="my-6 p-5 sm:p-6 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 shadow-xl shadow-emerald-950/20 relative overflow-hidden"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-mono uppercase tracking-wider font-extrabold text-emerald-400 mb-1">
                        Best Practice Standard
                      </div>
                      <div
                        className="text-sm sm:text-base text-emerald-100 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{
                          __html: formatInlineMarkdown(quoteContent.replace(/^\*\*(.*?)\*\*:\s*/i, '')),
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // 2. Common Mistake / Anti-Pattern Callout (Rose / Red)
            if (
              quoteContent.toLowerCase().includes('common mistake') ||
              quoteContent.toLowerCase().includes('anti-pattern') ||
              quoteContent.toLowerCase().includes('warning')
            ) {
              return (
                <div
                  key={i}
                  className="my-6 p-5 sm:p-6 rounded-2xl bg-rose-950/30 border-2 border-rose-500/40 shadow-xl shadow-rose-950/20 relative overflow-hidden"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-mono uppercase tracking-wider font-extrabold text-rose-400 mb-1">
                        Common Mistake & Anti-Pattern
                      </div>
                      <div
                        className="text-sm sm:text-base text-rose-100 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{
                          __html: formatInlineMarkdown(quoteContent.replace(/^\*\*(.*?)\*\*:\s*/i, '')),
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // 3. Interview Tip Callout (Purple / Indigo)
            if (quoteContent.toLowerCase().includes('interview tip') || quoteContent.toLowerCase().includes('interview question')) {
              return (
                <div
                  key={i}
                  className="my-6 p-5 sm:p-6 rounded-2xl bg-purple-950/30 border-2 border-purple-500/40 shadow-xl shadow-purple-950/20 relative overflow-hidden"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-mono uppercase tracking-wider font-extrabold text-purple-300 mb-1">
                        Technical Interview Strategy
                      </div>
                      <div
                        className="text-sm sm:text-base text-purple-100 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{
                          __html: formatInlineMarkdown(quoteContent.replace(/^\*\*(.*?)\*\*:\s*/i, '')),
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // 4. Pro Tip / Golden Rule / Certification Tip (Amber / Cyan)
            const isCert = quoteContent.toLowerCase().includes('certification');
            return (
              <div
                key={i}
                className={`my-6 p-5 sm:p-6 rounded-2xl border-2 shadow-xl relative overflow-hidden ${
                  isCert
                    ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100 shadow-cyan-950/20'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-100 shadow-amber-950/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                      isCert
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {isCert ? <Award className="w-5 h-5 sm:w-6 sm:h-6" /> : <Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                  <div>
                    <div
                      className={`text-xs sm:text-sm font-mono uppercase tracking-wider font-extrabold mb-1 ${
                        isCert ? 'text-cyan-300' : 'text-amber-400'
                      }`}
                    >
                      {isCert ? 'PL-300 Certification Exam Tip' : 'Senior Engineer Pro Tip'}
                    </div>
                    <div
                      className="text-sm sm:text-base leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{
                        __html: formatInlineMarkdown(quoteContent.replace(/^\*\*(.*?)\*\*:\s*/i, '')),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          }

          // Markdown Table -> Styled HTML Table
          if (trimmed.includes('|') && trimmed.split('\n').length >= 3) {
            const tableLines = trimmed
              .split('\n')
              .map((l) => l.trim())
              .filter((l) => l.startsWith('|'));
            if (tableLines.length >= 2) {
              const headerCols = tableLines[0]
                .split('|')
                .map((c) => c.trim())
                .filter(Boolean);
              const dataRows = tableLines
                .slice(2)
                .map((l) =>
                  l
                    .split('|')
                    .map((c) => c.trim())
                    .filter(Boolean)
                );
              return (
                <div
                  key={i}
                  className="my-8 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-md"
                >
                  <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/90 text-amber-300 font-mono">
                        {headerCols.map((col, cIdx) => (
                          <th key={cIdx} className="py-3.5 px-4 sm:px-5 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {dataRows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-slate-900/60 transition-colors odd:bg-slate-950/40 even:bg-slate-900/20"
                        >
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="py-3 px-4 sm:px-5 leading-normal">
                              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          }

          // Interactive Checklists
          if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
            const checklistItems = trimmed.split('\n');
            return (
              <div key={i} className="my-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  Production Engineering Checklist
                </span>
                <ul className="space-y-2.5">
                  {checklistItems.map((item, idx) => {
                    const isChecked = item.includes('[x]');
                    const label = item.replace(/-\s*\[[ x]\]\s*/, '');
                    return (
                      <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-slate-200">
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 ${isChecked ? 'text-emerald-400' : 'text-slate-600'}`}
                        />
                        <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(label) }} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n');
            return (
              <ul key={i} className="space-y-2.5 my-4 pl-4 marker:text-amber-400 list-disc">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item.replace(/^[-*]\s+/, '')) }} />
                  </li>
                ))}
              </ul>
            );
          }

          // Regular paragraph
          return (
            <p
              key={i}
              className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
            />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs font-semibold">$1</code>'
      );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Mobile Menu Trigger */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/tutorials')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>All Tutorials</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs sm:text-sm font-mono text-amber-400 truncate max-w-[200px] sm:max-w-xs">
            {tutorial.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share guide"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Mobile Table of Contents Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Chapters ({chapters.length})</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Center/Right Reading Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================== SIDEBAR ===================== */}
        <aside
          className={`
            lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24
            bg-[#090e1a] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl
            ${mobileMenuOpen ? 'fixed inset-x-4 top-20 bottom-4 z-50 overflow-y-auto block bg-[#0a0f1d]' : 'hidden lg:block'}
          `}
        >
          {/* Sidebar Header */}
          <div className="space-y-3 pb-4 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Table of Contents
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {activeIdx + 1}/{chapters.length}
              </span>
            </div>

            <h3 className="text-base font-bold text-white tracking-tight">{tutorial.title}</h3>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Progress</span>
                <span className="text-amber-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Search filter input */}
            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter 18 chapters..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Chapters Scrollable List */}
          <div className="mt-3 space-y-1.5 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1 select-none">
            {filteredChapters.map((ch) => {
              const realIndex = chapters.findIndex((c) => c.id === ch.id);
              const isActive = realIndex === activeIdx;
              const isDone = completedChapters.includes(realIndex);

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(realIndex)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer group ${
                    isActive
                      ? 'bg-amber-500/15 text-white border border-amber-500/40 shadow-md shadow-amber-500/10'
                      : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : isDone
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                        : 'bg-slate-900 text-slate-500 border border-slate-800 group-hover:border-slate-700'
                    }`}
                  >
                    {ch.number.toString().padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-semibold leading-snug truncate ${
                        isActive ? 'text-amber-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {ch.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{ch.summary}</div>
                  </div>

                  {isDone && !isActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ===================== MAIN READING PANE ===================== */}
        <main className="lg:col-span-8 xl:col-span-9 bg-[#0b101c] border border-slate-800/90 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
          {/* Chapter Metadata Header */}
          <div className="pb-6 border-b border-slate-800/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                Chapter {currentChapter.number.toString().padStart(2, '0')} of {chapters.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> ~4-5 min read
                </span>
                <span>·</span>
                <span className="text-slate-400">100% Unabridged Reference</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {currentChapter.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              {currentChapter.summary}
            </p>
          </div>

          {/* Rendered Chapter Content */}
          <div className="py-6">{renderMarkdown(currentChapter.contentMarkdown)}</div>

          {/* Step-by-Step Navigation Bar */}
          <div className="pt-8 mt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeIdx === 0
                  ? 'border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white hover:border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>Previous Topic</span>
            </button>

            <div className="text-xs font-mono text-slate-400">
              Chapter {activeIdx + 1} of {chapters.length}
            </div>

            <button
              onClick={handleNext}
              disabled={activeIdx === chapters.length - 1}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20 ${
                activeIdx === chapters.length - 1
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold'
              }`}
            >
              <span>{activeIdx === chapters.length - 1 ? 'End of Notes' : 'Next Topic'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
