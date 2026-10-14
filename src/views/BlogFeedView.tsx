import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Tag,
  Calendar,
  Sparkles,
  TrendingUp,
  Filter,
  User,
  Share2,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { BlogPost } from '../types/blog.ts';

interface BlogFeedViewProps {
  onNavigate: (path: string) => void;
}

const CATEGORIES = [
  'All',
  'Data Analytics',
  'Google Colab',
  'Looker Studio',
  'BigQuery',
  'Data Engineering',
  'SQL',
  'Python',
];

export const BlogFeedView: React.FC<BlogFeedViewProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getBlogs({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search || undefined,
        page,
        limit: 9,
      });
      setPosts(res.posts || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const handleUpdate = () => {
      fetchPosts();
    };

    // 1. In-tab custom events
    window.addEventListener('blog-updated', handleUpdate);
    window.addEventListener('catalog-updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    // 2. Cross-tab storage updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'codingthunder_blogs') {
        fetchPosts();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Document visibility change (user returns to tab)
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchPosts();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 4. BroadcastChannel across all open tabs/windows
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('codingthunder_blog_sync');
        bc.onmessage = () => {
          fetchPosts();
        };
      } catch {}
    }

    // 5. Background polling every 15s to keep public viewers in sync
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchPosts();
      }
    }, 15000);

    return () => {
      window.removeEventListener('blog-updated', handleUpdate);
      window.removeEventListener('catalog-updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  // Find top featured article if on page 1 and no search query
  const featuredPost = !search && selectedCategory === 'All' && page === 1
    ? posts.find((p) => p.featured) || posts[0]
    : null;

  const displayPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Technical Architecture & Engineering Insights</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Codingthunder <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Blog & Articles</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Production-tested tutorials, machine learning blueprints, cloud data warehouse patterns, and modern analytics engineering deep-dives.
        </p>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by keyword or tag (e.g. Google Colab, BigQuery, Random Forest)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-mono mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Topic:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-medium ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article Spotlight Card */}
      {featuredPost && (
        <div
          onClick={() => onNavigate(`/blog/${featuredPost.slug}`)}
          className="group rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden cursor-pointer transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> FEATURED ARTICLE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {featuredPost.tags.slice(0, 4).map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <img
                    src={featuredPost.authorAvatar}
                    alt={featuredPost.authorName}
                    className="w-6 h-6 rounded-full bg-slate-800"
                  />
                  <span className="text-white font-medium">{featuredPost.authorName}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>

                <span className="text-amber-400 font-sans font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Master Tutorial <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 aspect-video lg:aspect-auto lg:h-72 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : displayPosts.length === 0 ? (
        <div className="text-center py-20 bg-[#0a0f19] border border-slate-800 rounded-3xl p-8 space-y-4 max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {!search && selectedCategory === 'All' ? 'No articles published yet' : 'No matching articles found'}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {!search && selectedCategory === 'All'
              ? 'New engineering blueprints, analytics tutorials, and machine learning guides will appear here as soon as they are published in the Admin CMS.'
              : 'Try adjusting your search criteria or switching to a different category filter.'}
          </p>
          {(search || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearch('');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition shadow-lg shadow-amber-500/20"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="group rounded-3xl bg-[#0c101c] border border-slate-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer"
            >
              <div>
                {/* Featured Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-950 border-b border-slate-800/80">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 font-semibold border border-slate-700/80">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-600" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-5 h-5 rounded-full bg-slate-800"
                  />
                  <span className="text-slate-300 truncate max-w-[120px]">{post.authorName}</span>
                </div>

                <span className="text-amber-400 font-sans font-semibold group-hover:underline flex items-center gap-1">
                  Read <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-slate-400 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
