import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Download, Star, CheckCircle, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { Ebook } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface EbooksViewProps {
  onNavigate: (path: string) => void;
}

export const EbooksView: React.FC<EbooksViewProps> = ({ onNavigate }) => {
  const { openCheckout } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const res = await api.getEbooks({ search: search || undefined });
      setEbooks(Array.isArray(res?.ebooks) ? res.ebooks : []);
    } catch (err) {
      console.error('Failed to load ebooks:', err);
      setEbooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();

    const onCatalogUpdated = () => {
      fetchEbooks();
    };
    window.addEventListener('catalog-updated', onCatalogUpdated);
    return () => window.removeEventListener('catalog-updated', onCatalogUpdated);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEbooks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Developer Handbooks
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Engineering Ebooks</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Deep architectural blueprints, system design patterns, and interview playbooks in high-resolution PDF and ePub formats. Free lifetime updates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ebooks by title, author, or topic..."
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
      </div>

      {/* Customer Support Notice */}
      <div className="rounded-2xl bg-slate-900/80 border border-amber-500/30 p-4 sm:p-5 flex items-start gap-3.5 shadow-lg backdrop-blur-sm">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <Info className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <span className="font-bold text-white">Having trouble? </span>
          <span>
            In case of any queries, website glitches, or issues downloading your resources, please message us directly:{' '}
          </span>
          <a
            href="https://wa.me/919868652237"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1"
          >
            <span>Chat with us on WhatsApp</span>
          </a>
          <span>. Our team will assist you as soon as possible.</span>
        </div>
      </div>

      {/* Ebooks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        <div className="text-center py-16 bg-[#0a0f19] border border-slate-800 rounded-2xl p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No ebooks found</h3>
          <button
            onClick={() => {
              setSearch('');
              fetchEbooks();
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="rounded-2xl bg-[#0c101c] border border-slate-800 hover:border-amber-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl p-5"
            >
              <div>
                {/* 3D-styled Cover Display */}
                <div
                  onClick={() => onNavigate(`/ebooks/${ebook.slug}`)}
                  className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative cursor-pointer group mb-5 flex items-center justify-center p-4"
                >
                  <img
                    src={ebook.coverImage}
                    alt={ebook.title}
                    className="h-full w-auto object-cover rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-300 border border-slate-700"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Ebook Details */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                  <span>By {ebook.author}</span>
                  <span>{ebook.pages} Pages</span>
                </div>

                <h3
                  onClick={() => onNavigate(`/ebooks/${ebook.slug}`)}
                  className="text-base font-bold text-white hover:text-amber-300 transition-colors cursor-pointer line-clamp-2"
                >
                  {ebook.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {ebook.description}
                </p>
              </div>

              {/* Price & Action Row */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                <div className="font-mono">
                  <div className="text-lg font-bold text-white">₹{ebook.price}</div>
                  <div className="text-[11px] text-slate-500 line-through">₹{ebook.originalPrice}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate(`/ebooks/${ebook.slug}`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() =>
                      openCheckout({
                        itemType: 'ebook',
                        itemId: ebook.id,
                        itemTitle: ebook.title,
                        price: ebook.price,
                      })
                    }
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
