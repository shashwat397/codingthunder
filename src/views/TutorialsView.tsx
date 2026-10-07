import React, { useState, useEffect } from 'react';
import { Search, FileText, ArrowRight, Eye, Clock, Tag } from 'lucide-react';
import { Tutorial } from '../types/index.ts';
import { api } from '../services/api.ts';

interface TutorialsViewProps {
  onNavigate: (path: string) => void;
}

const CATEGORIES = ['All', 'Python', 'React', 'JavaScript', 'Tools & DevOps'];

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
