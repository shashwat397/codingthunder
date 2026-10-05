import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Download, ShieldCheck, Check, Sparkles, X, FileText, Lock } from 'lucide-react';
import { Ebook } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { downloadEbookFile } from '../utils/downloadHelper.ts';

interface EbookDetailViewProps {
  slugOrId: string;
  onNavigate: (path: string) => void;
}

export const EbookDetailView: React.FC<EbookDetailViewProps> = ({ slugOrId, onNavigate }) => {
  const { user, openCheckout } = useAuth();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [license, setLicense] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadEbook() {
      try {
        const res = await api.getEbook(slugOrId);
        if (res) {
          setEbook(res.ebook || null);
          setLicense(res.license || null);
        }
      } catch (err) {
        console.error('Failed to load ebook:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEbook();
  }, [slugOrId, user]);

  const handleDownload = () => {
    if (!ebook) return;
    downloadEbookFile(ebook);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-64 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ebook Not Found</h2>
        <button
          onClick={() => onNavigate('/ebooks')}
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Back to Ebooks
        </button>
      </div>
    );
  }

  const isOwned = !!license || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20">
      {/* Top Breadcrumb */}
      <div className="border-b border-slate-800 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => onNavigate('/ebooks')}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Ebooks</span>
          </button>
          <div className="font-mono text-amber-400">Digital Edition · PDF + Code</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: 3D Cover Display */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl bg-[#0c101c] border border-slate-800 p-8 flex items-center justify-center shadow-2xl">
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-56 h-auto object-cover rounded-xl shadow-2xl border border-slate-700 hover:scale-105 transition-transform duration-300"
              />
            </div>

            <button
              onClick={() => setPreviewOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Read Sample Pages (Look Inside)</span>
            </button>
          </div>

          {/* Right 2 Columns: Book Info, Table of Contents, Purchase */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Official Engineering Publication
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {ebook.title}
              </h1>
              <p className="text-sm font-medium text-slate-300">{ebook.subtitle}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                <span>By {ebook.author}</span>
                <span>·</span>
                <span>{ebook.pages} Pages</span>
                <span>·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DRM-Free Digital License
                </span>
              </div>
            </div>

            {/* Pricing & Checkout Card */}
            <div className="p-6 rounded-2xl bg-[#0c101c] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400 font-mono">Special Direct Pricing</div>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-3xl font-black text-white">₹{ebook.price}</span>
                  <span className="text-sm text-slate-500 line-through">₹{ebook.originalPrice}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    SAVE ₹{ebook.originalPrice - ebook.price}
                  </span>
                </div>
              </div>

              <div>
                {isOwned ? (
                  <button
                    onClick={handleDownload}
                    className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Ebook Package</span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      openCheckout({
                        itemType: 'ebook',
                        itemId: ebook.id,
                        itemTitle: ebook.title,
                        price: ebook.price,
                      })
                    }
                    className="py-3.5 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-xl shadow-amber-500/20 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Buy & Download Instant</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">About This Book</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{ebook.description}</p>
            </div>

            {/* What's Included */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold">Included in Download</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {ebook.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table of Contents */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Table of Contents</h3>
              <div className="rounded-xl border border-slate-800 divide-y divide-slate-800/60 bg-[#0c101c]">
                {ebook.chapters.map((ch, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-medium text-white">{ch.title}</span>
                    <span className="font-mono text-slate-500">Page {ch.page}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#0c101c] border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <BookOpen className="w-4 h-4" />
                <span>Sample Preview: {ebook.title}</span>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <div className="whitespace-pre-wrap font-sans">{ebook.previewSnippet}</div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Showing 1 of {ebook.pages} pages</span>
              <button
                onClick={() => {
                  setPreviewOpen(false);
                  if (!isOwned) {
                    openCheckout({
                      itemType: 'ebook',
                      itemId: ebook.id,
                      itemTitle: ebook.title,
                      price: ebook.price,
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20"
              >
                {isOwned ? 'Close Preview' : `Unlock Full Book (₹${ebook.price})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
