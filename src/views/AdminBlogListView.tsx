import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { BlogPost } from '../types/blog.ts';

interface AdminBlogListViewProps {
  onNavigate: (path: string) => void;
}

export const AdminBlogListView: React.FC<AdminBlogListViewProps> = ({ onNavigate }) => {
  const { user, claimAdminRole } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Strict Admin Authorization Check
  const isStrictAdmin = Boolean(
    user &&
    user.role === 'admin' &&
    user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminBlogs();
      setPosts(res.posts || []);
    } catch (err) {
      console.error('Failed to load admin blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const handleUpdate = () => {
      fetchPosts();
    };

    window.addEventListener('blog-updated', handleUpdate);
    window.addEventListener('catalog-updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('codingthunder_blog_sync');
        bc.onmessage = () => {
          fetchPosts();
        };
      } catch {}
    }

    return () => {
      window.removeEventListener('blog-updated', handleUpdate);
      window.removeEventListener('catalog-updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      if (bc) bc.close();
    };
  }, []);

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setDeletingId(postToDelete.id);
    try {
      await api.deleteBlog(postToDelete.id);
      setPosts(posts.filter((p) => p.id !== postToDelete.id));
      showToast('Article deleted successfully.');
    } catch (err) {
      console.error('Failed to delete post:', err);
      showToast('⚠️ Failed to delete article.');
    } finally {
      setDeletingId(null);
      setPostToDelete(null);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  if (!isStrictAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Admin Authentication Required</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Access to the Content Management System (CMS) is restricted to verified administrators (
          <code className="text-amber-400 font-mono">mishrashashwat90@gmail.com</code>).
        </p>

        {user && user.email?.toLowerCase().trim() === 'mishrashashwat90@gmail.com' ? (
          <button
            onClick={() => {
              claimAdminRole();
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg cursor-pointer transition"
          >
            Activate Admin CMS Session
          </button>
        ) : (
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Return to Homepage
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Admin CMS Architecture
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-400">Content Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Articles & Technical Tutorials
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author, edit, format, and publish deep-dive tutorials and engineering cheat sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/blog')}
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Public Blog Feed</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/blog/create')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Author New Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block mb-1">Total Articles</span>
          <span className="text-2xl font-black text-white font-mono">{posts.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-emerald-400 block mb-1">Published</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{publishedCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-amber-400 block mb-1">Drafts</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{draftCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c101c] border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-cyan-400 block mb-1">Total Article Reads</span>
          <span className="text-2xl font-black text-cyan-300 font-mono">{totalViews.toLocaleString()}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c101c] border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, tag, or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={fetchPosts}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c101c] shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No articles found</h3>
            <p className="text-xs text-slate-400">
              {search ? 'Try clearing your search filters.' : 'Get started by publishing your first article!'}
            </p>
            <button
              onClick={() => onNavigate('/admin/blog/create')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Author New Article
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Article Details</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Read Time</th>
                  <th className="py-3.5 px-4 font-bold">Views</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-4 max-w-md">
                      <div className="flex items-start gap-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-16 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white font-sans line-clamp-1 hover:text-amber-300 cursor-pointer">
                            {post.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 block truncate">
                            /blog/{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 font-semibold">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          post.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{post.readTime}</td>
                    <td className="py-4 px-4 text-slate-300 font-semibold">
                      {(post.views || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => onNavigate(`/blog/${post.slug}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="View Public Article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigate(`/admin/blog/edit/${post.id}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={deletingId === post.id}
                        onClick={() => setPostToDelete(post)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e1322] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white">Delete Article?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <span className="text-slate-200 font-semibold font-mono">"{postToDelete.title}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {deletingId ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs shadow-2xl">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
