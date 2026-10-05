import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Eye, Share2, Check, BookOpen, FileText } from 'lucide-react';
import { Tutorial } from '../types/index.ts';
import { api } from '../services/api.ts';
import { CodeBlock } from '../components/common/CodeBlock.tsx';

interface TutorialDetailViewProps {
  slugOrId: string;
  onNavigate: (path: string) => void;
}

export const TutorialDetailView: React.FC<TutorialDetailViewProps> = ({ slugOrId, onNavigate }) => {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadTutorial() {
      try {
        const res = await api.getTutorial(slugOrId);
        if (res) {
          setTutorial(res.tutorial || null);
        }
      } catch (err) {
        console.error('Failed to load tutorial:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTutorial();
  }, [slugOrId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/2 mx-auto mb-4" />
        <div className="h-64 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Tutorial Not Found</h2>
        <button
          onClick={() => onNavigate('/tutorials')}
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Back to Tutorials
        </button>
      </div>
    );
  }

  // Simple Markdown parser for headers, codeblocks, and text
  const renderMarkdown = (markdown: string) => {
    const parts: React.ReactNode[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const precedingText = markdown.substring(lastIndex, match.index);
      if (precedingText) {
        parts.push(
          <div key={`text-${lastIndex}`} className="space-y-4 my-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            {precedingText.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={i} className="text-2xl sm:text-3xl font-black text-white mt-8 mb-4">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-xl sm:text-2xl font-bold text-white mt-6 mb-3">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-base sm:text-lg font-bold text-amber-300 mt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={i} className="text-slate-300">
                  {paragraph}
                </p>
              );
            })}
          </div>
        );
      }

      const lang = match[1] || 'text';
      const code = match[2];
      parts.push(
        <CodeBlock key={`code-${match.index}`} code={code} language={lang} filename={`snippet.${lang}`} />
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    const remainingText = markdown.substring(lastIndex);
    if (remainingText) {
      parts.push(
        <div key={`text-end`} className="space-y-4 my-4 text-slate-300 leading-relaxed text-sm sm:text-base">
          {remainingText.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    }

    return parts;
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20">
      {/* Top Breadcrumb */}
      <div className="border-b border-slate-800 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => onNavigate('/tutorials')}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tutorials</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400">{tutorial.category}</span>
            <span>·</span>
            <span>{tutorial.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {/* Article Header */}
        <div className="space-y-4 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="text-amber-400 font-semibold">{tutorial.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {tutorial.readTime}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {tutorial.views.toLocaleString()} reads
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {tutorial.title}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            {tutorial.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 font-mono">
              {tutorial.tags.map((t, idx) => (
                <span key={idx}>
                  #{t}
                  {idx < tutorial.tags.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer border border-slate-800"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Guide</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="py-8 font-sans">
          {renderMarkdown(tutorial.contentMarkdown)}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0c101c] border border-amber-500/30 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Want to go deeper into production engineering?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Check out our comprehensive masterclasses with video walkthroughs, GitHub repositories, and interactive exercises.
          </p>
          <button
            onClick={() => onNavigate('/courses')}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Explore Masterclass Courses ⚡
          </button>
        </div>
      </article>
    </div>
  );
};
