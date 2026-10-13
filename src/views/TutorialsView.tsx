import React, { useState, useEffect } from 'react';
import { Search, FileText, ArrowRight, Eye, Clock, Tag } from 'lucide-react';
import { Tutorial } from '../types/index.ts';
import { api } from '../services/api.ts';

interface TutorialsViewProps {
  onNavigate: (path: string) => void;
}

const CATEGORIES = ['All', 'Power BI', 'Python', 'React', 'JavaScript', 'Tools & DevOps'];

export const TutorialsView: React.FC<TutorialsViewProps> = ({ onNavigate }) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const res = await api.getTutorials({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search || undefined,
      });
      setTutorials(Array.isArray(res?.tutorials) ? res.tutorials : []);
    } catch (err) {
      console.error('Failed to load tutorials:', err);
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, [selectedCategory]);

  useEffect(() => {
    const onCatalogUpdated = () => {
      fetchTutorials();
    };
    window.addEventListener('catalog-updated', onCatalogUpdated);
    return () => window.removeEventListener('catalog-updated', onCatalogUpdated);
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTutorials();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Developer Knowledge Base
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Tutorials & Cheat Sheets</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Concise, high-signal programming tutorials, cheatsheets, and architecture blueprints. Clean code snippets with zero fluff.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tutorials by keyword (e.g. Python, Hooks, Docker)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-mono mr-1">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Masterclasses */}
      <div className="grid grid-cols-1 gap-6">
        {/* Banner: Data Analytics Playbook Complete Notes */}
        <div className="rounded-3xl bg-gradient-to-r from-cyan-600/20 via-[#0a1526] to-blue-600/10 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 flex items-center gap-1">
                  <span>📈 COMPREHENSIVE PLAYBOOK</span>
                </span>
                <span className="text-xs font-mono text-slate-400">12 In-Depth Lessons · 100% Free · Production Capstone</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Data Analytics Playbook: Complete Notes
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The definitive end-to-end curriculum. Master the 6-stage analytics lifecycle, advanced SQL window functions, relational ER diagrams, Python Pandas data pipelines, IQR outlier detection, Power BI star schemas, and a production fraud investigation capstone.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-400 pt-1">
                <span className="text-cyan-400 font-semibold">✓ Interactive Lifecycle & ER Diagrams</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">✓ SQL Joins Venn Visualizer</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">✓ Production Fraud Capstone & Interview Rubric</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/tutorials/data-analytics-playbook')}
              className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer shrink-0 active:scale-95"
            >
              <span>Launch Analytics Playbook</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner: Excel Beginner to Advanced */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600/15 via-[#0c181f] to-teal-500/10 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span>📊 ADVANCED SPREADSHEETS</span>
                </span>
                <span className="text-xs font-mono text-slate-400">11 In-Depth Lessons · 100% Free · Real-World Analytics</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Excel: Beginner to Advanced Complete Course
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                From basic formulas and absolute referencing to fraud detection scoring logic, subscriber count bucketing, INDEX+MATCH, XLOOKUP, dynamic arrays, Power Query automated ETL pipelines, and senior technical interview prep.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-400 pt-1">
                <span className="text-emerald-400 font-semibold">✓ Fraud Detection Flowcharts</span>
                <span>·</span>
                <span className="text-cyan-400 font-semibold">✓ Power Query ETL Workflows</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">✓ 10 Senior Interview Scenario Models</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/tutorials/excel-beginner-to-advanced')}
              className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0 active:scale-95"
            >
              <span>Launch Excel Player</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner 1: Python Beginner to Advanced */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500/15 via-[#0c1624] to-cyan-500/10 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span>🐍 NEW MASTERCLASS</span>
                </span>
                <span className="text-xs font-mono text-slate-400">18 In-Depth Lessons · 100% Free · Real-World Projects</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Python: Beginner to Advanced Complete Course
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                From foundational syntax and CPython bytecode execution to object-oriented architectures, memory-efficient generators, decorators, file automation, requests, and high-stakes technical interview prep.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-400 pt-1">
                <span className="text-emerald-400 font-semibold">✓ SVG Architecture Flowcharts</span>
                <span>·</span>
                <span className="text-cyan-400 font-semibold">✓ Production Automation Scripts</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">✓ 15 Senior Interview Trap Questions</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/tutorials/python-beginner-to-advanced')}
              className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0 active:scale-95"
            >
              <span>Launch Python Player</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner 2: Power BI Beginner to Advanced */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0e1424] to-yellow-500/10 border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                  <span>⚡ FLAGSHIP COURSE</span>
                </span>
                <span className="text-xs font-mono text-slate-400">16 In-Depth Lessons · 100% Free</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Power BI: Beginner to Advanced Masterclass
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Master enterprise Business Intelligence from scratch. Complete deep dive into Power Query M transformations, Ralph Kimball Star Schemas, advanced DAX (CALCULATE, SUMX, Time Intelligence), Row-Level Security (RLS), and VertiPaq query tuning.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-400 pt-1">
                <span className="text-emerald-400 font-semibold">✓ SVG Architecture Workflows</span>
                <span>·</span>
                <span className="text-cyan-400 font-semibold">✓ Interactive DAX & M Codeblocks</span>
                <span>·</span>
                <span className="text-amber-400 font-semibold">✓ Live CSS Dashboard Mockups</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/tutorials/power-bi-beginner-to-advanced')}
              className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0 active:scale-95"
            >
              <span>Launch Power BI Player</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : tutorials.length === 0 ? (
        <div className="text-center py-16 bg-[#0a0f19] border border-slate-800 rounded-2xl p-8">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No tutorials found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Try clearing your search query or picking another category.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearch('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tut) => (
            <div
              key={tut.id}
              onClick={() => onNavigate(`/tutorials/${tut.slug}`)}
              className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                  <span className="text-amber-400 font-medium">{tut.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {tut.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                  {tut.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {tut.description}
                </p>

                {/* Tags (zero-pill discipline: unboxed clean text) */}
                <div className="flex flex-wrap items-center gap-1.5 mt-4 text-[11px] text-slate-500 font-mono">
                  {tut.tags.map((tag, i) => (
                    <span key={i}>
                      #{tag}
                      {i < tut.tags.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {tut.views.toLocaleString()} reads
                </span>
                <span className="text-amber-400 font-sans group-hover:underline flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
